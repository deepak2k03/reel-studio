"""Extract visual palette, lighting polarity, and pacing style from a reference video.

Usage:
    python scripts/extract_style.py <video-path> --out <style-spec.json>
"""

from __future__ import annotations

import argparse
import json
import re
import subprocess
import sys
from pathlib import Path

import numpy as np


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
    if not video_stream:
        raise ValueError(f"No video stream found in {video_path}")

    width = int(video_stream["width"])
    height = int(video_stream["height"])
    fps = parse_fps(video_stream.get("r_frame_rate", "0"))
    duration = float(
        data.get("format", {}).get("duration") or video_stream.get("duration") or 0
    )
    return {
        "width": width,
        "height": height,
        "fps": fps,
        "duration": round(duration, 3),
    }


def detect_cuts(video_path: Path, duration: float) -> list[float]:
    for threshold, min_gap in ((0.25, 0.35), (0.10, 1.4)):
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
        cuts = [0.0]
        for match in re.finditer(r"pts_time:([0-9]+(?:\.[0-9]+)?)", res.stderr):
            t = round(float(match.group(1)), 3)
            if t - cuts[-1] >= min_gap:
                cuts.append(t)
        if len(cuts) > 1 or duration <= 6.0:
            return cuts
    return [0.0]


def sample_rgb_frames(video_path: Path, duration: float, count: int = 8) -> np.ndarray:
    """Decode up to `count` small 160x90 RGB frames directly via FFmpeg pipe."""
    w, h = 160, 90
    if duration <= 0.2:
        timestamps = [0.0]
    else:
        timestamps = [
            round(duration * (i + 0.5) / count, 3) for i in range(count)
        ]

    frames: list[np.ndarray] = []
    for ts in timestamps:
        cmd = [
            "ffmpeg",
            "-v",
            "quiet",
            "-ss",
            f"{ts:.3f}",
            "-i",
            str(video_path),
            "-frames:v",
            "1",
            "-vf",
            f"scale={w}:{h}:flags=area",
            "-f",
            "rawvideo",
            "-pix_fmt",
            "rgb24",
            "pipe:1",
        ]
        res = subprocess.run(cmd, capture_output=True, check=False)
        expected = w * h * 3
        if res.returncode == 0 and len(res.stdout) == expected:
            arr = np.frombuffer(res.stdout, dtype=np.uint8).reshape((h, w, 3))
            frames.append(arr)

    if not frames:
        raise RuntimeError(f"Could not sample video frames from {video_path}")
    return np.stack(frames, axis=0)


def rgb_to_hex(rgb: tuple[int, int, int]) -> str:
    r, g, b = (max(0, min(255, int(c))) for c in rgb)
    return f"#{r:02X}{g:02X}{b:02X}"


def luminance(rgb: tuple[int, int, int]) -> float:
    return 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2]


def color_dist(a: tuple[int, int, int], b: tuple[int, int, int]) -> float:
    return float(np.sqrt(sum((x - y) ** 2 for x, y in zip(a, b))))


