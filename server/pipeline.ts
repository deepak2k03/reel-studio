import { spawn, type ChildProcess } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { bundle } from "@remotion/bundler";
import {
  makeCancelSignal,
  renderMedia,
  selectComposition,
} from "@remotion/renderer";
import { THEMES, getTheme } from "../src/lib/themes";
import type { StyleSpec, TranscriptData } from "../src/lib/types";
import { buildStoryboard } from "./storyboard";
import type { PipelineStage, ProjectRecord } from "./types";

const REPO_ROOT = path.resolve(__dirname, "..");
const PYTHON_EXE = path.join(REPO_ROOT, ".venv", "Scripts", "python.exe");
const PROCESS_VOICE_PY = path.join(REPO_ROOT, "scripts", "process_voice.py");
const EXTRACT_STYLE_PY = path.join(REPO_ROOT, "scripts", "extract_style.py");
const ENTRY_POINT = path.join(REPO_ROOT, "src", "index.ts");

let cachedBundlePromise: Promise<string> | null = null;
let cachedBundleMtime = 0;

function getSrcMaxMtime(dir: string): number {
  let max = 0;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      const sub = getSrcMaxMtime(full);
      if (sub > max) max = sub;
    } else {
      const m = fs.statSync(full).mtimeMs;
      if (m > max) max = m;
    }
  }
  return max;
}

function getBundleServeUrl(): Promise<string> {
  const latestMtime = getSrcMaxMtime(path.join(REPO_ROOT, "src"));
  if (!cachedBundlePromise || latestMtime > cachedBundleMtime) {
    cachedBundleMtime = latestMtime;
    cachedBundlePromise = bundle({
      entryPoint: ENTRY_POINT,
    }).catch((err) => {
      cachedBundlePromise = null;
      throw err;
    });
  }
  return cachedBundlePromise;
}

export interface JobContext {
  projectDir: string;
  rawVoicePath: string;
  referenceVideoPath: string | null;
  fallbackThemeId: string;
  port: number;
}

export interface RunningHandle {
  cancelled: boolean;
  childProcess: ChildProcess | null;
  cancelRender: (() => void) | null;
  cancel: () => void;
}

function runPythonScript(
  scriptPath: string,
  args: string[],
  handle: RunningHandle,
): Promise<string> {
  return new Promise((resolve, reject) => {
    if (handle.cancelled) {
      reject(new Error("Job cancelled"));
      return;
    }

    const child = spawn(PYTHON_EXE, [scriptPath, ...args], {
      cwd: REPO_ROOT,
      env: { ...process.env, HF_HUB_OFFLINE: "1", PYTHONUNBUFFERED: "1" },
      stdio: ["ignore", "pipe", "pipe"],
    });
    handle.childProcess = child;

    let stdout = "";
    let stderr = "";
    child.stdout.on("data", (chunk: Buffer) => {
      stdout += chunk.toString();
    });
    child.stderr.on("data", (chunk: Buffer) => {
      stderr += chunk.toString();
    });

    child.on("error", (err) => {
      handle.childProcess = null;
      reject(err);
    });

    child.on("close", (code) => {
      handle.childProcess = null;
      if (handle.cancelled) {
        reject(new Error("Job cancelled"));
        return;
      }
      if (code !== 0) {
        reject(new Error(stderr.trim() || stdout.trim() || `Python exited with ${code}`));
        return;
      }
      resolve(stdout.trim());
    });
  });
}

function extractFrameThumbnail(mp4Path: string, thumbPath: string): Promise<void> {
  return new Promise((resolve) => {
    const child = spawn(
      "ffmpeg",
      ["-y", "-ss", "1.5", "-i", mp4Path, "-frames:v", "1", "-q:v", "3", thumbPath],
      { cwd: REPO_ROOT, stdio: "ignore" },
    );
    child.on("close", () => resolve());
    child.on("error", () => resolve());
  });
}

function adaptStyleForFormat(spec: StyleSpec, format: "portrait" | "landscape"): StyleSpec {
  if (format === "portrait") {
    return spec;
  }
  return {
    ...spec,
    typography: {
      ...spec.typography,
      titleSize: 54,
      bodySize: 30,
      codeSize: 23,
      captionSize: 44,
    },
    safeZone: {
      top: 64,
      bottom: 195,
      left: 110,
      right: 110,
    },
  };
}

