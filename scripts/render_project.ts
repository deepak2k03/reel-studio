/**
 * Render QA stills or the final 60 fps MP4 for a web project under `data/projects/<id>/`
 * and sync status back to `project.json` for the live Web UI.
 *
 * Usage:
 *   node .\node_modules\tsx\dist\cli.mjs scripts/render_project.ts <id> --still 90 out/qa.png
 *   node .\node_modules\tsx\dist\cli.mjs scripts/render_project.ts <id> --render
 */
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import { bundle } from "@remotion/bundler";
import { renderMedia, renderStill, selectComposition } from "@remotion/renderer";
import type { ProjectRecord } from "../server/types";
import { resolveCueTime, secToFrame } from "../src/lib/timing";
import type { StyleSpec, TimelineData, TranscriptData } from "../src/lib/types";

const REPO_ROOT = path.resolve(__dirname, "..");

const MIME_TYPES: Record<string, string> = {
  ".wav": "audio/wav",
  ".mp3": "audio/mpeg",
  ".m4a": "audio/mp4",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".json": "application/json",
};

function startTempMediaServer(projectDir: string): Promise<{ server: http.Server; port: number }> {
  const rootResolved = path.resolve(projectDir);
  return new Promise((resolve, reject) => {
    const server = http.createServer((req, res) => {
      const reqUrl = decodeURIComponent((req.url ?? "/").split("?")[0]).replace(/^\/+/, "");
      const filePath = path.resolve(rootResolved, reqUrl);
      if (!filePath.startsWith(rootResolved) || !fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
        res.statusCode = 404;
        res.end("Not found");
        return;
      }
      const ext = path.extname(filePath).toLowerCase();
      if (MIME_TYPES[ext]) {
        res.setHeader("Content-Type", MIME_TYPES[ext]);
      }
      res.setHeader("Access-Control-Allow-Origin", "*");
      fs.createReadStream(filePath).pipe(res);
    });
    server.on("error", reject);
    server.listen(0, "127.0.0.1", () => {
      const addr = server.address();
      if (!addr || typeof addr === "string") {
        reject(new Error("Could not bind media server"));
        return;
      }
      resolve({ server, port: addr.port });
    });
  });
}

