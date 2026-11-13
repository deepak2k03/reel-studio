"""Clean voice audio with FFmpeg and extract word-level timestamps on CPU.

Usage:
    python scripts/process_voice.py <project-slug>
    python scripts/process_voice.py <project-slug> --input path/to/recording.m4a --model small
"""

from __future__ import annotations

import argparse
import json
import subprocess
import sys
from pathlib import Path

AUDIO_EXTENSIONS = (".wav", ".m4a", ".mp3", ".aac", ".ogg", ".flac", ".webm")
DEFAULT_FPS = 60


def run_cmd(cmd: list[str]) -> subprocess.CompletedProcess[str]:
    result = subprocess.run(cmd, capture_output=True, text=True, check=False)
    if result.returncode != 0:
        raise RuntimeError(
            f"Command failed ({result.returncode}): {' '.join(cmd)}\n{result.stderr.strip()}"
        )
    return result


def find_raw_audio(project_src_dir: Path, project_public_dir: Path) -> Path:
    for folder in (project_public_dir, project_src_dir):
        for ext in AUDIO_EXTENSIONS:
            candidate = folder / f"raw-voice{ext}"
            if candidate.exists():
                return candidate
        for ext in AUDIO_EXTENSIONS:
            matches = sorted(p for p in folder.glob(f"*{ext}") if p.name != "voice.wav")
            if matches:
                return matches[0]
    raise FileNotFoundError(
        f"No raw voice file found in {project_public_dir} or {project_src_dir}. "
        "Place raw-voice.<ext> there or pass --input <path>."
    )


def get_audio_duration(audio_path: Path) -> float:
    cmd = [
        "ffprobe",
        "-v",
        "quiet",
        "-show_entries",
        "format=duration",
        "-of",
        "default=noprint_wrappers=1:nokey=1",
        str(audio_path),
    ]
    out = run_cmd(cmd).stdout.strip()
    return round(float(out), 3)


def clean_audio(
    input_audio: Path,
    output_wav: Path,
    trim_silence: bool,
    silence_db: float,
    keep_pause: float,
) -> float:
    output_wav.parent.mkdir(parents=True, exist_ok=True)
    filters: list[str] = ["highpass=f=75"]
    if trim_silence:
        filters.append(
            f"silenceremove=start_periods=1:start_duration=0.05:start_threshold={silence_db}dB:"
            f"stop_periods=-1:stop_duration={keep_pause}:stop_threshold={silence_db}dB"
        )
    filters.append("loudnorm=I=-14:TP=-1.5:LRA=11")

    cmd = [
        "ffmpeg",
        "-y",
        "-i",
        str(input_audio),
        "-af",
        ",".join(filters),
        "-ar",
        "48000",
        "-ac",
        "1",
        "-c:a",
        "pcm_s16le",
        str(output_wav),
    ]
    run_cmd(cmd)
    return get_audio_duration(output_wav)


def sec_to_frame(sec: float, fps: int) -> int:
    return max(0, round(sec * fps))


def load_whisper_audio(audio_path: Path):
    """Decode audio to mono 16kHz float32 PCM via FFmpeg (avoids PyAV metadata_errors issues)."""
    import numpy as np

    cmd = [
        "ffmpeg",
        "-v",
        "quiet",
        "-i",
        str(audio_path),
        "-ar",
        "16000",
        "-ac",
        "1",
        "-f",
        "f32le",
        "pipe:1",
    ]
    res = subprocess.run(cmd, capture_output=True, check=False)
    if res.returncode != 0:
        raise RuntimeError(f"FFmpeg audio decode failed ({res.returncode}): {res.stderr.decode('utf-8', 'ignore')}")
    return np.frombuffer(res.stdout, dtype=np.float32).copy()


