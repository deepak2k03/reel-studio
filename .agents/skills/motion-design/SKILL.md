---
name: motion-design
description: >-
  Use when designing or upgrading animated visual scenes so Reels stay
  dead-center, icon-first, and free of text walls.
---

# Visual-First Motion Design Standards

Enforce cinematic software engineering motion graphics instead of text slides.

## Principles

1. **Optical Centering:**
   - Use symmetric horizontal safe padding (`left: 80px`, `right: 80px` on `1080x1920`).
   - Center the hero visual or flow diagram both horizontally and vertically inside the safe stage (`top: 150px`, `bottom: 320px`).

2. **Bespoke Visuals, Custom Illustrations & Full Icons Over Recycled Assets:**
   - Never dump raw spoken sentences onto cards (`KineticCaptions` already delivers captions), and never restrict a new Reel to already-present diagrams, canned metaphors, or icons.
   - For any concept that benefits from better motion, create **bespoke per-project TSX scenes** (`src/custom-scenes/<id>/`, registered in `src/custom-scenes/registry.ts`) with custom animated SVG illustrations, fresh icons directly from `simple-icons` / `lucide-react`, or bespoke editorial artwork via `image-generator` saved in `data/projects/<id>/assets/`.
   - Built-in precision scenes (`hero-visual`, `token-breakdown`, `restaurant-metaphor`, `sequence-diagram`, `client-api-server`, `bridge-architecture`, `metric-compare`, `code-stepper`, `terminal`) remain available when directly applicable, never as creative limits.
   - Maintain crisp contrast polarity (`meta.isDark` matching light editorial or dark themes) and zero overlapping badges.

3. **Continuous 60 fps Motion:**
   - Layer ambient [`ReelBackground`](../../../src/components/ReelBackground.tsx) spotlight + `@remotion/noise` micro-particles with foreground spring entrances, pulsing halos, and moving dashed strokes.

