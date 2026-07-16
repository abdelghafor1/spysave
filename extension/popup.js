const apiBaseInput = document.getElementById("apiBase");
const userIdInput = document.getElementById("userId");
const pageNameInput = document.getElementById("pageName");
const adTextInput = document.getElementById("adText");
const landingPageUrlInput = document.getElementById("landingPageUrl");
const mediaUrlInput = document.getElementById("mediaUrl");
const tagsInput = document.getElementById("tags");
const notesInput = document.getElementById("notes");
const competitorNameInput = document.getElementById("competitorName");
const competitorUrlInput = document.getElementById("competitorUrl");
const competitorNicheInput = document.getElementById("competitorNiche");
const competitorNotesInput = document.getElementById("competitorNotes");
const detectBtn = document.getElementById("detectBtn");
const detectCompetitorBtn = document.getElementById("detectCompetitorBtn");
const clearBtn = document.getElementById("clearBtn");
const pickBtn = document.getElementById("pickBtn");
const saveBtn = document.getElementById("saveBtn");
const saveCompetitorBtn = document.getElementById("saveCompetitorBtn");
const adsTab = document.getElementById("adsTab");
const competitorsTab = document.getElementById("competitorsTab");
const adsPanel = document.getElementById("adsPanel");
const competitorsPanel = document.getElementById("competitorsPanel");
const statusEl = document.getElementById("status");
const DEFAULT_API_BASE = "https://spysave.vercel.app";
let isPickMode = false;

function setStatus(message, isError = false) {
  statusEl.textContent = message;
  statusEl.style.color = isError ? "#b42318" : "#2f8a61";
}

function debounce(callback, delay = 250) {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => callback(...args), delay);
  };
}

async function getActiveTab() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  return tab;
}

async function loadSavedSettings() {
  const data = await chrome.storage.sync.get(["apiBase", "userId"]);
  apiBaseInput.value = data.apiBase || DEFAULT_API_BASE;
  userIdInput.value = data.userId || "";
}

function readPageContext() {
  const selectedText = window.getSelection()?.toString().trim() || "";
  const metaTitle = document.querySelector("meta[property='og:title']")?.content;
  const textCandidates = Array.from(
    document.querySelectorAll("article, [role='article'], [data-ad-preview], div, span"),
  )
    .map((element) => element.innerText?.trim() || "")
    .filter((text) => text.length >= 40 && text.length <= 1800)
    .filter((text) => !/comment|share|like|privacy|cookies|log in|sign up|creative tools|trends/i.test(text))
    .sort((a, b) => b.length - a.length);

  const links = Array.from(document.querySelectorAll("a[href]"))
    .map((link) => link.href)
    .filter(Boolean)
    .filter((href) => {
      try {
        const url = new URL(href);
        return (
          !url.hostname.includes("facebook.com") &&
          !url.hostname.includes("meta.com") &&
          !url.hostname.includes("tiktok.com")
        );
      } catch {
        return false;
      }
    });
  const mediaUrl =
    Array.from(document.querySelectorAll("video[src], img[src]"))
      .map((element) => element.currentSrc || element.src)
      .filter(Boolean)
      .find((src) => /^https?:\/\//i.test(src)) || "";

  const cleanTitle = (metaTitle || document.title || "")
    .replace(/\| Facebook.*$/i, "")
    .replace(/- Meta.*$/i, "")
    .replace(/\| TikTok.*$/i, "")
    .replace(/TikTok Creative Center/i, "TikTok Creative Center")
    .trim();

  return {
    selectedText,
    detectedText: selectedText || textCandidates[0] || "",
    title: cleanTitle,
    landingPageUrl: links[0] || "",
    mediaUrl,
    url: window.location.href,
  };
}

const saveSettings = debounce(async () => {
  const apiBase = apiBaseInput.value.trim().replace(/\/$/, "");
  const userId = userIdInput.value.trim();

  await chrome.storage.sync.set({ apiBase, userId });

  if (userId) {
    setStatus("User ID saved.");
  }
});

function clearAdFields() {
  pageNameInput.value = "";
  adTextInput.value = "";
  landingPageUrlInput.value = "";
  mediaUrlInput.value = "";
  tagsInput.value = "";
  notesInput.value = "";
  setStatus("Ad fields cleared. User ID stayed connected.");
}

function setActiveTool(tool) {
  const isAds = tool === "ads";
  adsTab.classList.toggle("active", isAds);
  competitorsTab.classList.toggle("active", !isAds);
  adsTab.setAttribute("aria-pressed", String(isAds));
  competitorsTab.setAttribute("aria-pressed", String(!isAds));
  adsPanel.hidden = !isAds;
  competitorsPanel.hidden = isAds;
  if (!isAds) fillCompetitorFromPage();
}

function setPickMode(active) {
  isPickMode = active;
  pickBtn.classList.toggle("active", active);
  pickBtn.setAttribute("aria-pressed", active ? "true" : "false");
  pickBtn.textContent = active
    ? "Picking... click again to cancel"
    : "Pick ad from page";
}

function applyPickedContext(context) {
  if (!context) return;

  if (context.detectedText) {
    adTextInput.value = context.detectedText;
  }
  if (!pageNameInput.value && context.title) {
    pageNameInput.value = context.title;
  }
  if (!landingPageUrlInput.value && context.landingPageUrl) {
    landingPageUrlInput.value = context.landingPageUrl;
  }
  if (!mediaUrlInput.value && context.mediaUrl) {
    mediaUrlInput.value = context.mediaUrl;
  }
}

async function sendPagePickMessage(type) {
  const tab = await getActiveTab();
  if (!tab?.id) {
    throw new Error("Open a normal page first.");
  }

  try {
    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ["content.js"],
    });
  } catch {
    // The content script may already be injected.
  }

  return new Promise((resolve, reject) => {
    chrome.tabs.sendMessage(tab.id, { type }, (response) => {
      if (chrome.runtime.lastError) {
        reject(new Error(chrome.runtime.lastError.message || "Could not talk to the page."));
        return;
      }
      resolve(response || {});
    });
  });
}

