"""Analyze a reference video for pacing, dimensions, shot cuts, and keyframes.

Usage:
    python scripts/analyze_reference.py references/example.mp4
    python scripts/analyze_reference.py references/example.mp4 --threshold 0.25 --max-frames 24
"""

from __future__ import annotations

import argparse
import json
import re
import subprocess
import sys
from pathlib import Path


def run_cmd(cmd: list[str]) -> subprocess.CompletedProcess[str]:
    result = subprocess.run(cmd, capture_output=True, text=True, check=False)
    if result.returncode != 0:
        raise RuntimeError(
            f"Command failed ({result.returncode}): {' '.join(cmd)}\n{result.stderr.strip()}"
        )
    return result


def parse_fps(raw_fps: str) -> float:
    if "/" in raw_fps:
        num, den = raw_fps.split("/", maxsplit=1)
        den_val = float(den)
        return round(float(num) / den_val, 3) if den_val else 0.0
    return round(float(raw_fps), 3)


def probe_video(video_path: Path) -> dict:
    cmd = [
        "ffprobe",
        "-v",
        "quiet",
        "-print_format",
        "json",
        "-show_format",
        "-show_streams",
        str(video_path),
    ]
    data = json.loads(run_cmd(cmd).stdout)
    video_stream = next(
        (s for s in data.get("streams", []) if s.get("codec_type") == "video"),
        None,
    )
    audio_stream = next(
        (s for s in data.get("streams", []) if s.get("codec_type") == "audio"),
        None,
    )
    if not video_stream:
        raise ValueError(f"No video stream found in {video_path}")

    width = int(video_stream["width"])
    height = int(video_stream["height"])
    fps = parse_fps(video_stream.get("r_frame_rate", "0"))
    duration = float(data.get("format", {}).get("duration") or video_stream.get("duration") or 0)

    return {
        "width": width,
        "height": height,
        "fps": fps,
        "duration": round(duration, 3),
        "aspect_ratio": f"{width}:{height}",
        "has_audio": audio_stream is not None,
        "video_codec": video_stream.get("codec_name"),
    }


def detect_scene_cuts(video_path: Path, threshold: float) -> list[float]:
    cmd = [
        "ffmpeg",
        "-hide_banner",
        "-i",
        str(video_path),
        "-filter:v",
        f"select='gt(scene,{threshold})',showinfo",
        "-f",
        "null",
        "-",
    ]
    res = subprocess.run(cmd, capture_output=True, text=True, check=False)
    timestamps = [0.0]
    for match in re.finditer(r"pts_time:([0-9]+(?:\.[0-9]+)?)", res.stderr):
        t = round(float(match.group(1)), 3)
        if t - timestamps[-1] >= 0.25:
            timestamps.append(t)
    return timestamps


def build_sample_timestamps(
    cuts: list[float], duration: float, max_frames: int
) -> list[float]:
    timestamps = list(cuts)
    # Motion-graphic Reels often animate smoothly without hard cuts; add periodic samples if sparse.
    if len(timestamps) < 6 and duration > 0:
        step = max(duration / min(max_frames, 12), 0.75)
        t = 0.0
        while t < max(duration - 0.1, 0):
            if all(abs(t - existing) >= 0.45 for existing in timestamps):
                timestamps.append(round(t, 3))
            t += step
    timestamps = sorted(set(round(t, 3) for t in timestamps if 0 <= t < duration))
    if len(timestamps) > max_frames:
        stride = len(timestamps) / max_frames
        timestamps = [timestamps[int(i * stride)] for i in range(max_frames)]
    return timestamps


def extract_frames(video_path: Path, timestamps: list[float], out_dir: Path) -> list[dict]:
    out_dir.mkdir(parents=True, exist_ok=True)
    for old_frame in out_dir.glob("frame_*.png"):
        old_frame.unlink()

    frames: list[dict] = []
    for idx, ts in enumerate(timestamps, start=1):
        frame_path = out_dir / f"frame_{idx:03d}_{ts:.2f}s.png"
        cmd = [
            "ffmpeg",
            "-y",
            "-ss",
            f"{ts:.3f}",
            "-i",
            str(video_path),
            "-frames:v",
            "1",
            "-q:v",
            "2",
            str(frame_path),
        ]
        run_cmd(cmd)
        frames.append(
            {
                "index": idx,
                "timestamp": ts,
                "path": str(frame_path.as_posix()),
            }
        )
    return frames


def analyze(video_path: Path, threshold: float, max_frames: int) -> Path:
    if not video_path.exists():
        raise FileNotFoundError(f"Reference video not found: {video_path}")

    meta = probe_video(video_path)
    cuts = detect_scene_cuts(video_path, threshold)
    duration = meta["duration"]

    shot_boundaries = cuts + ([duration] if duration > cuts[-1] else [])
    shot_durations = [
        round(shot_boundaries[i + 1] - shot_boundaries[i], 3)
        for i in range(len(shot_boundaries) - 1)
    ]
    avg_shot = round(sum(shot_durations) / len(shot_durations), 3) if shot_durations else duration

    out_root = video_path.parent / video_path.stem
    frames_dir = out_root / "frames"
    sample_ts = build_sample_timestamps(cuts, duration, max_frames)
    frames = extract_frames(video_path, sample_ts, frames_dir)

    analysis = {
        "source": str(video_path.as_posix()),
        "video": meta,
        "pacing": {
            "scene_threshold": threshold,
            "cut_timestamps": cuts,
            "shot_count": len(shot_durations) or 1,
            "shot_durations": shot_durations,
            "avg_shot_duration": avg_shot,
        },
        "frames": frames,
    }

    out_json = out_root / "analysis.json"
    out_json.parent.mkdir(parents=True, exist_ok=True)
    out_json.write_text(json.dumps(analysis, indent=2), encoding="utf-8")
    return out_json


def main() -> int:
    parser = argparse.ArgumentParser(description="Extract pacing & keyframes from a reference video.")
    parser.add_argument("video", type=Path, help="Path to reference video file (e.g. references/clip.mp4)")
    parser.add_argument("--threshold", type=float, default=0.28, help="FFmpeg scene cut threshold (0-1)")
    parser.add_argument("--max-frames", type=int, default=20, help="Maximum keyframes to extract")
    args = parser.parse_args()

    out_json = analyze(args.video, args.threshold, args.max_frames)
    data = json.loads(out_json.read_text(encoding="utf-8"))
    print(f"Saved analysis: {out_json}")
    print(
        f"Resolution: {data['video']['width']}x{data['video']['height']} @ {data['video']['fps']} fps | "
        f"Duration: {data['video']['duration']}s | Shots: {data['pacing']['shot_count']} "
        f"(avg {data['pacing']['avg_shot_duration']}s) | Extracted frames: {len(data['frames'])}"
    )
    return 0


if __name__ == "__main__":
    sys.exit(main())

