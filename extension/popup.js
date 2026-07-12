const apiBaseInput = document.getElementById("apiBase");
const userIdInput = document.getElementById("userId");
const pageNameInput = document.getElementById("pageName");
const adTextInput = document.getElementById("adText");
const landingPageUrlInput = document.getElementById("landingPageUrl");
const mediaUrlInput = document.getElementById("mediaUrl");
const tagsInput = document.getElementById("tags");
const notesInput = document.getElementById("notes");
const detectBtn = document.getElementById("detectBtn");
const clearBtn = document.getElementById("clearBtn");
const saveBtn = document.getElementById("saveBtn");
const statusEl = document.getElementById("status");
const DEFAULT_API_BASE = "https://YOUR-SPYSAVE-VERCEL-URL.vercel.app";

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

loadSavedSettings().then(fillFromPage);
apiBaseInput.addEventListener("input", saveSettings);
userIdInput.addEventListener("input", saveSettings);
detectBtn.addEventListener("click", fillFromPage);
clearBtn.addEventListener("click", clearAdFields);
saveBtn.addEventListener("click", saveAd);
