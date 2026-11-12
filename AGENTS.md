# Reels Studio — Workspace Rules

This repository is a 60 fps (`1080x1920`, 9:16) Remotion video studio for software engineering explainer Reels driven by local voice recordings and reference video specs.

## Studio Defaults
- **Canvas:** `1080x1920` (9:16 vertical) at `60` fps.
- **Safe Zones (Reels / Shorts UI clearance, symmetrically centered):**
  - Top margin: `150px`
  - Bottom margin: `320px` (captions sit at bottom clearance; primary visuals sit optically centered)
  - Right margin: `80px`
  - Left margin: `80px`
- **Audio & Alignment:**
  - Process voice recordings via `.venv/Scripts/python.exe scripts/process_voice.py <slug>` before editing scenes.
  - Anchor scene cuts, diagram reveals, and code highlights to `transcript.json` timestamps (`secToFrame` / `findCueTime`) rather than arbitrary frame numbers.
  - Keep project audio files in `public/projects/<slug>/voice.wav` and load via `staticFile()`.

## Bespoke Visuals Policy (All Future Reels)
- **Never restrict a new Reel to already-present diagrams, metaphors, or icons.** For any supervised Reel (`data/projects/<id>/`), design bespoke topic-specific animations, custom multi-layer SVGs, or newly generated editorial illustrations whenever better visuals can be crafted.
- Author project-specific Remotion scenes under `src/custom-scenes/<project-id>/`, register them in `src/custom-scenes/registry.ts`, and invoke them via `"type": "custom-scene"` in `timeline.json`.
- Save generated custom illustrations (`image-generator`) under `data/projects/<id>/assets/` and load them with `resolveProjectMedia(mediaBaseUrl, "assets/...")`. Import any needed icon from `lucide-react` or `simple-icons` (or draw custom inline SVGs) on demand.

## Remotion Determinism Rules
- Drive **all** animations from `useCurrentFrame()`, `useVideoConfig()`, `interpolate()`, and `spring()`.
- **Never** use CSS `transition`, CSS `@keyframes`, or `Math.random()` inside Remotion components (use Remotion's deterministic `random(seed)`).
- Always render key checkpoint frames with `pnpm still <CompId> out/check.png --frame=<N>` (or `scripts/render_project.ts <id> --still <frame> ...`) and visually inspect them before running a full MP4 render.

