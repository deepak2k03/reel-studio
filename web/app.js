const form = document.getElementById("create-form");
const titleInput = document.getElementById("title-input");
const voiceZone = document.getElementById("voice-zone");
const voiceInput = document.getElementById("voice-input");
const voiceLabel = document.getElementById("voice-label");
const refZone = document.getElementById("ref-zone");
const refInput = document.getElementById("ref-input");
const refLabel = document.getElementById("ref-label");
const refClear = document.getElementById("ref-clear");
const musicZone = document.getElementById("music-zone");
const musicInput = document.getElementById("music-input");
const musicLabel = document.getElementById("music-label");
const musicClear = document.getElementById("music-clear");
const musicEnabled = document.getElementById("music-enabled");
const musicVolume = document.getElementById("music-volume");
const musicVolumeLabel = document.getElementById("music-volume-label");
const themeWrap = document.getElementById("theme-wrap");
const submitBtn = document.getElementById("submit-btn");
const formError = document.getElementById("form-error");

const progressSection = document.getElementById("progress-section");
const activeJobsEl = document.getElementById("active-jobs");
const queueCountEl = document.getElementById("queue-count");

const projectsListEl = document.getElementById("projects-list");
const projectCountEl = document.getElementById("project-count");

const playerModal = document.getElementById("player-modal");
const modalTitle = document.getElementById("modal-title");
const modalVideo = document.getElementById("modal-video");
const modalDownload = document.getElementById("modal-download");
const modalCloseBtn = document.getElementById("modal-close-btn");
const modalCloseBg = document.getElementById("modal-close-bg");

const modeSelect = document.getElementById("mode-select");
const STAGES = [
  { key: "audio", label: "1. Voice Align" },
  { key: "style", label: "2. Style Extract" },
  { key: "storyboard", label: "3. Draft Plan" },
  { key: "supervision", label: "4. Antigravity QA" },
  { key: "render", label: "5. Render 60fps" },
];

function syncSubmitLabel() {
  submitBtn.textContent =
    modeSelect.value === "supervised"
      ? "Prepare for Antigravity"
      : "Generate Video";
}
modeSelect.addEventListener("change", syncSubmitLabel);
syncSubmitLabel();

let selectedVoice = null;
let selectedReference = null;
let selectedMusic = null;
const confirmDeleteIds = new Set();

function formatSize(bytes) {
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDuration(sec) {
  if (!sec) return "";
  return `${sec.toFixed(1)}s`;
}

function formatDate(iso) {
  const d = new Date(iso);
  return d.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function bindDropzone(zone, input, onFile) {
  zone.addEventListener("click", (e) => {
    if (e.target.closest("button")) return;
    input.click();
  });
  input.addEventListener("change", () => {
    if (input.files && input.files[0]) {
      onFile(input.files[0]);
    }
  });
  zone.addEventListener("dragover", (e) => {
    e.preventDefault();
    zone.classList.add("dragover");
  });
  zone.addEventListener("dragleave", () => zone.classList.remove("dragover"));
  zone.addEventListener("drop", (e) => {
    e.preventDefault();
    zone.classList.remove("dragover");
    const file = e.dataTransfer?.files?.[0];
    if (file) onFile(file);
  });
}

function updateVoiceUI(file) {
  selectedVoice = file;
  if (file) {
    voiceZone.classList.add("has-file");
    voiceLabel.textContent = `${file.name} (${formatSize(file.size)})`;
  } else {
    voiceZone.classList.remove("has-file");
    voiceLabel.textContent = "Drop audio or click to browse (.wav, .mp3, .m4a)";
  }
}

function updateRefUI(file) {
  selectedReference = file;
  if (file) {
    refZone.classList.add("has-file");
    refLabel.textContent = `${file.name} (${formatSize(file.size)})`;
    refClear.classList.remove("hidden");
    themeWrap.classList.add("hidden");
  } else {
    refZone.classList.remove("has-file");
    refLabel.textContent = "Drop clip to match colors & pacing (.mp4, .mov)";
    refClear.classList.add("hidden");
    themeWrap.classList.remove("hidden");
    refInput.value = "";
  }
}

function updateMusicUI(file) {
  selectedMusic = file;
  musicZone.classList.toggle("has-file", Boolean(file));
  musicLabel.textContent = file
    ? `${file.name} (${formatSize(file.size)})`
    : "Use the studio ambient bed, or choose your own track";
  musicClear.classList.toggle("hidden", !file);
  musicEnabled.disabled = false;
  if (file) musicEnabled.checked = true;
  musicInput.value = "";
}

bindDropzone(voiceZone, voiceInput, updateVoiceUI);
bindDropzone(refZone, refInput, updateRefUI);
bindDropzone(musicZone, musicInput, updateMusicUI);
refClear.addEventListener("click", (e) => {
  e.stopPropagation();
  updateRefUI(null);
});
musicClear.addEventListener("click", (e) => {
  e.stopPropagation();
  updateMusicUI(null);
});
musicVolume.addEventListener("input", () => {
  musicVolumeLabel.textContent = `${musicVolume.value}%`;
});

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  formError.classList.add("hidden");

  if (!selectedVoice) {
    formError.textContent = "Please choose a voice recording first.";
    formError.classList.remove("hidden");
    return;
  }

  submitBtn.disabled = true;
  submitBtn.textContent = "Uploading…";

  try {
    const fd = new FormData();
    fd.append("title", titleInput.value.trim());
    fd.append("mode", modeSelect.value);
    fd.append("format", document.getElementById("format-select").value);
    fd.append("language", document.getElementById("lang-select").value);
    fd.append("themeId", document.getElementById("theme-select").value);
    fd.append("voice", selectedVoice);
    if (selectedReference) {
      fd.append("reference", selectedReference);
    }
    if (selectedMusic) fd.append("music", selectedMusic);
    fd.append("musicEnabled", String(musicEnabled.checked));
    fd.append("musicVolume", String(Number(musicVolume.value) / 100));

    const res = await fetch("/api/projects", { method: "POST", body: fd });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || "Upload failed");
    }

    titleInput.value = "";
    voiceInput.value = "";
    updateVoiceUI(null);
    updateRefUI(null);
    updateMusicUI(null);
    musicEnabled.checked = true;
    musicVolume.value = "4";
    musicVolumeLabel.textContent = "4%";
  } catch (err) {
    formError.textContent = err.message || "Failed to start generation";
    formError.classList.remove("hidden");
  } finally {
    submitBtn.disabled = false;
    syncSubmitLabel();
  }
});

