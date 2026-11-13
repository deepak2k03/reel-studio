"""Generate deterministic studio UI/motion SFX and seamless ambient bed WAVs."""

from __future__ import annotations

import wave
from pathlib import Path

import numpy as np

SAMPLE_RATE = 44100


def write_wav(path: Path, samples: np.ndarray) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    clipped = np.clip(samples, -0.98, 0.98)
    pcm = (clipped * 32767.0).astype(np.int16)
    with wave.open(str(path), "wb") as wf:
        wf.setnchannels(1)
        wf.setsampwidth(2)
        wf.setframerate(SAMPLE_RATE)
        wf.writeframes(pcm.tobytes())


def make_chime() -> np.ndarray:
    dur = 0.50
    t = np.linspace(0, dur, int(SAMPLE_RATE * dur), endpoint=False)
    # Warm C5 -> E5 -> G5 soft harmonic chime
    n1 = np.sin(2 * np.pi * 523.25 * t) * np.exp(-t * 8.0)
    n2 = np.sin(2 * np.pi * 659.25 * np.maximum(0, t - 0.045)) * np.exp(-np.maximum(0, t - 0.045) * 7.5) * (t >= 0.045)
    n3 = np.sin(2 * np.pi * 783.99 * np.maximum(0, t - 0.09)) * np.exp(-np.maximum(0, t - 0.09) * 6.5) * (t >= 0.09)
    sig = 0.24 * (n1 + 0.9 * n2 + 0.8 * n3)
    fade_in = np.minimum(1.0, t / 0.008)
    return sig * fade_in


def make_tick() -> np.ndarray:
    dur = 0.055
    t = np.linspace(0, dur, int(SAMPLE_RATE * dur), endpoint=False)
    sig = (0.35 * np.sin(2 * np.pi * 1650 * t) + 0.2 * np.sin(2 * np.pi * 3100 * t)) * np.exp(-t * 95.0)
    return sig * np.minimum(1.0, t / 0.002)


def make_alert() -> np.ndarray:
    dur = 0.26
    t = np.linspace(0, dur, int(SAMPLE_RATE * dur), endpoint=False)
    p1 = np.sin(2 * np.pi * 185 * t) * np.exp(-t * 22.0)
    t2 = np.maximum(0, t - 0.11)
    p2 = np.sin(2 * np.pi * 145 * t2) * np.exp(-t2 * 22.0) * (t >= 0.11)
    return 0.36 * (p1 + p2) * np.minimum(1.0, t / 0.004)


def make_ambient_warm() -> np.ndarray:
    # Exactly 8.0s (480 frames at 60fps) using integer cycle counts for zero-click looping
    dur = 8.0
    n = int(SAMPLE_RATE * dur)
    t = np.linspace(0, dur, n, endpoint=False)

    # Integer frequencies over 8s ensure exact phase continuity at wrap-around
    freqs = [110.0, 165.0, 220.0, 275.0]
    amps = [0.42, 0.26, 0.18, 0.10]
    pad = np.zeros_like(t)
    for idx, (f, a) in enumerate(zip(freqs, amps)):
        # Slow organic amplitude LFO (also integer cycles in 8s: 1 or 2 cycles)
        lfo = 0.78 + 0.22 * np.sin(2 * np.pi * (idx % 2 + 1) * (t / dur))
        pad += a * lfo * np.sin(2 * np.pi * f * t)

    return pad * 0.22


def main() -> None:
    sfx_dir = Path(__file__).resolve().parent.parent / "public" / "sfx"
    write_wav(sfx_dir / "chime.wav", make_chime())
    write_wav(sfx_dir / "tick.wav", make_tick())
    write_wav(sfx_dir / "alert.wav", make_alert())
    write_wav(sfx_dir / "ambient-warm.wav", make_ambient_warm())
    print(f"Generated studio SFX & ambient bed in {sfx_dir}")


if __name__ == "__main__":
    main()