def transcribe_words(
    wav_path: Path, model_size: str, fps: int, language: str | None
) -> dict:
    try:
        from faster_whisper import WhisperModel
    except ImportError as exc:
        raise RuntimeError(
            "faster-whisper is not installed in the active Python environment. "
            "Activate .venv and run: pip install faster-whisper"
        ) from exc

    try:
        model = WhisperModel(
            model_size,
            device="cpu",
            compute_type="int8",
            cpu_threads=8,
            local_files_only=True,
        )
    except Exception:
        model = WhisperModel(
            model_size,
            device="cpu",
            compute_type="int8",
            cpu_threads=8,
        )

    audio_samples = load_whisper_audio(wav_path)
    segments_iter, info = model.transcribe(
        audio_samples,
        language=language,
        beam_size=1,
        best_of=1,
        word_timestamps=True,
        vad_filter=False,
        condition_on_previous_text=False,
    )

    words: list[dict] = []
    segments: list[dict] = []

    for seg_idx, seg in enumerate(segments_iter):
        seg_words: list[dict] = []
        for w in seg.words or []:
            text = w.word.strip()
            if not text:
                continue
            start = round(float(w.start), 3)
            end = round(max(float(w.end), start + 0.04), 3)
            word_obj = {
                "id": len(words),
                "word": text,
                "start": start,
                "end": end,
                "startFrame": sec_to_frame(start, fps),
                "endFrame": sec_to_frame(end, fps),
                "probability": round(float(w.probability), 3),
            }
            words.append(word_obj)
            seg_words.append(word_obj)

        seg_start = round(float(seg.start), 3)
        seg_end = round(float(seg.end), 3)
        segments.append(
            {
                "id": seg_idx,
                "text": seg.text.strip(),
                "start": seg_start,
                "end": seg_end,
                "startFrame": sec_to_frame(seg_start, fps),
                "endFrame": sec_to_frame(seg_end, fps),
                "words": seg_words,
            }
        )

    pauses: list[dict] = []
    for i in range(len(words) - 1):
        gap = round(words[i + 1]["start"] - words[i]["end"], 3)
        if gap >= 0.35:
            pauses.append(
                {
                    "afterWordId": words[i]["id"],
                    "afterWord": words[i]["word"],
                    "start": words[i]["end"],
                    "end": words[i + 1]["start"],
                    "duration": gap,
                    "startFrame": words[i]["endFrame"],
                    "endFrame": words[i + 1]["startFrame"],
                }
            )

    duration = get_audio_duration(wav_path)
    return {
        "fps": fps,
        "duration": duration,
        "durationFrames": sec_to_frame(duration, fps),
        "language": info.language,
        "text": " ".join(s["text"] for s in segments).strip(),
        "words": words,
        "segments": segments,
        "pauses": pauses,
    }


def build_starter_timeline(slug: str, transcript: dict) -> dict:
    segs = transcript.get("segments") or []
    duration = float(transcript.get("duration") or 5.0)
    scenes = []

    if len(segs) <= 1:
        scenes.append(
            {
                "id": "scene-1",
                "type": "hero-visual",
                "start": 0,
                "end": duration,
                "eyebrow": "TECH EXPLAINER // 60 FPS",
                "title": slug.replace("-", " ").title(),
                "tag": "{ Architecture }",
                "heroIcon": "api",
                "orbitIcons": ["phone", "server", "database"],
                "sfx": "whoosh",
            }
        )
    else:
        first_end = max(2.8, float(segs[0]["end"]))
        scenes.append(
            {
                "id": "scene-1",
                "type": "hero-visual",
                "start": 0,
                "end": round(min(first_end, duration * 0.35), 3),
                "eyebrow": "TECH EXPLAINER // 60 FPS",
                "title": slug.replace("-", " ").title(),
                "tag": "{ Explained }",
                "heroIcon": "api",
                "orbitIcons": ["phone", "server", "database"],
                "sfx": "whoosh",
            }
        )
        mid_start = scenes[-1]["end"]
        last_start = round(max(mid_start + 2.0, duration * 0.76), 3)
        if last_start - mid_start >= 2.5:
            scenes.append(
                {
                    "id": "scene-2",
                    "type": "sequence-diagram",
                    "start": mid_start,
                    "end": last_start,
                    "eyebrow": "SYSTEM SEQUENCE",
                    "title": "Client ↔ Server Flow",
                    "actors": [
                        {"id": "a1", "label": "Client", "icon": "phone", "tone": "accent"},
                        {"id": "a2", "label": "API", "icon": "api", "tone": "accent"},
                        {"id": "a3", "label": "Server", "icon": "server", "tone": "success"},
                    ],
                    "steps": [
                        {"from": "a1", "to": "a2", "label": "Request", "tone": "accent"},
                        {"from": "a2", "to": "a3", "label": "Process", "tone": "accent"},
                        {"from": "a3", "to": "a1", "label": "200 OK", "tone": "success"},
                    ],
                    "sfx": "pop",
                }
            )
            scenes.append(
                {
                    "id": "scene-3",
                    "type": "bridge-architecture",
                    "start": last_start,
                    "end": duration,
                    "eyebrow": "KEY TAKEAWAY",
                    "title": "Connected Architecture",
                    "leftApp": {"name": "Client App", "sub": "Frontend UI", "icon": "phone", "badge": "CLIENT"},
                    "rightApp": {"name": "Backend Service", "sub": "Data & Logic", "icon": "server", "badge": "SERVICE"},
                    "bridgeLabel": "API BRIDGE",
                    "packets": ["REQUEST", "RESPONSE"],
                    "sfx": "whoosh",
                }
            )
        else:
            scenes[-1]["end"] = duration

    return {
        "slug": slug,
        "fps": transcript["fps"],
        "width": 1080,
        "height": 1920,
        "audioFile": f"projects/{slug}/voice.wav",
        "theme": "editorial-cream",
        "scenes": scenes,
    }


