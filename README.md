# Reels Studio (60 fps Software Engineering Video System)

A local-first, voice-driven animation studio built on **Remotion (`1080x1920`, 60 fps)**, **FFmpeg**, and **`faster-whisper`** (CPU `int8`) for creating high-craft software engineering explainer Reels.

## Quickstart

### 1. Start the Web App (Recommended)
```powershell
pnpm app
```
Open `http://127.0.0.1:3100` to upload a voice recording + optional reference style video, watch live generation progress, preview/download MP4s, and manage recent projects.

### 2. Preview the included demo Reels in Remotion Studio
```powershell
pnpm dev
```
This opens **Remotion Studio** in your browser with the `DemoCacheStampede` sample (`60 fps`, `1080x1920`).

### 2. Create a Reel from your voice recording
1. Drop your raw voice file at `public/projects/<slug>/raw-voice.m4a` (or `.wav` / `.mp3`).
2. Clean the audio & extract word-level timestamps on CPU:
   ```powershell
   .\.venv\Scripts\python.exe scripts\process_voice.py <slug>
   ```
   This outputs:
   - `public/projects/<slug>/voice.wav` (loudness-normalized, dead-air trimmed)
   - `src/projects/<slug>/transcript.json` (exact `start`/`end` seconds & frame numbers per word + detected pauses)
   - `src/projects/<slug>/timeline.json` (starter scene timeline)
3. Edit `src/projects/<slug>/timeline.json` (or ask Antigravity to build custom scenes anchored to your `cuePhrase` timestamps), register it in `src/Root.tsx`, verify checkpoint frames, and render:
   ```powershell
   pnpm still <CompositionId> out\qa.png --frame=300
   pnpm render <CompositionId> out\<slug>.mp4
   ```

### 3. Extract pacing & style from a reference video
1. Place a reference clip at `references/<name>.mp4`.
2. Run:
   ```powershell
   .\.venv\Scripts\python.exe scripts\analyze_reference.py references\<name>.mp4
   ```
3. Ask Antigravity to inspect `references/<name>/analysis.json` and `references/<name>/frames/` to generate a matching `style-spec.json` and theme.

