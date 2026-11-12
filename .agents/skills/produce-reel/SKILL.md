---
name: produce-reel
description: >-
  Use when creating or editing an explainer Reel from a voice recording,
  topic script, or timeline in this workspace. Handles voice alignment,
  scene timing, visual QA stills, and final 60fps MP4 rendering.
---

# Produce Voice-Synced Reel

End-to-end workflow to build and render a 60 fps (`1080x1920`) software engineering Reel synced to a voice recording.

## Steps

1. **Ingest & Align Voice:**
   - Ensure raw audio is placed at `public/projects/<slug>/raw-voice.<ext>` (or pass `--input <path>`).
   - Run:
     `.\.venv\Scripts\python.exe scripts\process_voice.py <slug> --model small`
   - Inspect `src/projects/<slug>/transcript.json` for exact word timestamps, segments, and pauses (`>= 0.35s`).

2. **Plan & Build Bespoke Visual Scenes (`src/custom-scenes/<slug>/` & `timeline.json`):**
   - Author custom TSX scene components (`type: "custom-scene"` via `src/custom-scenes/registry.ts`) with bespoke animated SVGs, generated illustrations (`image-generator`), and full `lucide-react` / `simple-icons` icons whenever custom motion communicates the topic better than existing built-in diagrams (`hero-visual`, `token-breakdown`, `sequence-diagram`, `client-api-server`, `bridge-architecture`, `metric-compare`, `code-stepper`, `terminal`).
   - Align `start`/`end` timestamps and inner step cues (`resolveCueTime` / `cuePhrase`) directly to `transcript.json` word timings and pauses.
   - Apply the requested reference `style-spec.json` or theme from `src/lib/themes.ts` (`editorial-cream` default light theme or dark dev themes).
   - Respect Reels safe zones (`top >= 150px`, `bottom >= 320px`, `right >= 80px`, `left >= 80px`).

3. **Register & Typecheck:**
   - Register the composition in `src/Root.tsx` at `1080x1920`, `60` fps, using `transcript.durationFrames` as total duration.
   - Run `pnpm typecheck`.

4. **Visual QA Before Full Render:**
   - Render 3–5 representative checkpoint frames (intro, diagram, code focus, climax/caption overlap check):
     `pnpm still <CompositionId> out/qa-frame.png --frame=<N>`
   - Inspect the generated PNGs to confirm zero text clipping, legible code size, and clean caption clearance.

5. **Final Export:**
   - Render the full 60 fps MP4:
     `pnpm render <CompositionId> out/<slug>.mp4`

