# SpySave Chrome Web Store Checklist

## Listing

- Name: SpySave
- Short description: Save Meta ads to your SpySave dashboard and analyze hooks, offers, CTAs, and winning scores.
- Category: Productivity or Marketing
- Language: English

## Permissions Explanation

- `activeTab`: lets the user open SpySave on the current Meta/Facebook ad page after clicking the extension icon.
- `scripting`: injects the persistent SpySave save panel only after the user clicks the extension.
- `storage`: remembers API base and User ID locally in Chrome.
- Host permissions: Facebook/Meta Ad Library, TikTok Creative Center, and the deployed SpySave Vercel dashboard for connecting the user account.

## Assets Needed

- 128x128 icon: `extension/icons/icon-128.png`
- 48x48 icon: `extension/icons/icon-48.png`
- Screenshots: dashboard, extension side panel, saved ad detail
- Privacy policy URL: `/privacy`

## Test Before Upload

- Login/register on SpySave.
- Click Open extension from first-login helper.
- Confirm User ID is saved in extension.
- Open Meta Ad Library.
- Click SpySave icon.
- Run Auto detect ad.
- Save ad.
- Confirm ad appears in dashboard.
- Delete ad from dashboard.

## Before Final ZIP

- Confirm `https://spysave.vercel.app` is the production API base.
- Bump `extension/manifest.json` version after every release.
- Rebuild `public/spysave-extension.zip`.
- Test the extension from a clean Chrome profile.

