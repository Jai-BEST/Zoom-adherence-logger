const $ = (id) => document.getElementById(id);
let ticker;

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char]));
}

function formatTime(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleTimeString([], { timeZone: "Asia/Kolkata", hour: "2-digit", minute: "2-digit", second: "2-digit" });
}

function formatDate(iso) {
  return iso ? new Date(iso).toLocaleDateString("en-GB", { timeZone: "Asia/Kolkata" }) : "—";
}

function formatDuration(ms) {
  const seconds = Math.max(0, Math.floor(ms / 1000));
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remaining = seconds % 60;
  return [hours, minutes, remaining]
    .slice(hours ? 0 : 1)
    .map((value) => String(value).padStart(2, "0"))
    .join(":");
}

async function render() {
  const data = await chrome.storage.local.get(["activeSession", "sessions", "settings"]);
  const active = data.activeSession;
  const sessions = (data.sessions || []);
  $("recorderNames").value = data.settings?.recorderNames || "rippling recorder,zoom recorder,recorder";

  $("idleView").hidden = Boolean(active);
  $("activeView").hidden = !active;
  clearInterval(ticker);

  if (active) {
    $("activeSessionName").textContent = active.sessionName || "Zoom session";
    $("startTime").textContent = formatTime(active.startedAt);
    $("recorderTime").textContent = active.recorderJoinedAt
      ? formatTime(active.recorderJoinedAt)
      : "Waiting…";
    $("markRecorderButton").hidden = Boolean(active.recorderJoinedAt);
    const updateElapsed = () => {
      $("elapsed").textContent = formatDuration(Date.now() - new Date(active.startedAt).getTime());
    };
    updateElapsed();
    ticker = setInterval(updateElapsed, 1000);
  }

  $("sessions").innerHTML = sessions.length
    ? sessions.map((item) => {
        const delay = item.recorderJoinedAt
          ? formatDuration(new Date(item.recorderJoinedAt) - new Date(item.startedAt))
          : "Not detected";
        return `<div class="session">
          <div class="sessionTitle"><span>${escapeHtml(item.sessionName || "Zoom session")}</span><span>${formatDate(item.startedAt)} · ${formatTime(item.startedAt)}</span></div>
          <div class="sessionMeta">End: ${formatTime(item.endedAt)} · Recorder delay: ${delay}</div>
        </div>`;
      }).join("")
    : '<div class="empty">No completed calls saved.</div>';
}

$("startButton").addEventListener("click", async () => {
  await chrome.storage.local.set({
    activeSession: {
      id: crypto.randomUUID(),
      sessionName: $("sessionName").value.trim(),
      startedAt: new Date().toISOString(),
      recorderJoinedAt: null,
      endedAt: null,
    },
  });
  $("sessionName").value = "";
  render();
});

$("markRecorderButton").addEventListener("click", async () => {
  const { activeSession } = await chrome.storage.local.get("activeSession");
  if (!activeSession) return;
  activeSession.recorderJoinedAt = new Date().toISOString();
  activeSession.recorderDisplayName = "Manually marked";
  await chrome.storage.local.set({ activeSession });
  render();
});

$("endButton").addEventListener("click", async () => {
  const data = await chrome.storage.local.get(["activeSession", "sessions"]);
  if (!data.activeSession) return;
  const complete = { ...data.activeSession, endedAt: new Date().toISOString() };
  await chrome.storage.local.set({
    sessions: [complete, ...(data.sessions || [])],
  });
  await chrome.storage.local.remove("activeSession");
  render();
});

$("saveSettingsButton").addEventListener("click", async () => {
  const recorderNames = $("recorderNames").value.trim();
  await chrome.storage.local.set({ settings: { recorderNames } });
  $("saveSettingsButton").textContent = "Saved";
  setTimeout(() => { $("saveSettingsButton").textContent = "Save names"; }, 1000);
});

function csvCell(value) {
  return `"${String(value ?? "").replaceAll('"', '""')}"`;
}

$("exportButton").addEventListener("click", async () => {
  const { sessions = [] } = await chrome.storage.local.get("sessions");
  const savedSessions = sessions;
  const rows = [[
    "Session name / chat or case number", "Start Date (IST)", "Start Time (IST)", "Recorder Joined (IST)", "End Date (IST)", "End Time (IST)",
    "Call Duration", "Recorder Delay", "Recorder Status"
  ]];

  savedSessions.forEach((item) => {
    rows.push([
      item.sessionName || "",
      formatDate(item.startedAt),
      formatTime(item.startedAt),
      formatTime(item.recorderJoinedAt),
      formatDate(item.endedAt),
      formatTime(item.endedAt),
      formatDuration(new Date(item.endedAt) - new Date(item.startedAt)),
      item.recorderJoinedAt ? formatDuration(new Date(item.recorderJoinedAt) - new Date(item.startedAt)) : "",
      item.recorderJoinedAt ? "Joined" : "Not detected",
    ]);
  });

  const csv = rows.map((row) => row.map(csvCell).join(",")).join("\r\n");
  const url = URL.createObjectURL(new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = `zoom-recorder-log-${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
});

chrome.storage.onChanged.addListener(render);
render();

$("resetButton").addEventListener("click", () => $("resetDialog").showModal());
$("cancelResetButton").addEventListener("click", () => $("resetDialog").close());
$("confirmResetButton").addEventListener("click", async () => {
  $("confirmResetButton").disabled = true;
  try {
    await chrome.storage.local.remove(["sessions", "activeSession"]);
    $("resetDialog").close();
    await render();
  } finally {
    $("confirmResetButton").disabled = false;
  }
});
