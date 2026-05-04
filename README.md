# HobbySwap

HobbySwap is a production-ready mobile-first PWA for Metro Manila hobbyists who want to swap skills, share materials, join low-pressure local events, and build beginner-friendly creative momentum without the clout-chasing patterns of traditional social apps.

## Tech Stack

- Frontend: React 19 + TypeScript + Vite
- App shell: Mobile-first PWA with service worker + manifest
- Routing: React Router
- State: Zustand with persistent local-first storage
- Maps: React Leaflet + OpenStreetMap tiles
- PDF export: jsPDF
- UI: Custom CSS design system with accessibility toggles
- Data model: Seeded local-first demo dataset for immediate usability

Detailed rationale: [`docs/TECH_STACK.md`](./docs/TECH_STACK.md)

## Core Product Areas

- Landing, auth, onboarding, and guided walkthrough
- Today dashboard with daily prompts, streaks, credit missions, next session, and quick discovery lanes
- Swipe-based Discover with visual categories, profile cards, workshop cards, item cards, and quick actions
- Center `+` flow for equal swaps, credit or cash bookings, and teacher listing creation with fee breakdowns
- Swap log with taught / learned / credits stat cards, credit ledger, session progress, payout tracker, and PDF export
- Profile with behavior-based trust indicators, skill intent tags, personal resource sharing, and privacy toggles
- Weekly challenges with transparent credit rewards and progress-first participation
- Plain-text messaging with boundary replies, mute, and block controls
- Notifications, settings, privacy controls, verification, and data export/delete controls

## Run Locally

```bash
npm ci
npm run dev
```

Open the Vite local URL shown in the terminal.

## Production Build

```bash
npm run build
```

Build output is generated in `dist/`.

## Environment Variables

No required environment variables are needed for the seeded local-first deployment.

If you later replace the seeded services with live infrastructure, common next steps would be:

- Auth provider keys for Google/Facebook OAuth
- Payment gateway credentials for Stripe / GCash / Maya wiring
- Realtime messaging backend credentials
- Optional custom tile or map provider configuration

## Demo Login

- Email: `mika@hobbyswap.app`
- Password: `HobbySwap9`

## Project Structure

Full tree: [`docs/FILE_TREE.md`](./docs/FILE_TREE.md)

Key directories:

- `src/screens`: all app screens
- `src/components`: reusable UI and map components
- `src/navigation`: route guards and mobile shell
- `src/services`: export and matchmaking helpers
- `src/store`: persisted global state/actions
- `src/data`: seeded community dataset
- `src/utils`: formatting, validation, pagination, ids
- `docs`: handoff, flows, button reference, rationale

## Deployment

### Vercel

1. Push the repo to GitHub.
2. Import the repo into Vercel.
3. Framework preset: `Vite`.
4. Build command: `npm run build`
5. Output directory: `dist`
6. Deploy.

### Static Hosting Alternatives

Any static host that can serve the built `dist/` folder will work, including Netlify, Cloudflare Pages, or GitHub Pages.

## Validation Guidance

- Run `git diff --check` before handoff.
- Confirm JSON assets parse correctly.
- Run `npm ci`, `npm run check`, and `npm run build` on a machine with Node.js and npm installed.
- If npm or `node_modules` are missing locally, follow [`docs/LOCAL_VERIFICATION_GUIDE.md`](./docs/LOCAL_VERIFICATION_GUIDE.md).

## Documentation Index

- Tech/rationale: [`docs/TECH_STACK.md`](./docs/TECH_STACK.md)
- File tree: [`docs/FILE_TREE.md`](./docs/FILE_TREE.md)
- Feature additions: [`docs/FEATURE_ADDITIONS.md`](./docs/FEATURE_ADDITIONS.md)
- Button-by-button reference: [`docs/BUTTON_REFERENCE.md`](./docs/BUTTON_REFERENCE.md)
- User flows: [`docs/USER_FLOWS.md`](./docs/USER_FLOWS.md)
- Deployment notes: [`docs/DEPLOYMENT.md`](./docs/DEPLOYMENT.md)
- Local verification guide: [`docs/LOCAL_VERIFICATION_GUIDE.md`](./docs/LOCAL_VERIFICATION_GUIDE.md)
