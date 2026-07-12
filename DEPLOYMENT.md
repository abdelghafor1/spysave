# SpySave Deployment Checklist

## Vercel

1. Push the project to GitHub.
2. Import the repo in Vercel.
3. Framework preset: **Next.js**.
4. Build command: `npm run build`.
5. Output directory: leave empty/default.
6. Set these environment variables in Vercel:
   - `NEXT_PUBLIC_FIREBASE_API_KEY`
   - `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
   - `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
   - `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
   - `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
   - `NEXT_PUBLIC_FIREBASE_APP_ID`
   - `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID`
   - `NVIDIA_API_KEY`
   - `NVIDIA_MODEL`
   - `OPENAI_API_KEY` only if needed
   - `OPENAI_MODEL`
7. Deploy.
8. Test `/`, `/app`, `/app/ads`, `/app/competitors`, `/help`, and `/privacy`.

## Firebase Production Setup

1. Firebase Console > Authentication > Settings > Authorized domains.
2. Add your Vercel domain, for example `spysave.vercel.app`.
3. Firebase Console > Firestore > Rules: publish the project rules from `firestore.rules`.
4. Test a new account on the deployed website.

## Chrome Extension Beta

1. Production API base is configured as `https://spysave.vercel.app` in:
   - `extension/background.js`
   - `extension/content.js`
   - `extension/popup.js`
2. Run `Compress-Archive -Path extension\* -DestinationPath public\spysave-extension.zip -Force` after every extension change.
3. Open `chrome://extensions`.
4. Reload the unpacked extension.
5. Login on the deployed website.
6. Click **Open extension** from the dashboard helper so the site stores the real API URL in Chrome.
7. Save one ad from Meta Ad Library or TikTok Creative Center.
8. Confirm it appears in the deployed dashboard.

## Security Before Launch

1. Rotate the NVIDIA key because the first key was shared during development.
2. Keep `.env.local` out of Git.
3. Use the strict Firestore rules from `firestore.rules`.
4. Add privacy policy and terms pages before publishing the extension publicly.
5. Review Chrome extension permissions before Chrome Web Store submission.

