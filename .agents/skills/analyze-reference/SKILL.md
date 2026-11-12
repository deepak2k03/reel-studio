---
name: analyze-reference
description: >-
  Use when the user provides a reference video or asks to match the style,
  pacing, colors, typography, or caption behavior of an example Reel.
---

# Analyze Reference Video

Extract structure, pacing, and visual tokens from a reference clip and turn them into a reusable `StyleSpec` JSON preset.

## Steps

1. Run the reference analyzer script on the clip in `references/`:
   `.\.venv\Scripts\python.exe scripts\analyze_reference.py references/<video>.mp4`
2. Inspect the generated `references/<video>/analysis.json` for resolution, FPS, total duration, cut timestamps, and average shot duration.
3. Read the extracted keyframes in `references/<video>/frames/` (and/or inspect the video directly) to identify:
   - Background style (solid, subtle grid, radial glow) and hex palette (`bg`, `surface`, `text`, `accent`, `muted`)
   - Typography (display sans vs monospace code font, weights, sizes)
   - Motion feel (snappy spring vs smooth ease, typical zoom/pan amplitude)
   - Caption placement, highlight behavior, and word chunk size
   - Diagram & code card styling (border radius, border contrast, shadow/glow)
4. Save a structured spec at `references/<video>/style-spec.json` and optionally register a matching theme preset in `src/lib/themes.ts`.
5. Validate TypeScript compiles cleanly with `pnpm typecheck`.

