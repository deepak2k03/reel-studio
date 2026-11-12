import type React from "react";
import { staticFile } from "remotion";
import type { CustomSceneConfig, StyleSpec, TranscriptData } from "../lib/types";

export interface CustomSceneRenderProps {
  scene: CustomSceneConfig;
  transcript: TranscriptData;
  theme: StyleSpec;
  mediaBaseUrl?: string;
}

export type CustomSceneComponent = React.FC<CustomSceneRenderProps>;

/**
 * Resolve a project-scoped asset path (e.g., "assets/diagram.png") against the active
 * render server base URL (`render_project.ts` or `/media/projects/<id>`), falling back to `staticFile`.
 */
export function resolveProjectMedia(
  mediaBaseUrl: string | undefined,
  assetPath: string,
): string {
  const clean = assetPath.replace(/^\/+/, "");
  if (
    assetPath.startsWith("http://") ||
    assetPath.startsWith("https://") ||
    assetPath.startsWith("data:")
  ) {
    return assetPath;
  }
  if (mediaBaseUrl) {
    return `${mediaBaseUrl.replace(/\/+$/, "")}/${clean}`;
  }
  return staticFile(clean);
}