async function togglePickFromPage() {
  try {
    if (isPickMode) {
      await sendPagePickMessage("SPYSAVE_STOP_PAGE_PICK");
      setPickMode(false);
      setStatus("Pick mode cancelled.");
      return;
    }

    const response = await sendPagePickMessage("SPYSAVE_START_PAGE_PICK");
    setPickMode(Boolean(response.active));
    setStatus("Pick mode active. Click the ad card/text in the page.");
  } catch (error) {
    setPickMode(false);
    setStatus(
      error instanceof Error
        ? error.message
        : "Could not start pick mode.",
      true,
    );
  }
}

async function fillFromPage() {
  const tab = await getActiveTab();
  if (!tab?.id) return;

  setStatus("Detecting ad info...");

  try {
    const [injected] = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: readPageContext,
    });
    const response = injected?.result;

    if (response?.detectedText) {
      adTextInput.value = response.detectedText;
    }

    if (!pageNameInput.value && response?.title) {
      pageNameInput.value = response.title;
    }

    if (!landingPageUrlInput.value && response?.landingPageUrl) {
      landingPageUrlInput.value = response.landingPageUrl;
    }

    if (!mediaUrlInput.value && response?.mediaUrl) {
      mediaUrlInput.value = response.mediaUrl;
    }

    setStatus(
      response?.detectedText
        ? "Ad info detected. Review before saving."
        : "No ad text found. Select text or paste it.",
      !response?.detectedText,
    );
  } catch {
    chrome.tabs.sendMessage(
      tab.id,
      { type: "SPYSAVE_GET_PAGE_CONTEXT" },
      (response) => {
        if (chrome.runtime.lastError || !response) {
          setStatus("Open a normal web page, select ad text, then try again.", true);
          return;
        }

        if (response.detectedText) {
          adTextInput.value = response.detectedText;
        }

        if (!pageNameInput.value && response.title) {
          pageNameInput.value = response.title;
        }

        if (!landingPageUrlInput.value && response.landingPageUrl) {
          landingPageUrlInput.value = response.landingPageUrl;
        }

        if (!mediaUrlInput.value && response.mediaUrl) {
          mediaUrlInput.value = response.mediaUrl;
        }

        setStatus(response.detectedText ? "Ad info detected. Review before saving." : "No ad text found. Select text or paste it.", !response.detectedText);
      },
    );
  }
}

