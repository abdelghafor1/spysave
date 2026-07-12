const DEFAULT_API_BASE = "https://spysave.vercel.app";

function isBlockedPage(url = "") {
  return /^chrome:|^edge:|^about:/i.test(url);
}

function sendPanelToggle(tabId, forceOpen = false) {
  return new Promise((resolve) => {
    chrome.tabs.sendMessage(
      tabId,
      { type: "SPYSAVE_TOGGLE_PANEL", forceOpen },
      (response) => {
        if (chrome.runtime.lastError) {
          resolve({
            ok: false,
            message: chrome.runtime.lastError.message || "Panel message failed.",
          });
          return;
        }

        resolve(response || { ok: true });
      },
    );
  });
}

chrome.action.onClicked.addListener(async (tab) => {
  if (!tab.id || !tab.url || isBlockedPage(tab.url)) {
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

  await sendPanelToggle(tab.id);
});

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.type === "SPYSAVE_OPEN_POPUP") {
    chrome.tabs.query({ active: true, currentWindow: true }, async ([tab]) => {
      if (!tab?.id || !tab.url || isBlockedPage(tab.url)) {
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

      const panelResult = await sendPanelToggle(tab.id, Boolean(message.forceOpen));
      if (!panelResult.ok) {
        if (chrome.action.openPopup) {
          try {
            await chrome.action.openPopup();
          } catch {
            // Some Chrome versions only allow this from specific gestures.
          }
        }
        sendResponse({
          ok: false,
          message: "User ID saved. If the panel did not appear, reload SpySave in chrome://extensions then click the extension icon once.",
        });
        return;
      }

      sendResponse({
        ok: true,
        message: "SpySave extension opened on your screen.",
      });
    });

    return true;
  }

  if (message.type === "SPYSAVE_SAVE_COMPETITOR") {
    (async () => {
      const apiBase = (message.apiBase || DEFAULT_API_BASE).replace(/\/$/, "");
      const response = await fetch(`${apiBase}/api/competitors`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(message.payload),
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.error || "Competitor save failed");
      }

      return data;
    })()
      .then((data) => sendResponse({ ok: true, data }))
      .catch((error) =>
        sendResponse({
          ok: false,
          error:
            error instanceof Error ? error.message : "Competitor save failed",
        }),
      );

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