export async function runGenerationPipeline(
  project: ProjectRecord,
  ctx: JobContext,
  onUpdate: (patch: Partial<ProjectRecord>) => void,
  handle: RunningHandle,
): Promise<void> {
  const setStage = (stage: PipelineStage, progress: number, progressDetail: string) => {
    onUpdate({ status: "processing", stage, progress, progressDetail });
  };

  const voiceWavPath = path.join(ctx.projectDir, "voice.wav");
  const transcriptPath = path.join(ctx.projectDir, "transcript.json");
  const styleSpecPath = path.join(ctx.projectDir, "style-spec.json");
  const timelinePath = path.join(ctx.projectDir, "timeline.json");
  const outputMp4Path = path.join(ctx.projectDir, "output.mp4");
  const thumbPngPath = path.join(ctx.projectDir, "thumb.png");

  // 1. Voice cleanup + Faster-Whisper CPU word alignment
  setStage("audio", 10, "Cleaning audio and aligning words on CPU…");
  const voiceArgs = [
    project.id,
    "--input",
    ctx.rawVoicePath,
    "--wav-out",
    voiceWavPath,
    "--transcript-out",
    transcriptPath,
    "--no-timeline",
    "--model",
    "small",
    "--fps",
    "60",
  ];
  if (project.language !== "auto") {
    voiceArgs.push("--language", project.language);
  }
  await runPythonScript(PROCESS_VOICE_PY, voiceArgs, handle);

  const transcript = JSON.parse(
    fs.readFileSync(transcriptPath, "utf-8"),
  ) as TranscriptData;
  onUpdate({
    durationSec: transcript.duration,
    progress: 30,
    progressDetail: `Aligned ${transcript.words.length} words (${transcript.duration.toFixed(1)}s)`,
  });

  // 2. Reference video style extraction (or fallback preset)
  const refFramesDir = path.join(ctx.projectDir, "ref-frames");
  let baseSpec: StyleSpec;
  if (ctx.referenceVideoPath && fs.existsSync(ctx.referenceVideoPath)) {
    setStage("style", 34, "Extracting palette, pacing & keyframes from reference…");
    await runPythonScript(
      EXTRACT_STYLE_PY,
      [
        ctx.referenceVideoPath,
        "--out",
        styleSpecPath,
        "--thumb",
        thumbPngPath,
        "--frames-dir",
        refFramesDir,
      ],
      handle,
    );
    baseSpec = JSON.parse(fs.readFileSync(styleSpecPath, "utf-8")) as StyleSpec;
  } else {
    setStage("style", 36, "Applying studio theme preset…");
    baseSpec = THEMES[ctx.fallbackThemeId] ?? getTheme("midnight-dev");
    fs.writeFileSync(styleSpecPath, JSON.stringify(baseSpec, null, 2), "utf-8");
  }

  const styleSpec = adaptStyleForFormat(baseSpec, project.format);
  fs.writeFileSync(styleSpecPath, JSON.stringify(styleSpec, null, 2), "utf-8");

  onUpdate({
    styleColors: {
      bg: styleSpec.colors.bg,
      accent: styleSpec.colors.accent,
      captionHighlight: styleSpec.colors.captionHighlight,
    },
    styleMeta: styleSpec.meta ?? null,
    thumbUrl: fs.existsSync(thumbPngPath)
      ? `/media/projects/${project.id}/thumb.png`
      : null,
  });

  if (handle.cancelled) throw new Error("Job cancelled");

  // 3. Storyboard draft generation
  setStage("storyboard", 44, "Drafting voice-synced storyboard…");
  const audioUrl = `http://127.0.0.1:${ctx.port}/media/projects/${project.id}/voice.wav`;
  const timeline = buildStoryboard({
    slug: project.id,
    title: project.title,
    transcript,
    styleSpec,
    audioUrl,
    format: project.format,
  });
  fs.writeFileSync(timelinePath, JSON.stringify(timeline, null, 2), "utf-8");

  if (handle.cancelled) throw new Error("Job cancelled");

  // Supervised mode pauses after preparing audio, reference frames, and draft timeline
  // so Antigravity can inspect, refine, QA stills, and render the final video.
  if (project.mode === "supervised") {
    onUpdate({
      status: "awaiting_supervision",
      stage: "supervision",
      progress: 48,
      progressDetail: "Ready for Antigravity review — copy prompt into chat",
    });
    return;
  }

  // 4. Remotion bundle & 60 fps H.264 render
  setStage("render", 50, "Preparing Remotion bundle…");
  const serveUrl = await getBundleServeUrl();

  const inputProps = {
    timeline,
    transcript,
    styleSpec,
    showSafeZones: false,
    mediaBaseUrl: `http://127.0.0.1:${ctx.port}/media/projects/${project.id}`,
  };

  const composition = await selectComposition({
    serveUrl,
    id: "DynamicReel",
    inputProps,
  });

  const { cancelSignal, cancel } = makeCancelSignal();
  handle.cancelRender = cancel;

  await renderMedia({
    composition,
    serveUrl,
    codec: "h264",
    outputLocation: outputMp4Path,
    inputProps,
    concurrency: 4,
    overwrite: true,
    cancelSignal,
    onProgress: ({ progress, renderedFrames, stitchStage }) => {
      if (handle.cancelled) return;
      const pct = Math.min(99, Math.round(50 + progress * 49));
      const detail =
        stitchStage === "muxing"
          ? "Muxing audio & MP4…"
          : `Rendering frame ${renderedFrames} / ${composition.durationInFrames} (${Math.round(progress * 100)}%)`;
      onUpdate({
        status: "processing",
        stage: "render",
        progress: pct,
        progressDetail: detail,
      });
    },
  });

  handle.cancelRender = null;

  if (!fs.existsSync(thumbPngPath)) {
    await extractFrameThumbnail(outputMp4Path, thumbPngPath);
  }

  onUpdate({
    status: "ready",
    stage: "done",
    progress: 100,
    progressDetail: "Ready",
    outputUrl: `/media/projects/${project.id}/output.mp4`,
    thumbUrl: fs.existsSync(thumbPngPath)
      ? `/media/projects/${project.id}/thumb.png`
      : null,
  });
}
