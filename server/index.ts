import { spawnSync } from "node:child_process";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import express, { type Response } from "express";
import multer from "multer";
import { THEMES } from "../src/lib/themes";
import { runGenerationPipeline, type JobContext, type RunningHandle } from "./pipeline";
import type { ProjectRecord } from "./types";

const PORT = Number(process.env.PORT ?? 3100);
const REPO_ROOT = path.resolve(__dirname, "..");
const DATA_DIR = path.join(REPO_ROOT, "data");
const PROJECTS_DIR = path.join(DATA_DIR, "projects");
const WEB_DIR = path.join(REPO_ROOT, "web");
const UPLOADS_TMP_DIR = path.join(DATA_DIR, "tmp");

fs.mkdirSync(PROJECTS_DIR, { recursive: true });
fs.mkdirSync(UPLOADS_TMP_DIR, { recursive: true });

const sseClients = new Set<Response>();
const activeHandles = new Map<string, RunningHandle>();
const pendingQueue: Array<{ id: string; ctx: JobContext }> = [];
let workerBusy = false;

function readAllProjects(): ProjectRecord[] {
  if (!fs.existsSync(PROJECTS_DIR)) return [];
  const entries = fs.readdirSync(PROJECTS_DIR, { withFileTypes: true });
  const list: ProjectRecord[] = [];
  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    const metaPath = path.join(PROJECTS_DIR, entry.name, "project.json");
    if (!fs.existsSync(metaPath)) continue;
    try {
      const parsed = JSON.parse(fs.readFileSync(metaPath, "utf-8")) as ProjectRecord;
      list.push(parsed);
    } catch {
      // Skip malformed records
    }
  }
  return list.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}

function readProject(id: string): ProjectRecord | null {
  const metaPath = path.join(PROJECTS_DIR, id, "project.json");
  if (!fs.existsSync(metaPath)) return null;
  try {
    return JSON.parse(fs.readFileSync(metaPath, "utf-8")) as ProjectRecord;
  } catch {
    return null;
  }
}

function writeProject(record: ProjectRecord): void {
  const dir = path.join(PROJECTS_DIR, record.id);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(
    path.join(dir, "project.json"),
    JSON.stringify(record, null, 2),
    "utf-8",
  );
}

function broadcastProjects(): void {
  const payload = `data: ${JSON.stringify({ type: "projects", projects: readAllProjects() })}\n\n`;
  for (const client of sseClients) {
    client.write(payload);
  }
}

function updateProject(id: string, patch: Partial<ProjectRecord>): void {
  const existing = readProject(id);
  if (!existing) return;
  writeProject({ ...existing, ...patch });
  broadcastProjects();
}

function seedExistingDemosOnce(): void {
  const seedFlag = path.join(DATA_DIR, ".seeded");
  if (fs.existsSync(seedFlag)) return;

  const demos = [
    {
      id: "demo-api-explainer",
      title: "What is an API? (Hindi/Hinglish)",
      mp4: path.join(REPO_ROOT, "out", "api-explainer.mp4"),
      durationSec: 55.68,
      theme: THEMES["api-bridge"],
    },
    {
      id: "demo-cache-stampede",
      title: "Redis Cache Stampede & Singleflight",
      mp4: path.join(REPO_ROOT, "out", "demo-cache-stampede.mp4"),
      durationSec: 14.0,
      theme: THEMES["midnight-dev"],
    },
  ];

  for (const demo of demos) {
    if (!fs.existsSync(demo.mp4)) continue;
    const dir = path.join(PROJECTS_DIR, demo.id);
    fs.mkdirSync(dir, { recursive: true });
    const destMp4 = path.join(dir, "output.mp4");
    const destThumb = path.join(dir, "thumb.png");
    fs.copyFileSync(demo.mp4, destMp4);
    spawnSync(
      "ffmpeg",
      ["-y", "-ss", "1.5", "-i", destMp4, "-frames:v", "1", "-q:v", "3", destThumb],
      { stdio: "ignore" },
    );

    const record: ProjectRecord = {
      id: demo.id,
      title: demo.title,
      mode: "auto",
      status: "ready",
      stage: "done",
      progress: 100,
      progressDetail: "Ready",
      createdAt: new Date().toISOString(),
      format: "portrait",
      language: "auto",
      hasReference: false,
      durationSec: demo.durationSec,
      styleColors: {
        bg: demo.theme.colors.bg,
        accent: demo.theme.colors.accent,
        captionHighlight: demo.theme.colors.captionHighlight,
      },
      styleMeta: null,
      outputUrl: `/media/projects/${demo.id}/output.mp4`,
      thumbUrl: fs.existsSync(destThumb)
        ? `/media/projects/${demo.id}/thumb.png`
        : null,
      error: null,
    };
    writeProject(record);
  }

  fs.writeFileSync(seedFlag, new Date().toISOString(), "utf-8");
}

