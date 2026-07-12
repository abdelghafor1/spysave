# SpySave

SpySave is a 14-day MVP for saving, organizing, and analyzing Meta/Facebook ads for dropshippers and small e-commerce teams.

## What is included

- Next.js website with landing page, dashboard preview, pricing, roadmap, and English/Arabic/French language switcher.
- Firebase client setup for Auth, Firestore, and Storage.
- API route for saving ads and returning NVIDIA/OpenAI analysis when API keys are set.
- Chrome Manifest V3 extension that auto-detects selected ad text, page title, source URL, and a likely landing page link.
- Dashboard filters for All, Winners, Good, Weak, and Unscored ads.
- CSV export for filtered ads.
- Media URL capture and media links in the dashboard.
- Competitor Tracking Lite for saving competitor pages, filtering their ads, and comparing average/best winning scores.

## Run the website

```powershell
cd "D:\projet pff\spysave"
npm.cmd run dev
```

Open `http://localhost:3000`.

The real Firebase dashboard is at `http://localhost:3000/app`.

## Configure Firebase

1. Create a Firebase project.
2. Enable Authentication, Firestore, and Storage.
3. Copy `.env.example` to `.env.local`.
4. Paste your Firebase web app keys into `.env.local`.

For this project, the Firebase keys are already added to `.env.local`.

In Firebase Console, enable:

- Authentication > Sign-in method > Email/Password.
- Firestore Database > Create database.
- Storage > Get started.

For MVP testing, use these Firestore rules:

```txt
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    match /ads/{adId} {
      allow read, delete: if request.auth != null
        && request.auth.uid == resource.data.userId;
      allow create: if request.resource.data.userId is string
        && request.resource.data.userId.size() > 0;
      allow update: if request.auth != null
        && request.auth.uid == resource.data.userId
        && request.auth.uid == request.resource.data.userId;
    }

    match /competitors/{competitorId} {
      allow read, delete: if request.auth != null
        && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null
        && request.auth.uid == request.resource.data.userId;
      allow update: if request.auth != null
        && request.auth.uid == resource.data.userId
        && request.auth.uid == request.resource.data.userId;
    }
  }
}
```

These rules allow the Chrome extension MVP to create ads through the Next.js API with the copied User ID. Reads, edits, and deletes still require the signed-in owner.

If you want a faster temporary beta rule while testing:

```txt
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    match /ads/{adId} {
      allow read, write: if request.auth != null;
    }

    match /competitors/{competitorId} {
      allow read, write: if request.auth != null;
    }
  }
}
```

The Firebase helper files are:

- `src/lib/firebase.ts`
- `src/lib/ads.ts`

## Configure AI

The app works without paid AI using a local fallback analyzer. For stronger analysis, SpySave checks providers in this order:

1. NVIDIA NIM when `NVIDIA_API_KEY` is set.
2. OpenAI when `OPENAI_API_KEY` is set.
3. Local fallback analyzer.

To enable NVIDIA:

```env
NVIDIA_API_KEY=your-nvidia-api-key
NVIDIA_MODEL=meta/llama-3.1-8b-instruct
```

To enable OpenAI:


```env
OPENAI_API_KEY=sk-your-key
OPENAI_MODEL=gpt-4o-mini
```

Restart the dev server after changing `.env.local`.

## Test the Chrome extension

1. Start the website on `http://localhost:3000`.
2. Login at `http://localhost:3000/app`.
3. Copy the User ID from the Extension setup box.
4. Open Chrome and go to `chrome://extensions`.
5. Enable Developer mode.
6. Click Load unpacked.
7. Select the `extension` folder.
8. Open Meta Ad Library or Facebook.
9. Select ad text on the page, or open an ad detail page.
10. Click the SpySave extension. It opens a persistent sidebar inside the page.
11. Paste the User ID once.
12. Click Auto detect ad if fields are not filled.
13. Review the fields and press Save ad.
14. Close the sidebar with its `X` button when you are done.

## Next build steps

1. Replace copied User ID with a full extension auth flow.
2. Add plan limits: Free, Pro, and Agency.
3. Replace Competitor Tracking Lite with automatic competitor checks after the beta is stable.

## Delivery Docs

- See `DEPLOYMENT.md` for Vercel, extension beta, and security steps.
- See `LAUNCH_CHECKLIST.md` for the beta demo script and feedback questions.
