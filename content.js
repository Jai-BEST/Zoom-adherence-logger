let lastDetected = "";
let scanTimer = null;

async function getRecorderTerms() {
  const { settings } = await chrome.storage.local.get("settings");
  return (settings?.recorderNames || "rippling recorder,zoom recorder,recorder")
    .split(",")
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean);
}

async function scanForRecorder() {
  const { activeSession } = await chrome.storage.local.get("activeSession");
  if (!activeSession || activeSession.recorderJoinedAt) return;

  const terms = await getRecorderTerms();
  const visibleText = document.body?.innerText?.toLowerCase() || "";
  const found = terms.find((term) => visibleText.includes(term));
  if (!found || activeSession.id === lastDetected) return;

  lastDetected = activeSession.id;
  const latest = await chrome.storage.local.get("activeSession");
  if (latest.activeSession?.id !== activeSession.id || latest.activeSession.recorderJoinedAt) return;
  activeSession.recorderJoinedAt = new Date().toISOString();
  activeSession.recorderDisplayName = found;
  await chrome.storage.local.set({ activeSession });
}

function scheduleScan() {
  clearTimeout(scanTimer);
  scanTimer = setTimeout(scanForRecorder, 300);
}

const observer = new MutationObserver(scheduleScan);
observer.observe(document.documentElement, {
  childList: true,
  subtree: true,
  characterData: true,
});

scanForRecorder();
setInterval(scanForRecorder, 3000);