function recoverInterruptedJobs(): void {
  for (const proj of readAllProjects()) {
    if (proj.status === "queued" || proj.status === "processing") {
      updateProject(proj.id, {
        status: "failed",
        stage: "failed",
        progressDetail: "Interrupted by server restart",
        error: "Server restarted while rendering",
      });
    }
  }
}

async function processQueue(): Promise<void> {
  if (workerBusy) return;
  const next = pendingQueue.shift();
  if (!next) return;

  const project = readProject(next.id);
  if (!project) {
    void processQueue();
    return;
  }

  workerBusy = true;
  const handle: RunningHandle = {
    cancelled: false,
    childProcess: null,
    cancelRender: null,
    cancel: () => {
      handle.cancelled = true;
      if (handle.childProcess && !handle.childProcess.killed) {
        handle.childProcess.kill();
      }
      if (handle.cancelRender) {
        handle.cancelRender();
      }
    },
  };
  activeHandles.set(next.id, handle);

  try {
    await runGenerationPipeline(
      project,
      next.ctx,
      (patch) => updateProject(next.id, patch),
      handle,
    );
  } catch (err) {
    if (!handle.cancelled && readProject(next.id)) {
      const message = err instanceof Error ? err.message : String(err);
      updateProject(next.id, {
        status: "failed",
        stage: "failed",
        progressDetail: "Generation failed",
        error: message,
      });
    }
  } finally {
    activeHandles.delete(next.id);
    workerBusy = false;
    void processQueue();
  }
}

function slugifyTitle(raw: string): string {
  const base = raw
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 32);
  const suffix = crypto.randomBytes(3).toString("hex");
  return base ? `${base}-${suffix}` : `reel-${suffix}`;
}

seedExistingDemosOnce();
recoverInterruptedJobs();

const app = express();
app.use(express.json());
app.use("/media/projects", express.static(PROJECTS_DIR));
app.use(express.static(WEB_DIR));

const upload = multer({
  dest: UPLOADS_TMP_DIR,
  limits: { fileSize: 250 * 1024 * 1024 },
});

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

app.get("/api/themes", (_req, res) => {
  res.json({
    themes: Object.values(THEMES).map((t) => ({
      id: t.id,
      name: t.name,
      colors: {
        bg: t.colors.bg,
        accent: t.colors.accent,
        captionHighlight: t.colors.captionHighlight,
      },
    })),
  });
});

app.get("/api/projects", (_req, res) => {
  res.json({ projects: readAllProjects() });
});

app.get("/api/events", (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders();

  sseClients.add(res);
  res.write(
    `data: ${JSON.stringify({ type: "projects", projects: readAllProjects() })}\n\n`,
  );

  const heartbeat = setInterval(() => {
    res.write(": ping\n\n");
  }, 20000);

  req.on("close", () => {
    clearInterval(heartbeat);
    sseClients.delete(res);
  });
});

