window.addEventListener("message", (event) => {
  if (event.source !== window || event.data?.type !== "SPYSAVE_CONNECT_EXTENSION") {
    return;
  }

  const apiBase = String(event.data.apiBase || "").replace(/\/$/, "");
  const userId = String(event.data.userId || "").trim();

  if (!apiBase || !userId) {
    window.postMessage(
      {
        type: "SPYSAVE_EXTENSION_CONNECTED",
        ok: false,
        message: "Missing API base or User ID.",
      },
      event.origin,
    );
    return;
  }

  chrome.storage.sync.set({ apiBase, userId }, () => {
    chrome.runtime.sendMessage({ type: "SPYSAVE_OPEN_POPUP" }, (response) => {
      const browserError = chrome.runtime.lastError?.message;
      window.postMessage(
        {
          type: "SPYSAVE_EXTENSION_CONNECTED",
          ok: !browserError && response?.ok !== false,
          message:
            response?.message ||
            browserError ||
            "SpySave extension connected.",
        },
        event.origin,
      );
    });
  });
});
