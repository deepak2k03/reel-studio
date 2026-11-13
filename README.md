# Reels Studio (60 fps Software Engineering Video System)

A local-first, voice-driven animation studio built on **Remotion (`1080x1920`, 60 fps)**, **FFmpeg**, and **`faster-whisper`** (CPU `int8`) for creating custom software engineering explainer Reels synchronized to your voice recording and optional reference video style.

---

## Prerequisites

- **Node.js + `pnpm`** (`pnpm install` already configured)
- **Python virtualenv** at `.venv/` with `faster-whisper` and `numpy` installed (`.\.venv\Scripts\python.exe`)
- **`ffmpeg` & `ffprobe`** available on `PATH`

---

## Step-by-Step: How to Create a Video

### Method A: Using the Web App (`Supervise with Antigravity` — Recommended for Maximum Quality)

This workflow prepares your audio alignment and reference style locally, then lets **Antigravity** craft bespoke topic-specific animations, custom SVG/generated illustrations, and QA stills before rendering the final 60 fps MP4 back to the Web UI.

#### Step 1: Start the Web App Server
```powershell
pnpm app
```
Open **`http://127.0.0.1:3100`** in your browser.

#### Step 2: Upload Voice & Reference Video
1. *(Optional)* Enter a **Project title** (e.g., `How Redis Caching Works`).
2. Drop or browse your **Voice Recording** (`.wav`, `.mp3`, `.m4a`, `.aac`, `.ogg`, `.flac`).
3. *(Optional)* Drop a **Reference Style Video** (`.mp4`, `.mov`, `.webm`, `.mkv`) to match its palette, lighting polarity (light editorial or dark), and pacing.
   - If you skip the reference video, choose a **Fallback style** (`Editorial Cream` default, `Midnight Dev`, `API Bridge`, `Terminal Amber`, or `Clean Diagram`).
4. Choose your settings:
   - **Workflow:** `Supervise with Antigravity` *(default)*
   - **Format:** `9:16 Reels (1080×1920)` or `16:9 Video (1920×1080)`
   - **Speech:** `Auto-detect`, `English`, or `Hindi / Hinglish`

#### Step 3: Prepare Project Assets
Click **`Prepare for Antigravity`**.  
In **Current Generation**, the local pipeline runs Stages 1–3 automatically on CPU:
1. **1. Voice Align:** FFmpeg normalizes loudness & trims excessive silence (`voice.wav`), then `faster-whisper` (`small`, `int8`) extracts exact word timestamps (`transcript.json`).
2. **2. Style Extract:** `extract_style.py` extracts colors, dark/light polarity, shot cadence, thumbnail (`thumb.png`), and 6 reference keyframes (`ref-frames/ref_01..06.png`), or applies your selected fallback theme (`style-spec.json`).
3. **3. Draft Plan:** `server/storyboard.ts` generates a starter voice-synced `timeline.json`.

The project pauses at **4. Antigravity QA** (`48%`) with status **`Needs Antigravity`**.

#### Step 4: Hand Off to Antigravity for Bespoke Design & Rendering
1. Click **`Copy Prompt for Antigravity`** (on the active job card) or **`Copy Prompt`** (in **Recent Projects**).  
   It copies:
   ```text
   Supervise, refine visuals, QA stills, and render project data/projects/<project-id>
   ```
2. Paste that prompt into **Antigravity chat**.
3. Antigravity will:
   - Inspect `ref-frames/*.png`, `style-spec.json`, `voice.wav`, and fix any Hinglish/technical spelling in `transcript.json`.
   - Design bespoke, topic-specific animations under `src/custom-scenes/<project-id>/` (registered in `src/custom-scenes/registry.ts`), custom animated SVGs, icons (`lucide-react` / `simple-icons`), or custom illustrations in `data/projects/<project-id>/assets/`, plus update `data/projects/<project-id>/timeline.json` anchored to exact `transcript.json` voice cues.
   - Run `pnpm typecheck`.
   - Render checkpoint stills via `scripts/render_project.ts <id> --still <frame> ...` and visually inspect every scene for centering, contrast, and zero overlap.
   - Render the final **60 fps H.264 MP4** to `data/projects/<id>/output.mp4` and update `project.json` to **`Ready`** (`100%`).

