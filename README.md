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
- Activity-first dashboard with finite completion-oriented sections
- Discovery with map + list views, search autocomplete, and filters
- Swap marketplace with browsing, listing creation, offers, checkout, wishlists, ratings, and history
- Skill/time swap contracts with consent-first confirmation, milestones, session tracking, disputes, and cancellation
- Swap log with badges, participation metrics, and PDF export
- Profile with trust score, skill portfolio, reviews, resources, and privacy-aware identity display
- Resource library with lending, reservation, and return policy acceptance
- Weekly challenges with collaborative entries and anonymous voting
- Events with RSVP, hosting, moderation review, check-ins, recaps, and availability sync
- Video hub with short tutorials, user-triggered playback, comments, and reporting
- Encrypted messaging with consent requests, alias mode, mute, block, report, and boundary quick replies
- Peer mentorship matching without hierarchy
- Shared project spaces with kanban board, file sharing, and completion celebration
- Notifications, settings, moderation, safety tools, verification, and data export/delete controls

## Run Locally

```bash
npm install
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
- Realtime messaging backend credentials
- Media storage/CDN configuration
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
- `src/services`: encryption, export, matchmaking
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

## Validation Performed

- `npm install`
- `npm run check`
- `npm run build`

## Documentation Index

- Tech/rationale: [`docs/TECH_STACK.md`](./docs/TECH_STACK.md)
- File tree: [`docs/FILE_TREE.md`](./docs/FILE_TREE.md)
- Feature additions: [`docs/FEATURE_ADDITIONS.md`](./docs/FEATURE_ADDITIONS.md)
- Button-by-button reference: [`docs/BUTTON_REFERENCE.md`](./docs/BUTTON_REFERENCE.md)
- User flows: [`docs/USER_FLOWS.md`](./docs/USER_FLOWS.md)
- Deployment notes: [`docs/DEPLOYMENT.md`](./docs/DEPLOYMENT.md)
