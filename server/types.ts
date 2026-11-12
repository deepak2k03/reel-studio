import type { StyleSpec } from "../src/lib/types";

export type ProjectStatus =
  | "queued"
  | "processing"
  | "awaiting_supervision"
  | "ready"
  | "failed";

export type PipelineStage =
  | "queued"
  | "audio"
  | "style"
  | "storyboard"
  | "supervision"
  | "render"
  | "done"
  | "failed";

export interface ProjectRecord {
  id: string;
  title: string;
  mode: "supervised" | "auto";
  status: ProjectStatus;
  stage: PipelineStage;
  progress: number;
  progressDetail: string;
  createdAt: string;
  format: "portrait" | "landscape";
  language: "auto" | "en" | "hi";
  hasReference: boolean;
  durationSec: number | null;
  styleColors: {
    bg: string;
    accent: string;
    captionHighlight: string;
  } | null;
  styleMeta: StyleSpec["meta"] | null;
  outputUrl: string | null;
  thumbUrl: string | null;
  error: string | null;
}
