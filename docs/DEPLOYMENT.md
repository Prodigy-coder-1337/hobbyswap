# Deployment Instructions

## Local Development

```bash
npm install
npm run dev
```

## Production Build

```bash
npm run build
```

The production output is emitted into `dist/`.

## Vercel Deployment

1. Push this repo to GitHub.
2. Create a new Vercel project from the repo.
3. Use the default Vite framework detection.
4. Confirm:
   - Build Command: `npm run build`
   - Output Directory: `dist`
5. Deploy.

## Post-Deploy Checks

- Load landing page on a mobile viewport.
- Confirm sign-up, onboarding, and guided walkthrough.
- Log in with the demo account.
- Open the Discover map.
- Create a listing in the marketplace.
- Create a contract and send a consent-first chat.
- Export a PDF from the swap log.
- Open settings and verify data export works.

## PWA Notes

- `public/manifest.json` provides install metadata.
- `public/sw.js` provides basic asset caching.
- On supported mobile browsers, the app can be installed to the home screen.