async function main() {
  const args = process.argv.slice(2);
  const id = args[0];
  if (!id) {
    console.error("Missing project id");
    process.exit(1);
  }

  const projectDir = path.join(REPO_ROOT, "data", "projects", id);
  const projectJsonPath = path.join(projectDir, "project.json");
  const transcriptPath = path.join(projectDir, "transcript.json");
  const timelinePath = path.join(projectDir, "timeline.json");
  const styleSpecPath = path.join(projectDir, "style-spec.json");

  if (!fs.existsSync(projectDir)) {
    throw new Error(`Project directory not found: ${projectDir}`);
  }

  const transcript = JSON.parse(fs.readFileSync(transcriptPath, "utf-8")) as TranscriptData;
  const rawTimeline = JSON.parse(fs.readFileSync(timelinePath, "utf-8")) as TimelineData;
  const styleSpec = JSON.parse(fs.readFileSync(styleSpecPath, "utf-8")) as StyleSpec;

  const { server, port } = await startTempMediaServer(projectDir);
  try {
    const timeline: TimelineData = {
      ...rawTimeline,
      audioFile: `http://127.0.0.1:${port}/voice.wav`,
    };

    const serveUrl = await bundle({
      entryPoint: path.join(REPO_ROOT, "src", "index.ts"),
    });

    const inputProps = {
      timeline,
      transcript,
      styleSpec,
      showSafeZones: false,
      mediaBaseUrl: `http://127.0.0.1:${port}`,
    };

    const composition = await selectComposition({
      serveUrl,
      id: "DynamicReel",
      inputProps,
    });

    const qaSheetIdx = args.indexOf("--qa-sheet");
    if (qaSheetIdx !== -1) {
      const nextArg = args[qaSheetIdx + 1];
      const sheetOut = path.resolve(
        REPO_ROOT,
        nextArg && !nextArg.startsWith("--") ? nextArg : `out/qa-${id}-sheet.png`,
      );
      const tmpDir = path.join(REPO_ROOT, "out", `.qa-tmp-${id}`);
      fs.mkdirSync(tmpDir, { recursive: true });
      fs.mkdirSync(path.dirname(sheetOut), { recursive: true });

      const fps = timeline.fps || transcript.fps || 60;
      const frames: number[] = [];
      for (const sc of timeline.scenes) {
        const scStart = resolveCueTime(transcript, sc.start, sc.cuePhrase);
        const scEnd = Math.max(scStart + 0.5, sc.end);
        const checkSec = scStart + (scEnd - scStart) * 0.62;
        const frameNum = Math.min(
          Math.max(1, composition.durationInFrames - 2),
          secToFrame(checkSec, fps),
        );
        frames.push(frameNum);
      }

      try {
        for (let i = 0; i < frames.length; i++) {
          const shotPath = path.join(tmpDir, `shot_${String(i).padStart(2, "0")}.png`);
          await renderStill({
            composition,
            serveUrl,
            frame: frames[i],
            output: shotPath,
            inputProps,
          });
          console.log(`QA scene ${i + 1} (frame ${frames[i]}): ${timeline.scenes[i].id} [${timeline.scenes[i].type}]`);
        }

        const cols = Math.min(3, Math.max(1, frames.length));
        const rows = Math.max(1, Math.ceil(frames.length / cols));
        const ff = spawnSync(
          "ffmpeg",
          [
            "-y",
            "-i",
            path.join(tmpDir, "shot_%02d.png"),
            "-vf",
            `scale=360:-1,tile=${cols}x${rows}:padding=12:margin=12:color=18181b`,
            sheetOut,
          ],
          { cwd: REPO_ROOT, encoding: "utf-8" },
        );
        if (ff.status !== 0) {
          throw new Error(ff.stderr || "ffmpeg tile command failed");
        }
        console.log(`Rendered QA contact sheet (${frames.length} scenes): ${sheetOut}`);
      } finally {
        fs.rmSync(tmpDir, { recursive: true, force: true });
      }
      return;
    }

    const stillIdx = args.indexOf("--still");
    if (stillIdx !== -1) {
      const frame = Number(args[stillIdx + 1] ?? 0);
      const outPng = path.resolve(REPO_ROOT, args[stillIdx + 2] ?? `out/qa-${id}-${frame}.png`);
      fs.mkdirSync(path.dirname(outPng), { recursive: true });
      await renderStill({
        composition,
        serveUrl,
        frame,
        output: outPng,
        inputProps,
      });
      console.log(`Rendered still frame ${frame}: ${outPng}`);
      return;
    }

    const updateMeta = (patch: Partial<ProjectRecord>) => {
      if (!fs.existsSync(projectJsonPath)) return;
      const cur = JSON.parse(fs.readFileSync(projectJsonPath, "utf-8")) as ProjectRecord;
      fs.writeFileSync(projectJsonPath, JSON.stringify({ ...cur, ...patch }, null, 2), "utf-8");
    };

    updateMeta({
      status: "processing",
      stage: "render",
      progress: 55,
      progressDetail: "Rendering supervised 60 fps MP4…",
    });

    const outputMp4 = path.join(projectDir, "output.mp4");
    await renderMedia({
      composition,
      serveUrl,
      codec: "h264",
      outputLocation: outputMp4,
      inputProps,
      concurrency: 4,
      overwrite: true,
      onProgress: ({ progress, renderedFrames, stitchStage }) => {
        const pct = Math.min(99, Math.round(55 + progress * 44));
        const detail =
          stitchStage === "muxing"
            ? "Muxing audio & MP4…"
            : `Supervised render: ${renderedFrames} / ${composition.durationInFrames} (${Math.round(progress * 100)}%)`;
        updateMeta({
          status: "processing",
          stage: "render",
          progress: pct,
          progressDetail: detail,
        });
      },
    });

    const thumbPng = path.join(projectDir, "thumb.png");
    if (!fs.existsSync(thumbPng)) {
      spawnSync(
        "ffmpeg",
        ["-y", "-ss", "1.5", "-i", outputMp4, "-frames:v", "1", "-q:v", "3", thumbPng],
        { stdio: "ignore" },
      );
    }

    updateMeta({
      status: "ready",
      stage: "done",
      progress: 100,
      progressDetail: "Supervised & Ready",
      outputUrl: `/media/projects/${id}/output.mp4`,
      thumbUrl: fs.existsSync(thumbPng) ? `/media/projects/${id}/thumb.png` : null,
      error: null,
    });

    console.log(`Rendered supervised MP4: ${outputMp4}`);
  } finally {
    server.close();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

