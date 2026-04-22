# Feature Additions I Chose

## 1. Finite dashboard pacing

Why: The product brief explicitly rejected addictive feed mechanics.

How it works: The dashboard is built as a set of bounded panels with actionable next steps, not an endless scroll of content.

## 2. Local-first encrypted message payloads

Why: Privacy-first identity and gentle early interactions needed more than plain text local storage.

How it works: Chat messages are stored using AES-GCM through the Web Crypto API before being rendered back into the interface.

## 3. Project completion celebration state

Why: Community projects should feel emotionally rewarding when they wrap up.

How it works: When a project board clears its active lanes, the app shows a one-time celebration panel until the user dismisses it.

## 4. Accessibility-driven shell classes

Why: Accessibility settings should affect the live app, not just exist as toggles.

How it works: Font scale, high contrast, and reduced motion settings feed into the app shell and change the rendered interface.

## 5. Availability sync panel in events

Why: Users need a quick read on whether a meetup fits their week before committing.

How it works: The Events screen surfaces the current user’s selected availability directly above upcoming meetups.

## 6. Boundary scripts in moderation and messaging

Why: Safety tools are stronger when they help people express boundaries, not only report harm afterward.

How it works: The app includes one-tap quick replies inside chat plus reusable language inside the moderation screen.