def main() -> int:
    parser = argparse.ArgumentParser(description="Clean voice recording and generate word-level transcript.")
    parser.add_argument("slug", help="Project folder name under src/projects/<slug>")
    parser.add_argument("--input", type=Path, default=None, help="Optional path to raw voice file")
    parser.add_argument("--wav-out", type=Path, default=None, help="Optional explicit output path for cleaned voice.wav")
    parser.add_argument("--transcript-out", type=Path, default=None, help="Optional explicit output path for transcript.json")
    parser.add_argument("--no-timeline", action="store_true", help="Skip generating starter timeline.json")
    parser.add_argument("--model", default="small", help="faster-whisper model (tiny, base, small, medium)")
    parser.add_argument("--language", default=None, help="Optional language code (e.g. en)")
    parser.add_argument("--fps", type=int, default=DEFAULT_FPS, help="Target video FPS (default: 60)")
    parser.add_argument("--no-trim", action="store_true", help="Keep original silences untouched")
    parser.add_argument("--silence-db", type=float, default=-38.0, help="Silence threshold in dB")
    parser.add_argument("--keep-pause", type=float, default=0.25, help="Max pause length kept during trim (sec)")
    parser.add_argument("--force-timeline", action="store_true", help="Overwrite existing timeline.json")
    args = parser.parse_args()

    repo_root = Path(__file__).resolve().parent.parent
    project_src_dir = repo_root / "src" / "projects" / args.slug
    project_public_dir = repo_root / "public" / "projects" / args.slug
    if args.wav_out is None or args.transcript_out is None:
        project_src_dir.mkdir(parents=True, exist_ok=True)
        project_public_dir.mkdir(parents=True, exist_ok=True)

    raw_audio = args.input.resolve() if args.input else find_raw_audio(project_src_dir, project_public_dir)
    cleaned_wav = args.wav_out.resolve() if args.wav_out else (project_public_dir / "voice.wav")

    print(f"Cleaning audio: {raw_audio} -> {cleaned_wav}")
    duration = clean_audio(
        raw_audio,
        cleaned_wav,
        trim_silence=not args.no_trim,
        silence_db=args.silence_db,
        keep_pause=args.keep_pause,
    )
    print(f"Normalized audio duration: {duration}s")

    print(f"Transcribing with faster-whisper ({args.model}, CPU int8)...")
    transcript = transcribe_words(cleaned_wav, args.model, args.fps, args.language)
    transcript_path = args.transcript_out.resolve() if args.transcript_out else (project_src_dir / "transcript.json")
    transcript_path.parent.mkdir(parents=True, exist_ok=True)
    transcript_path.write_text(json.dumps(transcript, indent=2), encoding="utf-8")
    print(f"Saved word timestamps: {transcript_path} ({len(transcript['words'])} words)")

    if not args.no_timeline:
        timeline_path = project_src_dir / "timeline.json"
        if args.force_timeline or not timeline_path.exists():
            timeline = build_starter_timeline(args.slug, transcript)
            timeline_path.write_text(json.dumps(timeline, indent=2), encoding="utf-8")
            print(f"Created starter timeline: {timeline_path}")

    return 0


if __name__ == "__main__":
    sys.exit(main())

