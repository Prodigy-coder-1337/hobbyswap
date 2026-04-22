# Tech Stack Decision & Rationale

## Chosen Stack

- Platform: React + TypeScript + Vite mobile-first PWA
- Routing: React Router
- State management: Zustand with persistence
- Maps: React Leaflet + OpenStreetMap
- Export utilities: jsPDF
- Styling: Custom CSS system with warm design tokens and mobile shell

## Why This Stack

React Native or Flutter were preferred in principle, but the strongest immediate deployment path in this workspace was a true installable PWA with:

- immediate browser + mobile deployment
- complete routing and stateful flows
- map support without native build tooling
- zero incomplete native service setup
- straightforward Vercel hosting

This choice keeps the product deployable today while still behaving like a mobile application rather than a static marketing site.

## Architectural Notes

- Local-first seeded state means every screen is populated on first run.
- Zustand actions drive real mutations across listings, contracts, events, chat, moderation, and profile settings.
- Route-based lazy loading reduces initial bundle cost and keeps secondary screens out of the critical path.
- Messaging uses AES-GCM via the Web Crypto API for local encrypted payload storage.
- The app intentionally avoids infinite scroll and uses segmented panels, pagination, and finite action sets.

## Tradeoffs

- Social login is implemented as deployable in-app provider flows that create local-first sessions rather than live third-party OAuth credentials.
- Messaging, payments, and moderation are complete from the app perspective, but use local-first behavior rather than remote hosted infrastructure.
- The project is ready for immediate static deployment and also structured so hosted auth/storage/realtime services can replace the seeded services later.