def extract_palette(frames: np.ndarray) -> dict:
    # Border pixels reliably reflect the canvas background across slides/diagrams.
    top = frames[:, :10, :, :].reshape(-1, 3)
    bottom = frames[:, -10:, :, :].reshape(-1, 3)
    left = frames[:, :, :14, :].reshape(-1, 3)
    right = frames[:, :, -14:, :].reshape(-1, 3)
    border = np.concatenate([top, bottom, left, right], axis=0)

    quant_border = (border // 16) * 16 + 8
    unique_b, counts_b = np.unique(quant_border, axis=0, return_counts=True)
    bg_idx = int(np.argmax(counts_b))
    bg_bucket = unique_b[bg_idx]

    mask_bg = np.all(np.abs(border.astype(int) - bg_bucket.astype(int)) <= 20, axis=1)
    bg_pixels = border[mask_bg] if np.any(mask_bg) else border
    bg_rgb = tuple(int(v) for v in np.median(bg_pixels, axis=0))

    is_dark = luminance(bg_rgb) < 128

    if is_dark:
        bg_sec_rgb = tuple(min(255, c + 12) for c in bg_rgb)
        surface_rgba = f"rgba({min(255, bg_rgb[0] + 16)}, {min(255, bg_rgb[1] + 20)}, {min(255, bg_rgb[2] + 30)}, 0.90)"
        text_hex = "#F8FAFC"
        muted_hex = "#94A3B8"
    else:
        bg_sec_rgb = tuple(max(0, c - 14) for c in bg_rgb)
        surface_rgba = "#FFFFFF"
        text_hex = "#1E1915"
        muted_hex = "#6B6158"

    # Extract vibrant, high-contrast accent colors across all sampled pixels.
    all_px = frames.reshape(-1, 3).astype(np.int32)
    sat = np.max(all_px, axis=1) - np.min(all_px, axis=1)
    luma = 0.2126 * all_px[:, 0] + 0.7152 * all_px[:, 1] + 0.0722 * all_px[:, 2]
    bg_luma = luminance(bg_rgb)
    dist_bg = np.linalg.norm(all_px - np.array(bg_rgb, dtype=np.int32), axis=1)
    contrast_ok = (luma >= 105) if is_dark else (luma <= 165)
    vibrant = all_px[(sat >= 55) & (dist_bg >= 65) & contrast_ok & (np.abs(luma - bg_luma) >= 65)]

    accent_rgb: tuple[int, int, int] = (56, 189, 248) if is_dark else (37, 99, 235)
    highlight_rgb: tuple[int, int, int] = (250, 204, 21) if is_dark else (217, 119, 6)

    if len(vibrant) > 12:
        quant_v = (vibrant // 24) * 24 + 12
        unique_v, counts_v = np.unique(quant_v, axis=0, return_counts=True)
        # Weight by both frequency and saturation so small bright accents outrank dark glows.
        v_sat = np.max(unique_v, axis=1) - np.min(unique_v, axis=1)
        scores = counts_v * (v_sat + 20)
        order = np.argsort(-scores)
        chosen: list[tuple[int, int, int]] = []
        for idx in order:
            cand = tuple(int(v) for v in unique_v[idx])
            if all(color_dist(cand, c) >= 70 for c in chosen):
                chosen.append(cand)
            if len(chosen) >= 2:
                break
        if len(chosen) >= 1:
            accent_rgb = chosen[0]
        if len(chosen) >= 2:
            highlight_rgb = chosen[1]

    # Ensure highlight maintains crisp contrast against the active background polarity.
    if is_dark and luminance(highlight_rgb) < 120:
        highlight_rgb = tuple(min(255, int(c * 1.45) + 45) for c in highlight_rgb)
    elif not is_dark and luminance(highlight_rgb) > 155:
        highlight_rgb = tuple(max(0, int(c * 0.72)) for c in highlight_rgb)

    accent_hex = rgb_to_hex(accent_rgb)
    highlight_hex = rgb_to_hex(highlight_rgb)
    border_rgba = (
        f"rgba({accent_rgb[0]}, {accent_rgb[1]}, {accent_rgb[2]}, 0.34)"
        if is_dark
        else "rgba(30, 25, 21, 0.14)"
    )
    accent_soft = (
        f"rgba({accent_rgb[0]}, {accent_rgb[1]}, {accent_rgb[2]}, 0.16)"
        if is_dark
        else f"rgba({accent_rgb[0]}, {accent_rgb[1]}, {accent_rgb[2]}, 0.12)"
    )

    return {
        "isDark": is_dark,
        "bg": rgb_to_hex(bg_rgb),
        "bgSecondary": rgb_to_hex(bg_sec_rgb),
        "surface": surface_rgba,
        "surfaceBorder": border_rgba,
        "text": text_hex,
        "muted": muted_hex,
        "accent": accent_hex,
        "accentSoft": accent_soft,
        "success": "#34D399" if is_dark else "#059669",
        "danger": "#FB7185" if is_dark else "#E11D48",
        "captionHighlight": highlight_hex,
    }


def extract_thumbnail(video_path: Path, duration: float, out_png: Path) -> None:
    ts = round(max(0.0, duration * 0.25), 3)
    out_png.parent.mkdir(parents=True, exist_ok=True)
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
        "3",
        str(out_png),
    ]
    run_cmd(cmd)


def extract_keyframes(
    video_path: Path, duration: float, frames_dir: Path, count: int = 6
) -> None:
    frames_dir.mkdir(parents=True, exist_ok=True)
    for old in frames_dir.glob("ref_*.png"):
        old.unlink()
    timestamps = (
        [0.0]
        if duration <= 0.2
        else [round(duration * (i + 0.5) / count, 3) for i in range(count)]
    )
    for idx, ts in enumerate(timestamps, start=1):
        out_png = frames_dir / f"ref_{idx:02d}_{ts:.2f}s.png"
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
            "3",
            str(out_png),
        ]
        run_cmd(cmd)


