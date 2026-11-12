import type { CustomSceneComponent } from "./types";

/**
 * Per-project bespoke scene registry.
 * Add project-specific TSX scene components under `src/custom-scenes/<slug>/`
 * and register them here under unique `"<slug>/<scene-name>"` keys.
 */
export const CUSTOM_SCENES: Record<string, CustomSceneComponent> = {};