app.post(
  "/api/projects",
  upload.fields([
    { name: "voice", maxCount: 1 },
    { name: "reference", maxCount: 1 },
  ]),
  (req, res) => {
    const files = req.files as Record<string, Express.Multer.File[]> | undefined;
    const voiceFile = files?.voice?.[0];
    const refFile = files?.reference?.[0];

    if (!voiceFile) {
      if (refFile && fs.existsSync(refFile.path)) fs.unlinkSync(refFile.path);
      res.status(400).json({ error: "Voice audio file is required." });
      return;
    }

    const rawTitle =
      typeof req.body?.title === "string" ? req.body.title.trim() : "";
    const defaultTitle = path.parse(voiceFile.originalname).name || "Untitled Reel";
    const title = rawTitle || defaultTitle;
    const format =
      req.body?.format === "landscape" ? "landscape" : "portrait";
    const mode =
      req.body?.mode === "auto" ? "auto" : "supervised";
    const language =
      req.body?.language === "en" || req.body?.language === "hi"
        ? req.body.language
        : "auto";
    const fallbackThemeId =
      typeof req.body?.themeId === "string" && THEMES[req.body.themeId]
        ? req.body.themeId
        : "editorial-cream";

    const id = slugifyTitle(title);
    const projectDir = path.join(PROJECTS_DIR, id);
    fs.mkdirSync(projectDir, { recursive: true });

    const voiceExt = path.extname(voiceFile.originalname) || ".wav";
    const rawVoicePath = path.join(projectDir, `raw-voice${voiceExt}`);
    fs.renameSync(voiceFile.path, rawVoicePath);

    let referenceVideoPath: string | null = null;
    if (refFile) {
      const refExt = path.extname(refFile.originalname) || ".mp4";
      referenceVideoPath = path.join(projectDir, `reference${refExt}`);
      fs.renameSync(refFile.path, referenceVideoPath);
    }

    const record: ProjectRecord = {
      id,
      title,
      mode,
      status: "queued",
      stage: "queued",
      progress: 2,
      progressDetail: "Waiting in queue…",
      createdAt: new Date().toISOString(),
      format,
      language,
      hasReference: Boolean(referenceVideoPath),
      durationSec: null,
      styleColors: null,
      styleMeta: null,
      outputUrl: null,
      thumbUrl: null,
      error: null,
    };

    writeProject(record);
    pendingQueue.push({
      id,
      ctx: {
        projectDir,
        rawVoicePath,
        referenceVideoPath,
        fallbackThemeId,
        port: PORT,
      },
    });

    broadcastProjects();
    void processQueue();

    res.status(202).json({ project: record });
  },
);

app.delete("/api/projects/:id", (req, res) => {
  const id = req.params.id;
  if (!id || id.includes("..") || id.includes("/") || id.includes("\\")) {
    res.status(400).json({ error: "Invalid project id." });
    return;
  }

  const queueIdx = pendingQueue.findIndex((item) => item.id === id);
  if (queueIdx !== -1) {
    pendingQueue.splice(queueIdx, 1);
  }

  const running = activeHandles.get(id);
  if (running) {
    running.cancel();
  }

  const projectDir = path.join(PROJECTS_DIR, id);
  if (!fs.existsSync(projectDir)) {
    res.status(404).json({ error: "Project not found." });
    return;
  }

  // Defer removal slightly if a child process/render handle is tearing down Windows file locks.
  setTimeout(
    () => {
      try {
        fs.rmSync(projectDir, { recursive: true, force: true });
      } catch {
        // Ignore transient Windows lock; project.json is removed below if needed
      }
      broadcastProjects();
    },
    running ? 450 : 0,
  );

  // Immediately remove metadata so UI updates cleanly even during teardown.
  const metaPath = path.join(projectDir, "project.json");
  if (fs.existsSync(metaPath)) {
    fs.unlinkSync(metaPath);
  }
  broadcastProjects();

  res.json({ deleted: true, id });
});

let watchTimer: NodeJS.Timeout | null = null;
fs.watch(PROJECTS_DIR, { recursive: true }, (_event, filename) => {
  if (!filename || !filename.endsWith("project.json")) return;
  if (watchTimer) clearTimeout(watchTimer);
  watchTimer = setTimeout(() => {
    broadcastProjects();
  }, 250);
});

app.listen(PORT, "127.0.0.1", () => {
  console.log(`Reels Studio Web App running at http://127.0.0.1:${PORT}`);
});

