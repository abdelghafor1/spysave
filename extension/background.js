const DEFAULT_API_BASE = "https://YOUR-SPYSAVE-VERCEL-URL.vercel.app";

chrome.action.onClicked.addListener(async (tab) => {
  if (!tab.id || !tab.url || /^chrome:|^edge:|^about:/i.test(tab.url)) {
    return;
  }

  try {
    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ["content.js"],
    });
  } catch {
    // The content script may already be injected on supported pages.
  }

  chrome.tabs.sendMessage(tab.id, { type: "SPYSAVE_TOGGLE_PANEL" });
});

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.type === "SPYSAVE_OPEN_POPUP") {
    chrome.tabs.query({ active: true, currentWindow: true }, async ([tab]) => {
      if (!tab?.id || !tab.url || /^chrome:|^edge:|^about:/i.test(tab.url)) {
        sendResponse({
          ok: false,
          message: "User ID saved. Click the SpySave extension icon on a normal page.",
        });
        return;
      }

      try {
        await chrome.scripting.executeScript({
          target: { tabId: tab.id },
          files: ["content.js"],
        });
      } catch {
        // The content script may already be available on this page.
      }

      chrome.tabs.sendMessage(tab.id, { type: "SPYSAVE_TOGGLE_PANEL" }, () => {
        if (chrome.runtime.lastError) {
          sendResponse({
            ok: false,
            message: "User ID saved. Click the SpySave extension icon once.",
          });
          return;
        }

        sendResponse({
          ok: true,
          message: "SpySave extension opened and connected.",
        });
      });
    });

    return true;
  }

  if (message.type !== "SPYSAVE_SAVE_AD") {
    return;
  }

  (async () => {
    const apiBase = (message.apiBase || DEFAULT_API_BASE).replace(/\/$/, "");
    const response = await fetch(`${apiBase}/api/ads`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(message.payload),
    });
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(data.error || "Save failed");
    }

    return data;
  })()
    .then((data) => sendResponse({ ok: true, data }))
    .catch((error) =>
      sendResponse({
        ok: false,
        error: error instanceof Error ? error.message : "Save failed",
      }),
    );

  return true;
});
