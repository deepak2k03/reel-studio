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

## Full Screen Area & Canvas Utilization Policy
- **Maximize the Entire 9:16 Canvas:** Always utilize the complete screen area available within the safe zones (`top: 150px`, `bottom: 320px`, `horizontal: 80px`, giving a spacious ~920x1450px active visual stage).
- **No Postage-Stamp Layouts:** Never cram diagrams, architectures, or explainer scenes into small, narrow boxes centered with massive dead black borders. Diagrams, flows, sequence lifelines, and hardware racks must expand generously across the viewport with clear hierarchy, large readable typography, and expansive conduits.
- **Reference Video Scope:** The reference video is strictly an aesthetic guideline for **styling, color palette, theme mood, and typography**. It must never constrain visual scale, canvas coverage, or animation richness.

## Real Computer Science Objects Policy (Strict Rule for All Reels)
- **Never use generic boxes with a text label to represent computer science concepts.** For example, drawing a plain rectangle and writing "Server" or "Database" inside is strictly forbidden across all scenes, architecture diagrams, sequence diagrams, and explainer visuals.
- **Always use real, animated Computer Science elements** from `src/components/cs-objects/` (`<CsObject type="..." />`):
  - **Server / Backend / Node:** Render `AnimatedServerRack` with hot-swap drive bays, blinking SAS activity LEDs, spinning cooling fans, RJ45 ports, and CPU load metering.
  - **Database / Storage:** Render `AnimatedDatabase` with magnetic platters on a spinning spindle, swinging actuator arm, glowing read sectors, and WAL commit logs.
  - **CPU / Silicon:** Render `AnimatedCpu` with gold pins, multi-core ALU units, L1-L3 cache blocks, and deterministic clock cycle frequency ripples.
  - **Memory / RAM:** Render `AnimatedRamModule` with DDR5 DIMM PCB, DRAM ICs, gold contact notch, and active RAS/CAS memory strobes.
  - **Router / Switch / Gateway:** Render `AnimatedNetworkRouter` with RJ45 patch ports, link/activity LEDs, SFP+ fiber cages, and FIFO packet queues.
  - **Container / Docker / Pod:** Render `AnimatedShippingContainer` with corrugated steel, corner castings, lock rods, and Linux kernel namespace isolation forcefields.
  - **Mobile / Client / Browser:** Render `AnimatedMobileClient` with titanium bezel, dynamic island, live touch ripples, and response JSON stream.
  - **Message Queue / Kafka:** Render `AnimatedMessageQueue` with sequential partition commit log slots and consumer read offset pointers.
- **Include Detailed Animation Explanations:** Every animated element must visually demonstrate its underlying mechanism (e.g. data traveling along glowing conduits, sector reads under laser heads, packet queue ingestion, and clock strobe oscillations) with optional metric and annotation callouts so viewers immediately understand the actual engineering mechanics.

## Remotion Determinism Rules
- Drive **all** animations from `useCurrentFrame()`, `useVideoConfig()`, `interpolate()`, and `spring()`.
- **Never** use CSS `transition`, CSS `@keyframes`, or `Math.random()` inside Remotion components (use Remotion's deterministic `random(seed)`).
- Always render key checkpoint frames with `pnpm still <CompId> out/check.png --frame=<N>` (or `scripts/render_project.ts <id> --still <frame> ...`) and visually inspect them before running a full MP4 render.

