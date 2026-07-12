/* eslint-disable @typescript-eslint/no-unused-vars */
(() => {
  if (window.__SPYSAVE_CONTENT_READY__) return;
  window.__SPYSAVE_CONTENT_READY__ = true;

  const PANEL_ID = "spysave-floating-panel";
  const DEFAULT_API_BASE = "https://YOUR-SPYSAVE-VERCEL-URL.vercel.app";

  function normalizeText(text) {
    return (text || "")
      .replace(/\s+\n/g, "\n")
      .replace(/\n{3,}/g, "\n\n")
      .replace(/[ \t]{2,}/g, " ")
      .trim();
  }

  function cleanAdText(text) {
    return normalizeText(text)
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .filter((line) => !/^actif$/i.test(line))
      .filter((line) => !/^sponsoris[ée]$/i.test(line))
      .filter((line) => !/^id dans la biblioth[eè]que/i.test(line))
      .filter((line) => !/^d[ée]but de diffusion/i.test(line))
      .filter((line) => !/^plateformes$/i.test(line))
      .filter((line) => !/^d[ée]tails de la publicit[ée]$/i.test(line))
      .join("\n")
      .trim();
  }

  function scoreText(text) {
    const clean = cleanAdText(text);
    if (clean.length < 30 || clean.length > 2400) return -1;

    let score = Math.min(clean.length, 900);
    if (/sponsoris[ée]|shop|whatsapp|wa\.me|http|%|off|free|عرض|تخفيض/i.test(clean)) {
      score += 400;
    }
    if (/id dans la biblioth[eè]que|d[ée]but de diffusion|plateformes/i.test(text)) {
      score += 120;
    }
    if (/comment|share|like|privacy|cookies/i.test(clean)) {
      score -= 500;
    }

    return score;
  }

  function cleanDetectedText(text) {
    const seen = new Set();

    return normalizeText(text)
      .split("\n")
      .map((line) => line.replace(/\s+/g, " ").trim())
      .filter(Boolean)
      .filter((line) => {
        const key = line.toLowerCase();
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      })
      .filter((line) => !/^actif$/i.test(line))
      .filter((line) => !/^sponsoris/i.test(line))
      .filter((line) => !/^id dans la biblioth/i.test(line))
      .filter((line) => !/^d.but de diffusion/i.test(line))
      .filter((line) => !/^plateformes$/i.test(line))
      .filter((line) => !/^d.tails de la publicit/i.test(line))
      .filter((line) => !/^biblioth.que publicitaire/i.test(line))
      .filter((line) => !/^meta ad library/i.test(line))
      .filter((line) => !/^tiktok creative center/i.test(line))
      .filter((line) => !/^explore top ads/i.test(line))
      .filter((line) => !/^top ads dashboard/i.test(line))
      .filter((line) => !/^top ads spotlight/i.test(line))
      .filter((line) => !/^inspiration$/i.test(line))
      .filter((line) => !(/^trends$/i.test(line) || /^creative tools$/i.test(line)))
      .filter((line) => !(/^log in$/i.test(line) || /^sign up$/i.test(line)))
      .filter((line) => !(/^search$/i.test(line) || /^english$/i.test(line)))
      .filter((line) => !(/^voir plus$/i.test(line) || /^see more$/i.test(line)))
      .filter((line) => !(/^fermer$/i.test(line) || /^close$/i.test(line)))
      .filter((line) => !(/^a propos/i.test(line) || /^about this ad/i.test(line)))
      .filter((line) => !(/^afficher/i.test(line) || /^show/i.test(line)))
      .filter((line) => !/^tous$/i.test(line))
      .filter((line) => line.length <= 900)
      .join("\n")
      .trim();
  }

  function scoreCandidateText(text) {
    const clean = cleanDetectedText(text);
    if (clean.length < 30 || clean.length > 2400) return -1;

    let score = Math.min(clean.length, 900);
    if (/sponsoris|shop|whatsapp|wa\.me|http|%|off|free|order|buy|sale|discount|tiktok|top ads|creative center/i.test(clean)) {
      score += 400;
    }
    if (/id dans la biblioth|d.but de diffusion|plateformes/i.test(text)) {
      score += 120;
    }
    if (/a propos|biblioth.que publicitaire|d.tails de la publicit|fermer|log in|sign up|creative tools|trends/i.test(clean)) {
      score -= 300;
    }
    if (/comment|share|like|privacy|cookies/i.test(clean)) {
      score -= 500;
    }

    return score;
  }

  function getPageTitle() {
    const metaTitle = document.querySelector("meta[property='og:title']")?.content;
    return (metaTitle || document.title || "")
      .replace(/\| Facebook.*$/i, "")
      .replace(/- Meta.*$/i, "")
      .replace(/^Biblioth[eè]que publicitaire.*$/i, "Bibliotheque publicitaire")
      .trim();
  }

  function getElementMediaUrl(element) {
    return (
      Array.from(element.querySelectorAll("video[src], img[src]"))
        .map((item) => item.currentSrc || item.src)
        .filter(Boolean)
        .find((src) => /^https?:\/\//i.test(src)) || ""
    );
  }

  function getElementLandingUrl(element) {
    return (
      Array.from(element.querySelectorAll("a[href]"))
        .map((link) => link.href)
        .filter(Boolean)
        .find((href) => {
          try {
            const url = new URL(href);
            return !url.hostname.includes("facebook.com") && !url.hostname.includes("meta.com");
          } catch {
            return false;
          }
        }) || ""
    );
  }

  function guessPageName(text, fallbackTitle) {
    return (
      cleanAdText(text)
        .split("\n")
        .map((line) => line.trim())
        .find((line) => {
          return (
            line.length >= 2 &&
            line.length <= 70 &&
            !/^https?:\/\//i.test(line) &&
            !/id dans|d[ée]but|plateformes|sponsoris|actif/i.test(line)
          );
        }) ||
      fallbackTitle ||
      ""
    );
  }

  function getSmartMediaUrl(element) {
    return (
      Array.from(element.querySelectorAll("video[src], img[src]"))
        .map((item) => ({
          src: item.currentSrc || item.src,
          area:
            (item.naturalWidth || item.clientWidth || 0) *
            (item.naturalHeight || item.clientHeight || 0),
        }))
        .filter((item) => item.src && /^https?:\/\//i.test(item.src))
        .filter((item) => !/emoji|static|rsrc|sprite|profile|safe_image/i.test(item.src))
        .sort((a, b) => b.area - a.area)
        .map((item) => item.src)[0] || ""
    );
  }

  function normalizeExternalUrl(href) {
    try {
      const url = new URL(href);
      const redirected = url.searchParams.get("u") || url.searchParams.get("url");
      if (redirected) return decodeURIComponent(redirected);
      return url.href;
    } catch {
      return "";
    }
  }

  function getSmartLandingUrl(element) {
    return (
      Array.from(element.querySelectorAll("a[href]"))
        .map((link) => normalizeExternalUrl(link.href))
        .filter(Boolean)
        .find((href) => {
          try {
            const url = new URL(href);
            return (
              !url.hostname.includes("facebook.com") &&
              !url.hostname.includes("meta.com") &&
              !url.hostname.includes("fbcdn.net") &&
              !url.hostname.includes("tiktok.com")
            );
          } catch {
            return false;
          }
        }) || ""
    );
  }

  function guessSmartPageName(text, fallbackTitle) {
    const lines = normalizeText(text)
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);
    const sponsoredIndex = lines.findIndex((line) => /^sponsoris/i.test(line));
    if (sponsoredIndex > 0) {
      const beforeSponsored = lines[sponsoredIndex - 1];
      if (beforeSponsored && beforeSponsored.length <= 70) {
        return beforeSponsored;
      }
    }

    return (
      cleanDetectedText(text)
        .split("\n")
        .map((line) => line.trim())
        .find((line) => {
          return (
            line.length >= 2 &&
            line.length <= 70 &&
            !/^https?:\/\//i.test(line) &&
            !/id dans|d.but|plateformes|sponsoris|actif|biblioth.que/i.test(line)
          );
        }) ||
      fallbackTitle ||
      ""
    );
  }

  function contextFromElement(element) {
    const candidates = [];
    let current = element;

    for (let depth = 0; current && depth < 8; depth += 1) {
      const text = current.innerText || "";
      candidates.push({ element: current, text, score: scoreCandidateText(text) });
      current = current.parentElement;
    }

    const best =
      candidates
        .filter((candidate) => candidate.score >= 0)
        .sort((a, b) => b.score - a.score)[0] || candidates[0];
    const text = best?.text || "";

    return {
      selectedText: window.getSelection()?.toString().trim() || "",
      detectedText: cleanDetectedText(text),
      title: guessSmartPageName(text, getPageTitle()),
      landingPageUrl: getSmartLandingUrl(best?.element || element),
      mediaUrl: getSmartMediaUrl(best?.element || element),
      url: window.location.href,
    };
  }

  function readPageContext() {
    const selectedText = window.getSelection()?.toString().trim() || "";
    const pageCandidates = Array.from(
      document.querySelectorAll("article, [role='article'], [data-ad-preview], [aria-label], div"),
    )
      .map((element) => ({
        element,
        text: element.innerText || "",
        score: scoreCandidateText(element.innerText || ""),
      }))
      .filter((candidate) => candidate.score >= 0)
      .sort((a, b) => b.score - a.score);

    const best = pageCandidates[0];
    const bestText = best?.text || "";

    return {
      selectedText,
      detectedText: selectedText || cleanDetectedText(bestText) || "",
      title: guessSmartPageName(bestText, getPageTitle()),
      landingPageUrl: getSmartLandingUrl(best?.element || document.body),
      mediaUrl: getSmartMediaUrl(best?.element || document.body),
      url: window.location.href,
    };
  }

  function setStatus(root, message, isError = false) {
    const status = root.querySelector("[data-spysave-status]");
    status.textContent = message;
    status.style.color = isError ? "#b42318" : "#2f8a61";
  }

  function setConnectionStatus(root, connected, message) {
    const item = root.querySelector("[data-spysave-connection]");
    item.textContent = message || (connected ? "Connected" : "Not connected");
    item.style.background = connected ? "#e8fff6" : "#fff4ed";
    item.style.color = connected ? "#08775d" : "#b54708";
    item.style.borderColor = connected ? "#a7f3d0" : "#fed7aa";
  }

  function getField(root, name) {
    return root.querySelector(`[data-spysave-field="${name}"]`);
  }

  function debounce(callback, delay = 250) {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => callback(...args), delay);
    };
  }

  async function loadSettings(root) {
    const data = await chrome.storage.sync.get(["apiBase", "userId"]);
    getField(root, "apiBase").value = data.apiBase || DEFAULT_API_BASE;
    getField(root, "userId").value = data.userId || "";
    setConnectionStatus(
      root,
      Boolean(data.userId),
      data.userId ? "Connected to dashboard" : "Paste User ID to connect",
    );
  }

  function fillFields(root, context, overwriteText = true) {
    if (overwriteText && context.detectedText) {
      getField(root, "adText").value = context.detectedText;
    }
    if (context.title) {
      getField(root, "pageName").value = context.title;
    }
    if (context.landingPageUrl) {
      getField(root, "landingPageUrl").value = context.landingPageUrl;
    }
    if (context.mediaUrl) {
      getField(root, "mediaUrl").value = context.mediaUrl;
    }
  }

  function fillDetectedFields(root) {
    const context = readPageContext();
    fillFields(root, context, true);
    setStatus(
      root,
      context.detectedText
        ? "Ad info detected. Review before saving."
        : "No ad text found. Click Pick ad from page.",
      !context.detectedText,
    );
  }

  function clearAdFields(root) {
    ["pageName", "adText", "landingPageUrl", "mediaUrl", "tags", "notes"].forEach(
      (name) => {
        getField(root, name).value = "";
      },
    );
    setStatus(root, "Ad fields cleared. User ID stayed connected.");
  }

  function pickFromPage(root, host) {
    setStatus(root, "Click directly on the ad card/text in the page.");

    const onClick = (event) => {
      if (event.composedPath().includes(host)) return;
      event.preventDefault();
      event.stopPropagation();

      const context = contextFromElement(event.target);
      fillFields(root, context, true);
      setStatus(
        root,
        context.detectedText
          ? "Picked ad info from the page. Review before saving."
          : "Could not read that area. Try clicking the ad text itself.",
        !context.detectedText,
      );

      document.removeEventListener("click", onClick, true);
      document.documentElement.style.cursor = "";
    };

    document.documentElement.style.cursor = "crosshair";
    document.addEventListener("click", onClick, true);
  }

  function saveViaBackground(apiBase, payload) {
    return new Promise((resolve, reject) => {
      chrome.runtime.sendMessage(
        {
          type: "SPYSAVE_SAVE_AD",
          apiBase,
          payload,
        },
        (result) => {
          if (chrome.runtime.lastError) {
            reject(new Error(chrome.runtime.lastError.message || "Extension background did not answer."));
            return;
          }

          if (!result?.ok) {
            reject(new Error(result?.error || "Save failed."));
            return;
          }

          resolve(result.data || {});
        },
      );
    });
  }

  async function saveDirectly(apiBase, payload) {
    const response = await fetch(`${apiBase}/api/ads`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(data.error || "Save failed.");
    }

    return data;
  }

  async function saveAd(root) {
    const apiBase = getField(root, "apiBase").value.trim().replace(/\/$/, "");
    const userId = getField(root, "userId").value.trim();
    await chrome.storage.sync.set({ apiBase, userId });

    const payload = {
      userId,
      pageName: getField(root, "pageName").value.trim(),
      adText: getField(root, "adText").value.trim(),
      mediaUrl: getField(root, "mediaUrl").value.trim(),
      sourceUrl: window.location.href,
      landingPageUrl: getField(root, "landingPageUrl").value.trim(),
      tags: getField(root, "tags").value.trim(),
      notes: getField(root, "notes").value.trim(),
      platform: window.location.hostname.includes("tiktok.com") ? "TikTok" : "Meta",
    };

    if (!payload.userId) {
      setStatus(root, "Paste your User ID from the SpySave dashboard first.", true);
      return;
    }
    if (!payload.adText) {
      setStatus(root, "Select or paste ad text first.", true);
      return;
    }

    const saveButton = root.querySelector("[data-spysave-save]");
    saveButton.disabled = true;
    setStatus(root, "Saving ad...");

    try {
      let data;
      try {
        data = await saveViaBackground(apiBase, payload);
      } catch {
        data = await saveDirectly(apiBase, payload);
      }

      setConnectionStatus(root, true, "Saved successfully");
      setStatus(root, `Saved to user: ${data.userId || payload.userId}. Open Saved Ads page.`);
    } catch (error) {
      setConnectionStatus(root, false, "Save failed");
      setStatus(
        root,
        error instanceof Error
          ? error.message
          : "Could not save. Check API base and dev server.",
        true,
      );
    } finally {
      saveButton.disabled = false;
    }
  }

  function createPanel() {
    const existing = document.getElementById(PANEL_ID);
    if (existing) {
      existing.remove();
      return;
    }

    const host = document.createElement("div");
    host.id = PANEL_ID;
    host.style.cssText = [
      "position:fixed",
      "top:0",
      "right:0",
      "width:min(420px, calc(100vw - 24px))",
      "height:100vh",
      "z-index:2147483647",
      "box-shadow:-18px 0 40px rgba(24,23,19,.22)",
      "background:#f3fbf7",
    ].join(";");
    document.documentElement.appendChild(host);

    const root = host.attachShadow({ mode: "open" });
    root.innerHTML = `
      <style>
        * { box-sizing: border-box; }
        :host { all: initial; }
        .panel {
          height: 100vh;
          overflow-y: auto;
          background: #f3fbf7;
          color: #13231f;
          font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
          padding: 16px;
        }
        header { display: flex; align-items: center; justify-content: space-between; gap: 12px; margin-bottom: 16px; }
        .brand { display: flex; align-items: center; gap: 10px; }
        .logo { display: grid; width: 38px; height: 38px; place-items: center; border-radius: 10px; background: #101413; box-shadow: 0 8px 18px rgba(16,20,19,.16); overflow: hidden; }
        h1, p { margin: 0; }
        h1 { font-size: 18px; line-height: 1.1; }
        p { color: #6f6a60; font-size: 12px; line-height: 1.5; }
        label { display: grid; gap: 6px; margin-top: 12px; color: #4f635d; font-size: 12px; font-weight: 800; }
        input, textarea { width: 100%; border: 1px solid #d8e8e1; border-radius: 8px; background: #fff; color: #13231f; font: inherit; font-size: 13px; outline: none; padding: 10px; }
        textarea { min-height: 112px; resize: vertical; }
        textarea.short { min-height: 64px; }
        button { height: 42px; border: 0; border-radius: 8px; cursor: pointer; font: inherit; font-weight: 900; }
        button:disabled { cursor: wait; opacity: .65; }
        .close { display: grid; width: 38px; place-items: center; border: 1px solid #d8e8e1; background: #fff; color: #13231f; font-size: 20px; }
        .connection { display: inline-flex; align-items: center; min-height: 28px; border: 1px solid #fed7aa; border-radius: 999px; padding: 4px 10px; font-size: 12px; font-weight: 900; }
        .secondary { width: 100%; margin-top: 12px; border: 1px solid #13b98f; background: #fff; color: #08775d; }
        .danger { width: 100%; margin-top: 8px; border: 1px solid #f2c4bc; background: #fff; color: #b42318; }
        .pick { width: 100%; margin-top: 8px; border: 1px solid #ff7a59; background: #fff7f2; color: #a84227; }
        .primary { width: 100%; margin-top: 14px; background: linear-gradient(135deg, #13b98f, #dff77a, #ff7a59); color: #13231f; }
        .hint { margin-top: 6px; }
        .status { min-height: 20px; margin-top: 10px; font-weight: 800; }
      </style>
      <main class="panel">
        <header>
          <div class="brand">
            <div class="logo">
              <svg width="38" height="38" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="512" height="512" rx="116" fill="#101413"/>
                <path d="M92 331V171C92 137.863 118.863 111 152 111H360C393.137 111 420 137.863 420 171V331C420 364.137 393.137 391 360 391H152C118.863 391 92 364.137 92 331Z" fill="url(#panel)"/>
                <path d="M150 258C179.2 208.4 214.533 183.6 256 183.6C297.467 183.6 332.8 208.4 362 258C332.8 307.6 297.467 332.4 256 332.4C214.533 332.4 179.2 307.6 150 258Z" fill="#F8FFF9"/>
                <circle cx="256" cy="258" r="47" fill="#101413"/>
                <circle cx="271" cy="241" r="14" fill="#DFFF7A"/>
                <path d="M337 136V224L310 205L283 224V136H337Z" fill="#101413"/>
                <path d="M165 371L165 303C165 291.954 173.954 283 185 283H229C240.046 283 249 291.954 249 303V371L207 343L165 371Z" fill="#FF7A59"/>
                <path d="M145 152H253" stroke="#101413" stroke-width="22" stroke-linecap="round"/>
                <path d="M145 190H213" stroke="#101413" stroke-width="22" stroke-linecap="round"/>
                <defs><linearGradient id="panel" x1="92" y1="111" x2="421.194" y2="389.589" gradientUnits="userSpaceOnUse"><stop stop-color="#13B98F"/><stop offset="0.53" stop-color="#DFFF7A"/><stop offset="1" stop-color="#FF7A59"/></linearGradient></defs>
              </svg>
            </div>
            <div>
              <h1>SpySave</h1>
              <p>Persistent ad saver</p>
            </div>
          </div>
          <button class="close" data-spysave-close title="Close">x</button>
        </header>

        <label>API base<input data-spysave-field="apiBase" placeholder="https://your-site.vercel.app" /></label>
        <label>User ID<input data-spysave-field="userId" autocomplete="off" placeholder="Paste User ID from dashboard" /></label>
        <p class="hint">Paste it once. SpySave will remember it.</p>
        <p class="connection" data-spysave-connection>Checking connection...</p>

        <button class="secondary" data-spysave-detect>Auto detect ad</button>
        <button class="danger" data-spysave-clear>Clear ad fields</button>
        <button class="pick" data-spysave-pick>Pick ad from page</button>

        <label>Page name<input data-spysave-field="pageName" placeholder="Brand or competitor name" /></label>
        <label>Ad text<textarea data-spysave-field="adText" placeholder="Select or paste ad text"></textarea></label>
        <label>Landing page URL<input data-spysave-field="landingPageUrl" placeholder="https://store.com/product" /></label>
        <label>Media URL<input data-spysave-field="mediaUrl" placeholder="Detected image/video URL" /></label>
        <label>Tags<input data-spysave-field="tags" placeholder="skincare, ugc, winning idea" /></label>
        <label>Notes<textarea class="short" data-spysave-field="notes" placeholder="Why are you saving this ad?"></textarea></label>

        <button class="primary" data-spysave-save>Save ad</button>
        <p class="status" data-spysave-status></p>
      </main>
    `;

    root.querySelector("[data-spysave-close]").addEventListener("click", () => host.remove());
    root.querySelector("[data-spysave-detect]").addEventListener("click", () => fillDetectedFields(root));
    root.querySelector("[data-spysave-clear]").addEventListener("click", () => clearAdFields(root));
    root.querySelector("[data-spysave-pick]").addEventListener("click", () => pickFromPage(root, host));
    root.querySelector("[data-spysave-save]").addEventListener("click", () => saveAd(root));

    const saveSettings = debounce(async () => {
      const apiBase = getField(root, "apiBase").value.trim().replace(/\/$/, "");
      const userId = getField(root, "userId").value.trim();
      await chrome.storage.sync.set({ apiBase, userId });
      setConnectionStatus(
        root,
        Boolean(userId),
        userId ? "Connected to dashboard" : "Paste User ID to connect",
      );
      if (userId) setStatus(root, "User ID saved.");
    });
    getField(root, "apiBase").addEventListener("input", saveSettings);
    getField(root, "userId").addEventListener("input", saveSettings);

    loadSettings(root).then(() => fillDetectedFields(root));
  }

  chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
    if (message.type === "SPYSAVE_GET_PAGE_CONTEXT") {
      sendResponse(readPageContext());
      return;
    }

    if (message.type === "SPYSAVE_TOGGLE_PANEL") {
      createPanel();
      sendResponse({ ok: true });
    }
  });
})();
