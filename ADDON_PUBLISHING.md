# SpySave Browser Add-on Publishing

SpySave keeps Chrome as the main source extension, then builds separate store-ready packages for Edge and Firefox.

## Build packages

```powershell
npm.cmd run extension:zip
```

The zip files are created in:

```txt
dist/extensions/
```

Packages:

- `spysave-chrome-0.3.2.zip` for Chrome Web Store.
- `spysave-edge-0.3.2.zip` for Microsoft Edge Add-ons.
- `spysave-firefox-0.3.2.zip` for Firefox Add-ons.

## Chrome

- Uses `extension/manifest.json`.
- Uses Chrome Side Panel.
- Publish in Chrome Web Store.
- Chrome requires a one-time developer fee.

## Microsoft Edge

- Uses `extension/manifest.edge.json`.
- Edge is Chromium-based, so this package keeps the same Side Panel flow.
- Publish in Microsoft Edge Add-ons.
- Publishing is free with a Microsoft account.

## Firefox

- Uses `extension/manifest.firefox.json`.
- Firefox package opens as a normal extension popup instead of Chrome Side Panel.
- Publish in Firefox Add-ons / AMO.
- Publishing is free with a Mozilla developer account.

## Before Uploading

1. Test login on `https://spysave.vercel.app/`.
2. Save one Meta Ad Library ad.
3. Save one TikTok Creative Center ad.
4. Check the ad appears in Saved Ads.
5. Click AI Analyze manually from the site.
6. Confirm the extension permissions shown by the store match only these needs:
   - active tab
   - scripting
   - storage
   - Meta/Facebook/TikTok/SpySave site access

## Store Description

SpySave helps dropshippers and small e-commerce teams save competitor ads from Meta, Facebook, and TikTok Creative Center into a clean swipe file, then review hooks, offers, winning score, fatigue risk, and rewrite ideas with AI.