function buildSupervisionPrompt(id) {
  return `Supervise, refine visuals, QA stills, and render project data/projects/${id}`;
}

function renderActiveJobs(projects) {
  const active = projects.filter(
    (p) =>
      p.status === "queued" ||
      p.status === "processing" ||
      p.status === "awaiting_supervision",
  );

  if (active.length === 0) {
    progressSection.classList.add("hidden");
    activeJobsEl.innerHTML = "";
    return;
  }

  progressSection.classList.remove("hidden");
  queueCountEl.textContent = `${active.length} active`;

  activeJobsEl.innerHTML = active
    .map((job) => {
      const currentIdx = STAGES.findIndex((s) => s.key === job.stage);
      const stagePills = STAGES.map((s, idx) => {
        let cls = "stage-pill";
        if (currentIdx > idx) cls += " done";
        else if (currentIdx === idx) cls += " active";
        return `<span class="${cls}">${s.label}</span>`;
      }).join("");

      const isWaitingSupervision = job.status === "awaiting_supervision";

      return `
        <div class="job-card">
          <div class="job-top">
            <span class="job-title">${escapeHtml(job.title)}</span>
            <span class="job-pct">${job.progress}%</span>
          </div>
          <div class="bar-track">
            <div class="bar-fill" style="width: ${job.progress}%"></div>
          </div>
          <div class="stages">${stagePills}</div>
          <div class="job-foot">
            <span>${escapeHtml(job.progressDetail || "Working…")}</span>
            <div style="display:flex; gap:8px; align-items:center;">
              ${
                isWaitingSupervision
                  ? `<button type="button" class="btn-accent" data-copy-prompt="${escapeHtml(buildSupervisionPrompt(job.id))}">Copy Prompt for Antigravity</button>`
                  : ""
              }
              <button type="button" class="btn-danger" data-delete-id="${escapeHtml(job.id)}">
                Cancel
              </button>
            </div>
          </div>
        </div>
      `;
    })
    .join("");
}