def build_style_spec(
    video_path: Path,
    out_path: Path,
    thumb_path: Path | None = None,
    frames_dir: Path | None = None,
) -> dict:
    meta = probe_video(video_path)
    duration = meta["duration"]
    cuts = detect_cuts(video_path, duration)

    boundaries = cuts + ([duration] if duration > cuts[-1] else [])
    shot_durations = [
        round(boundaries[i + 1] - boundaries[i], 3)
        for i in range(len(boundaries) - 1)
    ]
    avg_shot = (
        round(sum(shot_durations) / len(shot_durations), 3)
        if shot_durations
        else max(duration, 3.5)
    )

    frames = sample_rgb_frames(video_path, duration, count=8)
    palette = extract_palette(frames)

    if thumb_path is not None:
        extract_thumbnail(video_path, duration, thumb_path)
    if frames_dir is not None:
        extract_keyframes(video_path, duration, frames_dir, count=6)

    # Map measured reference pacing to Remotion spring physics.
    if avg_shot < 2.5:
        spring_damping, spring_stiffness, spring_mass = 14, 240, 0.72
        pace_label = "fast"
    elif avg_shot <= 4.5:
        spring_damping, spring_stiffness, spring_mass = 16, 200, 0.82
        pace_label = "balanced"
    else:
        spring_damping, spring_stiffness, spring_mass = 18, 170, 0.92
        pace_label = "measured"

    spec = {
        "id": f"ref-{video_path.stem}",
        "name": f"Reference ({video_path.stem})",
        "colors": {
            "bg": palette["bg"],
            "bgSecondary": palette["bgSecondary"],
            "surface": palette["surface"],
            "surfaceBorder": palette["surfaceBorder"],
            "text": palette["text"],
            "muted": palette["muted"],
            "accent": palette["accent"],
            "accentSoft": palette["accentSoft"],
            "success": palette["success"],
            "danger": palette["danger"],
            "captionHighlight": palette["captionHighlight"],
        },
        "typography": {
            "displayFont": "Space Grotesk, Inter, Segoe UI, system-ui, sans-serif",
            "monoFont": "JetBrains Mono, Cascadia Code, Consolas, monospace",
            "titleSize": 58,
            "bodySize": 34,
            "codeSize": 25,
            "captionSize": 50,
            "fontPreset": "editorial-sans",
            "captionStyle": "pill" if palette["isDark"] else "bare",
        },
        "motion": {
            "springDamping": spring_damping,
            "springStiffness": spring_stiffness,
            "springMass": spring_mass,
        },
        "safeZone": {
            "top": 150,
            "bottom": 320,
            "left": 80,
            "right": 80,
        },
        "meta": {
            "sourceWidth": meta["width"],
            "sourceHeight": meta["height"],
            "sourceFps": meta["fps"],
            "sourceDuration": duration,
            "shotCount": len(shot_durations) or 1,
            "avgShotDuration": avg_shot,
            "pace": pace_label,
            "isDark": palette["isDark"],
        },
    }

    out_path.parent.mkdir(parents=True, exist_ok=True)
    out_path.write_text(json.dumps(spec, indent=2), encoding="utf-8")
    return spec


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Extract StyleSpec JSON from a reference video."
    )
    parser.add_argument("video", type=Path, help="Path to reference video")
    parser.add_argument("--out", type=Path, required=True, help="Output style-spec.json path")
    parser.add_argument("--thumb", type=Path, default=None, help="Optional reference thumbnail PNG path")
    parser.add_argument("--frames-dir", type=Path, default=None, help="Optional directory to save 6 reference keyframes for review")
    args = parser.parse_args()

    spec = build_style_spec(args.video, args.out, args.thumb, args.frames_dir)
    print(
        f"Style extracted: bg={spec['colors']['bg']} accent={spec['colors']['accent']} "
        f"highlight={spec['colors']['captionHighlight']} pace={spec['meta']['pace']} "
        f"(avg shot {spec['meta']['avgShotDuration']}s)"
    )
    return 0


if __name__ == "__main__":
    sys.exit(main())