#### Step 5: Watch, Download, or Delete
Back in `http://127.0.0.1:3100`, the project updates live to **`Ready`**:
- Click **`Watch`** to preview the rendered video in the modal player.
- Click **`Download`** to save `<project-id>.mp4`.
- Click **`Delete`** → **`Confirm Delete`** (or **`Cancel`** while queued/running) to clean up unwanted projects.

---

### Method B: `Quick Auto Render` (One-Click Automated Video)

If you want a fast automated render without manual supervision:
1. Open **`http://127.0.0.1:3100`**.
2. Upload your **Voice Recording** (+ optional **Reference Style Video**).
3. Switch **Workflow** to **`Quick Auto Render`**.
4. Click **`Generate Video`**.
5. Wait for Stages 1–5 (**Voice Align → Style Extract → Draft Plan → Render 60fps**) to reach `100%`, then **`Watch`** or **`Download`** the MP4.

---

### Method C: Manual CLI & Remotion Studio Workflow (Advanced)

For editing compositions directly in code without the Web UI:

#### 1. Add Raw Voiceover & Align Words
1. Place raw audio at `public/projects/<slug>/raw-voice.m4a` (or `.wav` / `.mp3`).
2. Clean audio and extract word-level timestamps on CPU:
   ```powershell
   .\.venv\Scripts\python.exe scripts\process_voice.py <slug>
   ```
   Outputs:
   - `public/projects/<slug>/voice.wav`
   - `src/projects/<slug>/transcript.json`
   - `src/projects/<slug>/timeline.json`

#### 2. *(Optional)* Extract Reference Video Style & Keyframes
1. Place a reference clip at `references/<name>.mp4`.
2. Run:
   ```powershell
   .\.venv\Scripts\python.exe scripts\extract_style.py references\<name>.mp4 --out src\projects\<slug>\style-spec.json --frames-dir references\<name>\frames
   ```
   *(Or run `.\.venv\Scripts\python.exe scripts\analyze_reference.py references\<name>.mp4` for full cut/frame analysis.)*

#### 3. Build Custom Scenes (`custom-scene`) & Register Composition
- Author bespoke Remotion scenes under `src/custom-scenes/<slug>/` and register them in `src/custom-scenes/registry.ts`.
- Reference them in `timeline.json` (`"type": "custom-scene"`, `"componentId": "<slug>/<scene-name>"`), or use built-in scenes (`hero-visual`, `token-breakdown`, `sequence-diagram`, `client-api-server`, `bridge-architecture`, `metric-compare`, `code-stepper`, `terminal`, `restaurant-metaphor`).
- Register new standalone compositions in `src/Root.tsx` (`1080x1920`, `60` fps, `durationInFrames` from `transcript.durationFrames`).

#### 4. Preview, QA Stills, & Final Render
- Launch Remotion Studio for interactive timeline scrubbing:
  ```powershell
  pnpm dev
  ```
- Typecheck & inspect checkpoint stills before rendering:
  ```powershell
  pnpm typecheck
  pnpm still <CompositionId> out\qa.png --frame=300
  ```
- Export the final 60 fps MP4:
  ```powershell
  pnpm render <CompositionId> out\<slug>.mp4
  ```

For web app projects under `data/projects/<id>/`, use the project render helper instead:
```powershell
node .\node_modules\tsx\dist\cli.mjs scripts\render_project.ts <id> --still 120 out\qa.png
node .\node_modules\tsx\dist\cli.mjs scripts\render_project.ts <id> --render
```

---

## Project File Structure

```text
e:\Reels\
├── server/                 # Express API, SSE progress stream, job queue & auto-storyboard
├── web/                    # Lightweight Studio UI (http://127.0.0.1:3100)
├── src/
│   ├── components/         # Core Remotion components, diagrams, captions & TechIcon
│   ├── custom-scenes/      # Per-Reel bespoke TSX scenes + registry.ts
│   └── lib/                # Themes (themes.ts), timing helpers & TypeScript types
├── scripts/                # CPU voice aligner, style extractor & project MP4 renderer
└── data/projects/<id>/     # Per-project voice.wav, transcript.json, style-spec.json,
                            # ref-frames/, assets/, timeline.json, and output.mp4
```
