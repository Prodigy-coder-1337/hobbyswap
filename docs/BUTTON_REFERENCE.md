# Button-by-Button Functionality Reference

## Bottom Navigation

- `Home`: opens `/app/home` and shows the credit balance, next session, intent-filtered recommendations, and weekly challenge progress.
- `Discover`: opens `/app/discover` and shows the map/list discovery interface with color-coded intent pins, pricing, and filters.
- `+`: opens `/app/new` and lands on the three-mode flow for `Swap`, `Book session`, and `Create listing`.
- `Challenges`: opens `/app/challenges` and shows the weekly challenge list plus credit reward guide.
- `Me`: opens `/app/profile` and shows the current user’s profile, trust indicators, reviews, resources, and privacy controls.

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

- Credit balance card: opens the in-app credit explainer modal.
- `Open chat`: creates or reuses a plain-text thread for the next scheduled session and opens `/app/messages?thread=<id>`.
- Intent filter pills: swap between all recommendations, swaps, teachers, and workshops.
- Recommendation `Book` or `Open`: routes into the center `+` flow or the relevant destination.
- Weekly challenge card `Open challenge`: opens `/app/challenges`.

## Discover

- Search field: filters results live.
- Search suggestions: fill the search box with the tapped suggestion.
- Filter pills `All / Swaps / Teachers / Workshops`: immediately recompute visible map/list results.
- `Map` / `List`: switches discovery presentation mode.
- Listing `Save`: opens a confirmation modal with an optional note, then stores the listing in the user shortlist.
- Listing `Book`: routes to `/app/new` in booking mode with the selected listing preloaded.
- Sticky `Create a listing`: routes to `/app/new` in listing mode.

## New Flow

- Mode chips `Swap / Book session / Create listing`: change the active builder mode without leaving the screen.
- Swap `Continue`: advances from the setup form to the contract preview.
- Swap `Confirm agreement`: creates the agreement and routes to `/app/log`.
- Equal swap toggle: switches the preview copy between `equal swap - no credits needed` and a credit-based agreement.
- Booking `Continue`: advances from listing selection to payment method and then to checkout review.
- Payment methods `GCash / Maya / Card / PayPal / Credits`: update the booking breakdown and available pricing path.
- Booking `Confirm booking`: creates the booking, holds credits or cash payout state, and routes to `/app/log`.
- Listing pricing toggles `Free / Credits / Cash / Both`: update visible pricing fields dynamically.
- Listing `Publish listing`: creates the teacher or swap listing and returns the user to Discover.

## Swap Log

- `Mark done`: completes the next scheduled session in the agreement and updates its progress bar.
- `Leave review`: opens the review modal for the selected agreement.
- Review stars: set the review score.
- Review `Submit`: records the review, updates listing rating, and adds the +5 credit bonus for 5-star reviews.
- `Export PDF`: generates and downloads a PDF progress summary.
- Payout tracker: shows held or scheduled cash payouts, next payout date, and selected payout method.

## Weekly Challenges

- `Join challenge`: adds the current user to the active challenge participant list.
- `Log progress`: advances the user’s challenge progress and awards credits when the goal is reached.

## Messaging

- `Mute`: toggles mute state for the current thread.
- `Block`: blocks the other participant.
- Boundary quick replies: send one-tap boundary messages into the thread.
- `Send message`: appends the plain-text message body to the current thread.

## Profile

- `Save profile`: updates display name and bio.
- `Add resource`: adds a new lendable item to the user resource library.
- Privacy toggles: update anonymity, map visibility, and barangay visibility immediately.

## Notifications

- Toast close button: dismisses a toast immediately, while untouched toasts fade out automatically.
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
