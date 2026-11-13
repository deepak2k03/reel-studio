---
name: supervise-project
description: >-
  Use when supervising, reviewing, or finishing a web app project under
  data/projects/<id>/ (especially projects in awaiting_supervision status).
---

# Supervise Web App Project

Hands-on quality supervision of a voice + reference video project before final MP4 export.

## Steps

1. **Locate & Inspect Project Files (`data/projects/<id>/`):**
   - Read `project.json`, `transcript.json`, `style-spec.json`, and `timeline.json`.
   - If `voice.wav` is present, read/listen to `voice.wav` via `read_file` to catch technical terms, brand names, or Hinglish/Romanized spelling fixes in `transcript.json`.
   - If `ref-frames/*.png` exist, inspect them with `read_file` to verify the true reference palette, typography density, and layout mood. Update `style-spec.json` if needed.

2. **Create Bespoke Visuals & Refine Storyboard (`src/custom-scenes/<id>/` + `timeline.json`):**
   - **Never force-fit a new Reel onto recycled diagrams, old metaphors, or a fixed asset subset.** Evaluate what custom visual, animation, illustration, or icon makes each spoken beat unmistakably clear:
     - Write **bespoke animated TSX scenes** under `src/custom-scenes/<id>/` using custom multi-part inline SVGs (`useCurrentFrame()`, `spring()`, `interpolate()`, morphing geometry, spatial data flow), any icon from `lucide-react` / `simple-icons`, and generated illustrations (`image-generator`) saved in `data/projects/<id>/assets/` (loaded via `<EditorialIllustration src="assets/..." mediaBaseUrl={mediaBaseUrl} theme={theme} />` from `src/custom-scenes/EditorialIllustration.tsx`).
     - Register bespoke scenes in `src/custom-scenes/registry.ts` under `"<id>/<scene-name>"` and reference them via `"type": "custom-scene", "componentId": "<id>/<scene-name>"` in `timeline.json`.
     - Enhance pacing & polish with scene `transition` (`"slide-up"` / `"fade"` / `"zoom"`), subtle `camera` (`"push-in"` / `"pull-out"`), mid-scene `sfxCues` (`"chime"`, `"tick"`, `"alert"`, `"pop"`, `"click"`, `"whoosh"`), and optional `ambientAudio` bed.
     - Follow [motion-design](../motion-design/SKILL.md): keep visuals dead-center, free of long text walls, and reuse built-in scenes (`hero-visual`, `token-breakdown`, `sequence-diagram`, `client-api-server`, `bridge-architecture`, `metric-compare`) only when they are genuinely optimal for that beat.
   - Anchor scene boundaries and inner animation cues (`cuePhrase`, `requestCue`, etc., or `resolveCueTime(..., sceneStartSec)` inside custom TSX) directly to unique phrases in `transcript.json`.

3. **Visual QA Stills & Contact Sheet:**
   - Render a full-timeline QA contact sheet across all scenes in one shot (`--qa-sheet`) plus any targeted checkpoint frame (`--still`):
     `node .\node_modules\tsx\dist\cli.mjs scripts\render_project.ts <id> --qa-sheet out/qa-<id>-sheet.png`
     `node .\node_modules\tsx\dist\cli.mjs scripts\render_project.ts <id> --still <frame> out/qa-<id>-1.png`
   - Inspect every rendered PNG with `read_file` to verify zero overlapping labels/badges, clean centering, crisp caption legibility (`editorial` bare captions on light themes vs pill on dark themes), and matching reference colors. Fix and re-check any still that clips or overlaps, then delete temporary `out/qa-*.png` files.

4. **Render Final 60 fps Video Back to Web App:**
   - Run:
     `node .\node_modules\tsx\dist\cli.mjs scripts\render_project.ts <id> --render`
   - This updates `data/projects/<id>/project.json` to `ready`, which automatically updates the live Web UI at `http://127.0.0.1:3100`.

