---
name: motion-design
description: >-
  Use when designing or upgrading animated visual scenes so Reels stay
  dead-center, icon-first, and free of text walls.
---

# Visual-First Motion Design Standards

Enforce cinematic software engineering motion graphics instead of text slides.

## Principles

1. **Full Screen Canvas Utilization & Optical Centering:**
   - Use symmetric horizontal safe padding (`left: 80px`, `right: 80px` on `1080x1920`).
   - Maximize the full usable visual stage (`top: 150px`, `bottom: 320px`, spanning ~920×1450px).
   - Never squish diagrams into tiny centered postage-stamp boxes with massive dead space. Hardware racks, sequence lifelines, architecture nodes, and data conduits should expand boldly across the stage.
   - **Reference Video Role:** The reference video is strictly an aesthetic inspiration for **styling, colors, typography, and mood**. Never mimic layout constraints or sparse visuals from a reference video.

2. **Bespoke Visuals, Custom Illustrations & Full Icons Over Recycled Assets:**
   - Never dump raw spoken sentences onto cards (`KineticCaptions` already delivers captions), and never restrict a new Reel to already-present diagrams, canned metaphors, or icons.
   - For any concept that benefits from better motion, create **bespoke per-project TSX scenes** (`src/custom-scenes/<id>/`, registered in `src/custom-scenes/registry.ts`) with custom animated SVG illustrations, fresh icons directly from `simple-icons` / `lucide-react`, or bespoke editorial artwork via `image-generator` saved in `data/projects/<id>/assets/`.
   - Built-in precision scenes (`hero-visual`, `token-breakdown`, `restaurant-metaphor`, `sequence-diagram`, `client-api-server`, `bridge-architecture`, `metric-compare`, `code-stepper`, `terminal`) remain available when directly applicable, never as creative limits.
   - Maintain crisp contrast polarity (`meta.isDark` matching light editorial or dark themes) and zero overlapping badges.

3. **Continuous 60 fps Motion, Camera & Audio Polish:**
   - Layer ambient [`ReelBackground`](../../../src/components/ReelBackground.tsx) spotlight + `@remotion/noise` micro-particles with foreground spring entrances, progressive SVG `strokeDashoffset` reveals, and smooth scene overlap transitions (`transition: "slide-up" | "fade" | "zoom"` + `camera: "push-in" | "pull-out"` in `timeline.json`).
   - Use `<EditorialIllustration paperBlend />` for generated artwork on cream/dark backdrops and add mid-scene `sfxCues` (`chime`, `tick`, `alert`, `pop`, `click`) anchored via `cuePhrase`.

4. **Real Computer Science Objects & Detailed Animation Explanations:**
   - Never represent a computer science concept with a generic rectangle containing text (e.g., a box with "Server" or "Database" written inside is strictly forbidden).
   - Use `<CsObject type="..." />` or the specialized components under `src/components/cs-objects/`:
     - `<AnimatedServerRack />`: Enterprise rackmount chassis with hot-swap SAS drive caddies, blinking green/cyan activity LEDs, dual spinning cooling fans, RJ45 ports, and live load metering.
     - `<AnimatedDatabase />`: Cylindrical magnetic storage platters with central spindle motor, swinging voice-coil actuator arm, read sector highlight, and Write-Ahead Log (WAL) commit buffer.
     - `<AnimatedCpu />`: Microprocessor semiconductor packaging with gold corner notch, LGA pin grid, multi-core ALU units, L1-L3 cache blocks, and clock frequency ripples.
     - `<AnimatedRamModule />`: DDR5 DIMM stick with gold edge fingers, DRAM silicon ICs, and active Row/Column Address Strobes.
     - `<AnimatedNetworkRouter />`: Rackmount router/switch with RJ45 patch ports, SFP+ cages, and live FIFO packet buffer queue.
     - `<AnimatedShippingContainer />`: Corrugated steel ISO freight container with corner castings, lock bars, and kernel namespace isolation forcefields.
     - `<AnimatedMobileClient />`: Glass-and-titanium smartphone chassis with dynamic island, live touch ripples, and response JSON stream.
     - `<AnimatedMessageQueue />`: Distributed message broker with append-only partition log slots and sliding consumer offsets.
   - Always expose mechanical insight (packets traversing wires, disk platters spinning under read heads, memory strobing, clock pulses) and pair with metric badges so viewers understand the true computer science mechanics.


