# Button-by-Button Functionality Reference

## Bottom Navigation

- `Home`: opens `/app/home` and shows the personalized dashboard with quick matches, challenges, projects, contracts, and upcoming events.
- `Discover`: opens `/app/discover` and shows the map/list discovery interface with filters and autocomplete.
- `Swap`: opens `/app/swap` and loads the marketplace browse view.
- `Events`: opens `/app/events` and loads upcoming meetups.
- `Profile`: opens `/app/profile` and shows the current user’s profile, portfolio, reviews, and resources.

## Landing Page

- `Get Started`: opens `/auth?mode=signup`; after successful account creation, the user is taken to onboarding.
- `Log In`: opens `/auth?mode=login`.
- Footer links:
  - `About`: opens `/info/about`
  - `Privacy`: opens `/info/privacy`
  - `Terms`: opens `/info/terms`
  - `Contact`: opens `/info/contact`

## Auth & Onboarding

- `Log In` submit: validates credentials, writes session state, then routes to onboarding, guide, or home depending on account status.
- `Create Account`: validates fields in real time, creates the account, seeds privacy-first defaults, then routes to onboarding.
- `Continue with Google` / `Continue with Facebook`: creates or reuses a local-first provider account and routes to onboarding.
- Hobby cards: toggle hobby selection in onboarding.
- Skill level select: changes proficiency level for each selected hobby.
- Availability chips: add or remove time slots.
- Format chips: add or remove preferred formats.
- `Create My Dashboard`: saves onboarding answers, generates quick matches, then routes to the app guide.

## Dashboard

- `Quick Match`: recomputes local mentor/match suggestions and refreshes the match panel.
- `Join challenge`: opens `/app/challenges`.
- `Open event`: opens `/app/events`.
- `Request chat`: creates or reuses a thread and opens `/app/messages?thread=<id>`.
- `Draft swap`: opens `/app/contracts` with partner context.
- Quick action cards:
  - `Start a swap contract`: opens contracts
  - `Borrow a resource`: opens resource library
  - `Open project spaces`: opens shared projects
  - `Find peer guidance`: opens mentorship

## Discover

- Search field: filters results live.
- Search suggestions: fill the search box with the tapped suggestion.
- Hobby / format / distance filters: immediately recompute visible map/list results.
- `Map` / `List`: switches discovery presentation mode.
- Result `Open`: routes to messaging, events, or marketplace depending on result type.

## Marketplace

- `View`: opens the listing detail sheet.
- `Save` / `Saved`: toggles wishlist state for the current user.
- `Send offer`: creates a swap offer and notifies the listing owner.
- `Buy now`: simulates checkout, records a completed sale transaction, and updates history.
- `Accept` / `Decline` on offers: finalizes or rejects a swap proposal and updates transaction state.
- `Publish listing`: creates a new marketplace listing with the entered metadata.
- Rating dots in History: set the current user’s transaction rating.

## Swap Contracts

- `Send contract for review`: creates a pending swap contract with sessions and shared notes.
- `Confirm terms`: adds the current user’s digital confirmation and activates the contract once both sides confirm.
- `Mark complete`: marks a session as completed and logs progress into the swap log.
- `Open chat`: opens or creates the thread tied to that contract.
- `Complete`: marks the contract completed with a closing note.
- `Raise dispute`: marks the contract disputed and stores the resolution note.
- `Cancel swap`: marks the contract cancelled and stores the resolution note.

## Swap Log

- `Export PDF`: generates and downloads a PDF progress summary.

## Resource Library

- `View policy`: opens the reservation sheet for the selected item.
- Policy toggle: records acceptance of damage/return expectations.
- `Confirm reservation`: reserves the resource for the current user.
- `Return item`: marks a reserved item as returned.

## Weekly Challenges

- `Join challenge`: adds the current user to the active challenge participant list.
- `Submit entry`: creates a new text/photo/video challenge submission.
- `Vote anonymously` / `Voted`: toggles the current user’s anonymous vote on an entry.

## Events

- `RSVP`: toggles event attendance.
- `Check in`: records attendance after arrival and adds a swap-log event entry.
- `Save recap`: stores the event recap text.
- `Submit for moderation review`: creates a hosted event with pending moderation status.

## Messaging

- `Resend consent request`: refreshes the consent request on a locked thread.
- `Approve conversation`: grants first-message consent on the selected thread.
- `Mute`: toggles mute state for the current thread.
- `Block`: blocks the other participant.
- `Report`: files a moderation report against the thread.
- Boundary quick replies: send one-tap boundary messages into the thread.
- `Send encrypted message`: encrypts and appends the message body to the current thread.

## Profile

- `Settings`: routes to `/app/settings`.
- `Save profile`: updates display name, real name, and bio.

## Notifications

- `Mark read`: flags a notification as read.
- `Open`: routes to the referenced screen.
- `Clear all`: removes current-user notifications.

## Settings

- Account fields: update stored account values immediately.
- Privacy toggles: update profile visibility, location precision, and anonymous mode.
- Notification toggles: update the corresponding delivery preference.
- Accessibility controls: update font scale, high contrast, screen reader hints, and reduced motion.
- `Verify phone`: marks the phone verification state complete.
- `Verify school or local ID`: marks ID verification complete.
- `Open App Guide`: routes to `/app/guide`.
- `Enable premium` / `Pause premium`: toggles premium membership state.
- `Export my data`: downloads the persisted app state as JSON.
- `Reset demo data`: restores the seeded initial data.
- `Delete account`: removes the current user locally and returns to landing.

## Moderation & Safety

- `Submit report`: creates a new moderation report.

## Mentorship

- `Request peer mentorship`: creates a mentorship-flavored swap contract and routes naturally toward contracts.
- `Start chat`: creates or reuses a thread with the selected mentor and opens messaging.

## Project Spaces

- `Create project space`: creates a new shared project with selected collaborators.
- `Add task`: appends a new kanban task to the To Do lane.
- `To Do` / `Doing` / `Done`: move a task between project lanes.
- `Share file`: appends a shared project file URL.
- `Mark celebration seen`: dismisses the completion celebration state.

## Video Hub

- Native video controls: user-initiated playback only, no autoplay.
- `Comment`: appends a moderated comment to the selected video.
- `Report video`: files a moderation report for that video.
- `Publish video`: creates a new short-form hobby video post if duration is within the 3-minute rule.