async function fillCompetitorFromPage() {
  const tab = await getActiveTab();
  if (!tab) return;

  if (!competitorUrlInput.value) competitorUrlInput.value = tab.url || "";
  if (competitorNameInput.value) return;

  try {
    const [injected] = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: () => document.title,
    });
    competitorNameInput.value = (injected?.result || "Competitor page")
      .replace(/\| Facebook.*$/i, "")
      .replace(/- Meta.*$/i, "")
      .replace(/\| TikTok.*$/i, "")
      .trim();
  } catch {
    competitorNameInput.value = "Competitor page";
  }
}

async function saveAd() {
  const apiBase = apiBaseInput.value.replace(/\/$/, "");
  const userId = userIdInput.value.trim();
  const tab = await getActiveTab();

  await chrome.storage.sync.set({ apiBase, userId });

  const payload = {
    userId,
    pageName: pageNameInput.value.trim(),
    adText: adTextInput.value.trim(),
    mediaUrl: mediaUrlInput.value.trim(),
    sourceUrl: tab?.url || "",
    landingPageUrl: landingPageUrlInput.value.trim(),
    tags: tagsInput.value.trim(),
    notes: notesInput.value.trim(),
    platform: tab?.url?.includes("tiktok.com") ? "TikTok" : "Meta",
  };

  if (!payload.userId) {
    setStatus("Paste your User ID from the SpySave dashboard first.", true);
    return;
  }

  if (!payload.adText) {
    setStatus("Select or paste ad text first.", true);
    return;
  }

  saveBtn.disabled = true;
  setStatus("Saving...");

  try {
    const response = await fetch(`${apiBase}/api/ads`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      throw new Error(data.error || "Save failed");
    }

    const data = await response.json().catch(() => ({}));
    setStatus(`Saved to user: ${data.userId || payload.userId}. Open Saved Ads page.`);
  } catch (error) {
    setStatus(
      error instanceof Error
        ? error.message
        : "Could not save. Check API base and dev server.",
      true,
    );
  } finally {
    saveBtn.disabled = false;
  }
}

async function saveCompetitor() {
  const apiBase = apiBaseInput.value.trim().replace(/\/$/, "");
  const userId = userIdInput.value.trim();
  const payload = {
    userId,
    name: competitorNameInput.value.trim(),
    libraryUrl: competitorUrlInput.value.trim(),
    niche: competitorNicheInput.value.trim(),
    notes: competitorNotesInput.value.trim(),
  };

  if (!payload.userId) {
    setStatus("Paste your User ID from the SpySave dashboard first.", true);
    return;
  }
  if (!payload.name) {
    setStatus("Add competitor name first.", true);
    return;
  }

  saveCompetitorBtn.disabled = true;
  setStatus("Saving competitor...");
  try {
    const response = await fetch(`${apiBase}/api/competitors`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.error || "Competitor save failed");
    setStatus(`Competitor saved: ${data.competitor?.name || payload.name}.`);
  } catch (error) {
    setStatus(error instanceof Error ? error.message : "Could not save competitor.", true);
  } finally {
    saveCompetitorBtn.disabled = false;
  }
}

loadSavedSettings().then(fillFromPage);
apiBaseInput.addEventListener("input", saveSettings);
userIdInput.addEventListener("input", saveSettings);
detectBtn.addEventListener("click", fillFromPage);
detectCompetitorBtn.addEventListener("click", fillCompetitorFromPage);
clearBtn.addEventListener("click", clearAdFields);
pickBtn.addEventListener("click", togglePickFromPage);
saveBtn.addEventListener("click", saveAd);
saveCompetitorBtn.addEventListener("click", saveCompetitor);
adsTab.addEventListener("click", () => setActiveTool("ads"));
competitorsTab.addEventListener("click", () => setActiveTool("competitors"));

chrome.runtime.onMessage.addListener((message) => {
  if (message.type !== "SPYSAVE_PAGE_PICK_RESULT") return;

  applyPickedContext(message.context);
  setPickMode(false);
  setStatus(
    message.context?.detectedText
      ? "Picked ad info from the page. Review before saving."
      : "Could not read that area. Try another part of the ad.",
    !message.context?.detectedText,
  );
});