function renderProjects(projects) {
  projectCountEl.textContent = `${projects.length} project${projects.length === 1 ? "" : "s"}`;

  if (projects.length === 0) {
    projectsListEl.innerHTML =
      '<div class="empty-state">No projects yet. Upload a voice recording to generate one.</div>';
    return;
  }

  projectsListEl.innerHTML = projects
    .map((p) => {
      const badgeCls =
        p.status === "ready"
          ? "badge-ready"
          : p.status === "awaiting_supervision"
            ? "badge-supervision"
            : p.status === "failed"
              ? "badge-failed"
              : "badge-processing";

      const badgeText =
        p.status === "ready"
          ? "Ready"
          : p.status === "awaiting_supervision"
            ? "Needs Antigravity"
            : p.status === "failed"
              ? "Failed"
              : `${p.progress}%`;

      const thumbHtml = p.thumbUrl
        ? `<img class="thumb" src="${escapeHtml(p.thumbUrl)}" alt="" />`
        : p.styleColors
          ? `<div class="thumb-placeholder" style="background:${escapeHtml(p.styleColors.bg)}">
              <span class="swatch" style="background:${escapeHtml(p.styleColors.accent)}"></span>
              <span class="swatch" style="background:${escapeHtml(p.styleColors.captionHighlight)}"></span>
            </div>`
          : `<div class="thumb-placeholder" style="background:#0f172a"></div>`;

      const metaParts = [
        p.format === "landscape" ? "16:9" : "9:16",
        p.durationSec ? formatDuration(p.durationSec) : null,
        p.hasReference ? "Ref matched" : null,
        formatDate(p.createdAt),
      ].filter(Boolean);

      const isConfirming = confirmDeleteIds.has(p.id);

      return `
        <div class="project-row">
          <div class="project-left">
            ${thumbHtml}
            <div class="project-info">
              <div class="project-name">${escapeHtml(p.title)}</div>
              <div class="project-meta">
                <span>${metaParts.join(" · ")}</span>
                ${p.error ? `<span style="color: var(--danger)">${escapeHtml(p.error)}</span>` : ""}
              </div>
            </div>
          </div>
          <div class="project-actions">
            <span class="badge ${badgeCls}">${badgeText}</span>
            ${
              p.status === "awaiting_supervision"
                ? `<button type="button" class="btn-accent" data-copy-prompt="${escapeHtml(buildSupervisionPrompt(p.id))}">Copy Prompt</button>`
                : ""
            }
            ${
              p.status === "ready" && p.outputUrl
                ? `<button type="button" class="btn-ghost" data-play-url="${escapeHtml(p.outputUrl)}" data-play-title="${escapeHtml(p.title)}">Watch</button>
                   <a class="btn-ghost" href="${escapeHtml(p.outputUrl)}" download="${escapeHtml(p.id)}.mp4">Download</a>`
                : ""
            }
            <button
              type="button"
              class="btn-danger ${isConfirming ? "confirming" : ""}"
              data-delete-id="${escapeHtml(p.id)}"
            >
              ${isConfirming ? "Confirm Delete" : "Delete"}
            </button>
          </div>
        </div>
      `;
    })
    .join("");
}

function openModal(url, title) {
  modalTitle.textContent = title;
  modalVideo.src = url;
  modalDownload.href = url;
  modalDownload.download = `${title.toLowerCase().replace(/[^a-z0-9]+/g, "-") || "reel"}.mp4`;
  playerModal.classList.remove("hidden");
  void modalVideo.play().catch(() => {});
}

function closeModal() {
  modalVideo.pause();
  modalVideo.removeAttribute("src");
  playerModal.classList.add("hidden");
}

modalCloseBtn.addEventListener("click", closeModal);
modalCloseBg.addEventListener("click", closeModal);

document.addEventListener("click", async (e) => {
  const copyBtn = e.target.closest("[data-copy-prompt]");
  if (copyBtn) {
    const promptText = copyBtn.dataset.copyPrompt;
    try {
      await navigator.clipboard.writeText(promptText);
      const old = copyBtn.textContent;
      copyBtn.textContent = "Copied!";
      setTimeout(() => {
        copyBtn.textContent = old;
      }, 1800);
    } catch {
      window.prompt("Copy this prompt into Antigravity chat:", promptText);
    }
    return;
  }

  const playBtn = e.target.closest("[data-play-url]");
  if (playBtn) {
    openModal(playBtn.dataset.playUrl, playBtn.dataset.playTitle || "Preview");
    return;
  }

  const delBtn = e.target.closest("[data-delete-id]");
  if (delBtn) {
    const id = delBtn.dataset.deleteId;
    const isCancelJob = delBtn.textContent.trim() === "Cancel";

    if (!isCancelJob && !confirmDeleteIds.has(id)) {
      confirmDeleteIds.add(id);
      delBtn.classList.add("confirming");
      delBtn.textContent = "Confirm Delete";
      setTimeout(() => {
        if (confirmDeleteIds.delete(id)) {
          delBtn.classList.remove("confirming");
          delBtn.textContent = "Delete";
        }
      }, 3000);
      return;
    }

    confirmDeleteIds.delete(id);
    delBtn.disabled = true;
    await fetch(`/api/projects/${encodeURIComponent(id)}`, { method: "DELETE" });
  }
});

function handleProjectsUpdate(projects) {
  renderActiveJobs(projects);
  renderProjects(projects);
}

// Initial fetch + live SSE stream
fetch("/api/projects")
  .then((r) => r.json())
  .then((d) => handleProjectsUpdate(d.projects || []))
  .catch(() => {});

const events = new EventSource("/api/events");
events.onmessage = (msg) => {
  try {
    const payload = JSON.parse(msg.data);
    if (payload.type === "projects") {
      handleProjectsUpdate(payload.projects || []);
    }
  } catch {
    // Ignore keepalives
  }
};

