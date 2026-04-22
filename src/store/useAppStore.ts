import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { seedData } from '@/data/seed';
import { encryptMessage } from '@/services/encryption';
import { buildQuickMatches } from '@/services/matchmaking';
import {
  AccessibilitySettings,
  AgeGroup,
  AppData,
  FormatPreference,
  HobbyProfile,
  ListingCondition,
  NotificationPreferences,
  ReportCategory,
  SubjectType,
  TaskLane,
  Toast,
  User
} from '@/types/models';
import { createId } from '@/utils/createId';

type SignUpPayload = {
  realName: string;
  identifier: string;
  password: string;
  barangay: string;
  city: string;
  ageGroup: AgeGroup;
};

type OnboardingPayload = {
  displayName: string;
  hobbyProfiles: HobbyProfile[];
  availability: string[];
  preferredFormats: FormatPreference[];
  anonymousMode: boolean;
};

type ListingPayload = {
  title: string;
  description: string;
  category: string;
  hobbyId: string;
  photoUrl: string;
  condition: ListingCondition;
  swapPreference: string;
  pricePhp: number | null;
  location: { barangay: string; city: string; lat: number; lng: number };
  availability: string;
  mode: 'swap' | 'sale' | 'both';
};

type ContractPayload = {
  partnerId: string;
  teachSkill: string;
  learnSkill: string;
  sessions: number;
  durationMinutes: number;
  format: FormatPreference;
  meetingPoint: string;
  videoLink?: string;
  notes: string;
};

type EventPayload = {
  title: string;
  description: string;
  date: string;
  time: string;
  format: FormatPreference;
  requiredSkill: 'Beginner' | 'Learning' | 'Comfortable' | 'Can Teach';
  capacity: number;
  location: { barangay: string; city: string; lat: number; lng: number };
};

type ProjectPayload = {
  title: string;
  description: string;
  hobbyId: string;
  collaboratorIds: string[];
};

type ReportPayload = {
  subjectType: SubjectType;
  subjectId: string;
  category: ReportCategory;
  details: string;
};

type VideoPayload = {
  title: string;
  url: string;
  thumbnail: string;
  hobbyId: string;
  skillLevel: 'Beginner' | 'Learning' | 'Comfortable' | 'Can Teach';
  format: FormatPreference;
  durationSeconds: number;
};

interface AppState extends AppData {
  currentUserId: string | null;
  toasts: Toast[];
  login: (identifier: string, password: string) => { ok: boolean; message: string };
  loginWithProvider: (provider: 'Google' | 'Facebook') => { ok: boolean; message: string };
  signUp: (payload: SignUpPayload) => { ok: boolean; message: string };
  completeOnboarding: (payload: OnboardingPayload) => void;
  completeGuide: () => void;
  logout: () => void;
  updateProfile: (patch: Partial<User>) => void;
  updatePrivacy: (patch: Partial<User['privacy']>) => void;
  updateNotificationPrefs: (patch: Partial<NotificationPreferences>) => void;
  updateAccessibility: (patch: Partial<AccessibilitySettings>) => void;
  togglePremium: () => void;
  toggleWishlist: (listingId: string) => void;
  createListing: (payload: ListingPayload) => void;
  submitOffer: (listingId: string, offeredItem: string, note: string) => void;
  decideOffer: (listingId: string, offerId: string, status: 'accepted' | 'declined') => void;
  purchaseListing: (listingId: string) => void;
  rateTransaction: (transactionId: string, rating: number) => void;
  createContract: (payload: ContractPayload) => void;
  confirmContract: (contractId: string) => void;
  markSessionComplete: (contractId: string, sessionId: string) => void;
  updateContractStatus: (
    contractId: string,
    status: 'completed' | 'disputed' | 'cancelled',
    note: string
  ) => void;
  reserveResource: (resourceId: string, acceptPolicy: boolean) => void;
  returnResource: (resourceId: string) => void;
  joinChallenge: (challengeId: string) => void;
  submitChallengeEntry: (
    challengeId: string,
    mediaType: 'photo' | 'video' | 'text',
    caption: string,
    mediaUrl?: string,
    partnerId?: string
  ) => void;
  voteChallengeEntry: (challengeId: string, entryId: string) => void;
  rsvpEvent: (eventId: string) => void;
  hostEvent: (payload: EventPayload) => void;
  checkInEvent: (eventId: string) => void;
  saveEventRecap: (eventId: string, recap: string) => void;
  startConversation: (partnerId: string, contractId?: string) => string;
  requestMessageConsent: (threadId: string) => void;
  grantMessageConsent: (threadId: string) => void;
  sendMessage: (threadId: string, body: string, quickBoundary?: boolean) => Promise<void>;
  muteThread: (threadId: string) => void;
  blockUser: (userId: string) => void;
  markNotificationRead: (notificationId: string) => void;
  clearAllNotifications: () => void;
  createReport: (payload: ReportPayload) => void;
  quickMatch: () => void;
  startMentorship: (mentorId: string, hobbyId: string) => void;
  createProject: (payload: ProjectPayload) => void;
  addProjectTask: (projectId: string, title: string) => void;
  moveProjectTask: (projectId: string, taskId: string, lane: TaskLane) => void;
  addProjectFile: (projectId: string, name: string, url: string) => void;
  markProjectCelebrationSeen: (projectId: string) => void;
  createVideoPost: (payload: VideoPayload) => void;
  addVideoComment: (videoId: string, body: string) => void;
  requestVerification: (type: 'phone' | 'local-id') => void;
  dismissToast: (toastId: string) => void;
  deleteAccount: () => void;
  resetDemoData: () => void;
}

function cloneSeed(): AppData {
  return JSON.parse(JSON.stringify(seedData)) as AppData;
}

function toast(message: string, tone: Toast['tone'] = 'success'): Toast {
  return { id: createId('toast'), message, tone };
}

function notification(
  userId: string,
  type: AppState['notifications'][number]['type'],
  title: string,
  body: string,
  route: string
) {
  return {
    id: createId('notif'),
    userId,
    type,
    title,
    body,
    route,
    createdAt: new Date().toISOString(),
    read: false
  };
}

function currentUserFrom(state: Pick<AppState, 'users' | 'currentUserId'>) {
  return state.users.find((user) => user.id === state.currentUserId) ?? null;
}

function updateUser(users: User[], userId: string, updater: (user: User) => User) {
  return users.map((user) => (user.id === userId ? updater(user) : user));
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      ...cloneSeed(),
      currentUserId: null,
      toasts: [],
      login: (identifier, password) => {
        const value = identifier.trim().toLowerCase();
        const user = get().users.find(
          (entry) =>
            (entry.email.toLowerCase() === value || entry.phone === identifier.trim()) &&
            entry.password === password
        );

        if (!user) {
          set((state) => ({
            toasts: [toast('We could not match that login. Try the demo account or sign up.', 'error'), ...state.toasts]
          }));
          return { ok: false, message: 'Invalid credentials.' };
        }

        set((state) => ({
          currentUserId: user.id,
          toasts: [toast(`Welcome back, ${user.displayName}.`), ...state.toasts]
        }));
        return { ok: true, message: user.onboardingComplete ? 'Welcome back.' : 'Continue onboarding.' };
      },
      loginWithProvider: (provider) => {
        const email = provider === 'Google' ? 'google.friend@hobbyswap.app' : 'facebook.friend@hobbyswap.app';
        const existing = get().users.find((user) => user.email === email);

        if (existing) {
          set((state) => ({
            currentUserId: existing.id,
            toasts: [toast(`Signed in with ${provider}.`), ...state.toasts]
          }));
          return { ok: true, message: 'Signed in.' };
        }

        const userId = createId('user');
        const newUser: User = {
          id: userId,
          realName: `${provider} Friend`,
          displayName: `${provider} Friend`,
          anonymousAlias: `${provider} Spark`,
          email,
          phone: '09999999999',
          password: 'SocialLogin9',
          location: { barangay: 'Poblacion', city: 'Makati', lat: 14.5656, lng: 121.0292 },
          ageGroup: '25-34',
          bio: 'Just joined through social sign-in.',
          avatar: provider === 'Google' ? '#ef8b5a' : '#4f6ddf',
          hobbyProfiles: [],
          availability: [],
          preferredFormats: ['Hybrid'],
          anonymousMode: true,
          onboardingComplete: false,
          guideCompleted: false,
          trustScore: 60,
          premium: false,
          verifiedPhone: false,
          verifiedLocalId: false,
          privacy: {
            visibility: 'Matches Only',
            showRealName: false,
            showExactLocation: false
          },
          notificationPreferences: {
            swapRequests: true,
            challengeReminders: true,
            eventReminders: true,
            messages: true,
            contractUpdates: true,
            digestMode: false
          },
          accessibility: {
            fontScale: 'Default',
            highContrast: false,
            screenReaderHints: true,
            reduceMotion: false
          },
          blockedUserIds: [],
          mutedThreadIds: []
        };

        set((state) => ({
          users: [newUser, ...state.users],
          currentUserId: userId,
          toasts: [toast(`Signed in with ${provider}.`), ...state.toasts]
        }));
        return { ok: true, message: 'Continue onboarding.' };
      },
      signUp: (payload) => {
        const normalized = payload.identifier.trim().toLowerCase();
        const exists = get().users.some(
          (user) =>
            user.email.toLowerCase() === normalized ||
            user.phone === payload.identifier.trim()
        );

        if (exists) {
          set((state) => ({
            toasts: [toast('That email or phone is already connected to an account.', 'error'), ...state.toasts]
          }));
          return { ok: false, message: 'Account already exists.' };
        }

        const userId = createId('user');
        const isEmail = normalized.includes('@');
        const newUser: User = {
          id: userId,
          realName: payload.realName.trim(),
          displayName: payload.realName.trim().split(' ')[0] ?? payload.realName.trim(),
          anonymousAlias: 'Pocket Horizon',
          email: isEmail ? normalized : `${userId}@hobbyswap.app`,
          phone: isEmail ? '09170000000' : payload.identifier.trim(),
          password: payload.password,
          location: {
            barangay: payload.barangay.trim(),
            city: payload.city.trim(),
            lat: 14.5656,
            lng: 121.0292
          },
          ageGroup: payload.ageGroup,
          bio: 'New to HobbySwap and open to warm, beginner-friendly exchanges.',
          avatar: '#103b39',
          hobbyProfiles: [],
          availability: [],
          preferredFormats: ['Hybrid'],
          anonymousMode: true,
          onboardingComplete: false,
          guideCompleted: false,
          trustScore: 55,
          premium: false,
          verifiedPhone: !isEmail,
          verifiedLocalId: false,
          privacy: {
            visibility: 'Matches Only',
            showRealName: false,
            showExactLocation: false
          },
          notificationPreferences: {
            swapRequests: true,
            challengeReminders: true,
            eventReminders: true,
            messages: true,
            contractUpdates: true,
            digestMode: false
          },
          accessibility: {
            fontScale: 'Default',
            highContrast: false,
            screenReaderHints: true,
            reduceMotion: false
          },
          blockedUserIds: [],
          mutedThreadIds: []
        };

        set((state) => ({
          users: [newUser, ...state.users],
          currentUserId: userId,
          notifications: [
            notification(
              userId,
              'safety',
              'Welcome to HobbySwap',
              'Your profile starts in privacy-first mode until you decide otherwise.',
              '/app/guide'
            ),
            ...state.notifications
          ],
          toasts: [toast('Account created. Let’s tailor your first week.'), ...state.toasts]
        }));

        return { ok: true, message: 'Continue onboarding.' };
      },
      completeOnboarding: (payload) => {
        const currentUser = currentUserFrom(get());
        if (!currentUser) {
          return;
        }

        set((state) => ({
          users: updateUser(state.users, currentUser.id, (user) => ({
            ...user,
            displayName: payload.displayName.trim() || user.displayName,
            hobbyProfiles: payload.hobbyProfiles,
            availability: payload.availability,
            preferredFormats: payload.preferredFormats,
            anonymousMode: payload.anonymousMode,
            onboardingComplete: true,
            guideCompleted: false
          })),
          quickMatches: buildQuickMatches(
            {
              ...currentUser,
              hobbyProfiles: payload.hobbyProfiles,
              availability: payload.availability,
              preferredFormats: payload.preferredFormats
            },
            state.users,
            state.hobbies
          ),
          toasts: [toast('Your dashboard is ready.'), ...state.toasts]
        }));
      },
      completeGuide: () => {
        const currentUser = currentUserFrom(get());
        if (!currentUser) {
          return;
        }

        set((state) => ({
          users: updateUser(state.users, currentUser.id, (user) => ({
            ...user,
            guideCompleted: true
          }))
        }));
      },
      logout: () => set({ currentUserId: null }),
      updateProfile: (patch) => {
        const currentUser = currentUserFrom(get());
        if (!currentUser) {
          return;
        }
        set((state) => ({
          users: updateUser(state.users, currentUser.id, (user) => ({
            ...user,
            ...patch
          })),
          toasts: [toast('Profile updated.'), ...state.toasts]
        }));
      },
      updatePrivacy: (patch) => {
        const currentUser = currentUserFrom(get());
        if (!currentUser) {
          return;
        }

        set((state) => ({
          users: updateUser(state.users, currentUser.id, (user) => ({
            ...user,
            privacy: { ...user.privacy, ...patch }
          })),
          toasts: [toast('Privacy settings saved.'), ...state.toasts]
        }));
      },
      updateNotificationPrefs: (patch) => {
        const currentUser = currentUserFrom(get());
        if (!currentUser) {
          return;
        }

        set((state) => ({
          users: updateUser(state.users, currentUser.id, (user) => ({
            ...user,
            notificationPreferences: {
              ...user.notificationPreferences,
              ...patch
            }
          })),
          toasts: [toast('Notification preferences updated.'), ...state.toasts]
        }));
      },
      updateAccessibility: (patch) => {
        const currentUser = currentUserFrom(get());
        if (!currentUser) {
          return;
        }

        set((state) => ({
          users: updateUser(state.users, currentUser.id, (user) => ({
            ...user,
            accessibility: { ...user.accessibility, ...patch }
          })),
          toasts: [toast('Accessibility preferences updated.'), ...state.toasts]
        }));
      },
      togglePremium: () => {
        const currentUser = currentUserFrom(get());
        if (!currentUser) {
          return;
        }
        set((state) => ({
          users: updateUser(state.users, currentUser.id, (user) => ({
            ...user,
            premium: !user.premium
          })),
          toasts: [toast(currentUser.premium ? 'Premium paused.' : 'Premium enabled.'), ...state.toasts]
        }));
      },
      toggleWishlist: (listingId) => {
        const currentUser = currentUserFrom(get());
        if (!currentUser) {
          return;
        }
        set((state) => ({
          listings: state.listings.map((listing) =>
            listing.id === listingId
              ? {
                  ...listing,
                  savedBy: listing.savedBy.includes(currentUser.id)
                    ? listing.savedBy.filter((id) => id !== currentUser.id)
                    : [...listing.savedBy, currentUser.id]
                }
              : listing
          ),
          toasts: [toast('Saved list updated.'), ...state.toasts]
        }));
      },
      createListing: (payload) => {
        const currentUser = currentUserFrom(get());
        if (!currentUser) {
          return;
        }

        set((state) => ({
          listings: [
            {
              id: createId('listing'),
              ownerId: currentUser.id,
              title: payload.title,
              description: payload.description,
              category: payload.category,
              hobbyId: payload.hobbyId,
              photos: [payload.photoUrl],
              condition: payload.condition,
              swapPreference: payload.swapPreference,
              pricePhp: payload.pricePhp,
              location: payload.location,
              availability: payload.availability,
              mode: payload.mode,
              savedBy: [],
              offers: [],
              status: 'active',
              createdAt: new Date().toISOString()
            },
            ...state.listings
          ],
          toasts: [toast('Listing published.'), ...state.toasts]
        }));
      },
      submitOffer: (listingId, offeredItem, note) => {
        const currentUser = currentUserFrom(get());
        if (!currentUser) {
          return;
        }
        set((state) => {
          const listing = state.listings.find((entry) => entry.id === listingId);
          if (!listing) {
            return state;
          }

          return {
            listings: state.listings.map((entry) =>
              entry.id === listingId
                ? {
                    ...entry,
                    offers: [
                      {
                        id: createId('offer'),
                        fromUserId: currentUser.id,
                        offeredItem,
                        note,
                        status: 'pending',
                        createdAt: new Date().toISOString()
                      },
                      ...entry.offers
                    ]
                  }
                : entry
            ),
            notifications: [
              notification(
                listing.ownerId,
                'swap-request',
                'New swap offer',
                `${currentUser.displayName} sent an offer for ${listing.title}.`,
                '/app/swap'
              ),
              ...state.notifications
            ],
            toasts: [toast('Swap offer sent.'), ...state.toasts]
          };
        });
      },
      decideOffer: (listingId, offerId, status) => {
        set((state) => {
          const listing = state.listings.find((entry) => entry.id === listingId);
          const offer = listing?.offers.find((entry) => entry.id === offerId);
          if (!listing || !offer) {
            return state;
          }

          const txn =
            status === 'accepted'
              ? {
                  id: createId('txn'),
                  listingId: listing.id,
                  buyerId: offer.fromUserId,
                  sellerId: listing.ownerId,
                  type: 'swap' as const,
                  amountPhp: listing.pricePhp ?? 0,
                  status: 'completed' as const,
                  createdAt: new Date().toISOString()
                }
              : null;

          return {
            listings: state.listings.map((entry) =>
              entry.id === listingId
                ? {
                    ...entry,
                    status: status === 'accepted' ? 'completed' : entry.status,
                    offers: entry.offers.map((item) =>
                      item.id === offerId ? { ...item, status } : item
                    )
                  }
                : entry
            ),
            transactions: txn ? [txn, ...state.transactions] : state.transactions,
            notifications: [
              notification(
                offer.fromUserId,
                'swap-request',
                status === 'accepted' ? 'Offer accepted' : 'Offer declined',
                `${listing.title} was ${status}.`,
                '/app/swap'
              ),
              ...state.notifications
            ],
            toasts: [toast(`Offer ${status}.`), ...state.toasts]
          };
        });
      },
      purchaseListing: (listingId) => {
        const currentUser = currentUserFrom(get());
        if (!currentUser) {
          return;
        }
        set((state) => {
          const listing = state.listings.find((entry) => entry.id === listingId);
          if (!listing) {
            return state;
          }

          return {
            listings: state.listings.map((entry) =>
              entry.id === listingId ? { ...entry, status: 'completed' } : entry
            ),
            transactions: [
              {
                id: createId('txn'),
                listingId: listing.id,
                buyerId: currentUser.id,
                sellerId: listing.ownerId,
                type: 'sale',
                amountPhp: listing.pricePhp ?? 0,
                status: 'completed',
                createdAt: new Date().toISOString()
              },
              ...state.transactions
            ],
            notifications: [
              notification(
                currentUser.id,
                'swap-request',
                'Purchase complete',
                `You checked out ${listing.title}.`,
                '/app/swap'
              ),
              ...state.notifications
            ],
            toasts: [toast('Checkout complete.'), ...state.toasts]
          };
        });
      },
      rateTransaction: (transactionId, rating) => {
        const currentUser = currentUserFrom(get());
        if (!currentUser) {
          return;
        }
        set((state) => ({
          transactions: state.transactions.map((transaction) =>
            transaction.id === transactionId
              ? transaction.buyerId === currentUser.id
                ? { ...transaction, ratingByBuyer: rating }
                : { ...transaction, ratingBySeller: rating }
              : transaction
          ),
          toasts: [toast('Thanks for leaving a community rating.'), ...state.toasts]
        }));
      },
      createContract: (payload) => {
        const currentUser = currentUserFrom(get());
        if (!currentUser) {
          return;
        }
        const contractId = createId('contract');

        set((state) => ({
          contracts: [
            {
              id: contractId,
              initiatorId: currentUser.id,
              partnerId: payload.partnerId,
              teachSkill: payload.teachSkill,
              learnSkill: payload.learnSkill,
              sessions: payload.sessions,
              durationMinutes: payload.durationMinutes,
              format: payload.format,
              meetingPoint: payload.meetingPoint,
              videoLink: payload.videoLink,
              notes: [payload.notes],
              milestones: ['Shared terms'],
              status: 'pending',
              confirmedBy: [currentUser.id],
              sessionRecords: Array.from({ length: payload.sessions }, (_, index) => ({
                id: createId('session'),
                label: `Session ${index + 1}`,
                date: new Date(Date.now() + (index + 1) * 604800000).toISOString(),
                durationMinutes: payload.durationMinutes,
                status: 'scheduled'
              })),
              createdAt: new Date().toISOString()
            },
            ...state.contracts
          ],
          notifications: [
            notification(
              payload.partnerId,
              'contract',
              'New swap contract request',
              `${currentUser.displayName} sent a consent-first swap agreement.`,
              '/app/contracts'
            ),
            ...state.notifications
          ],
          toasts: [toast('Contract request sent.'), ...state.toasts]
        }));
      },
      confirmContract: (contractId) => {
        const currentUser = currentUserFrom(get());
        if (!currentUser) {
          return;
        }
        set((state) => ({
          contracts: state.contracts.map((contract) =>
            contract.id === contractId
              ? {
                  ...contract,
                  confirmedBy: Array.from(new Set([...contract.confirmedBy, currentUser.id])),
                  status:
                    Array.from(new Set([...contract.confirmedBy, currentUser.id])).length >= 2
                      ? 'active'
                      : 'pending'
                }
              : contract
          ),
          toasts: [toast('Contract confirmed.'), ...state.toasts]
        }));
      },
      markSessionComplete: (contractId, sessionId) => {
        const currentUser = currentUserFrom(get());
        if (!currentUser) {
          return;
        }
        set((state) => ({
          contracts: state.contracts.map((contract) =>
            contract.id === contractId
              ? {
                  ...contract,
                  milestones: Array.from(new Set([...contract.milestones, 'Logged a completed session'])),
                  sessionRecords: contract.sessionRecords.map((session) =>
                    session.id === sessionId ? { ...session, status: 'completed' } : session
                  ),
                  status: contract.sessionRecords.every((session) => session.status === 'completed')
                    ? 'completed'
                    : contract.status
                }
              : contract
          ),
          swapLog: [
            {
              id: createId('log'),
              userId: currentUser.id,
              title: 'Completed a swap session',
              type: 'learned',
              hours: 1.5,
              badge: 'Steady Practice',
              happenedAt: new Date().toISOString()
            },
            ...state.swapLog
          ],
          toasts: [toast('Session marked complete.'), ...state.toasts]
        }));
      },
      updateContractStatus: (contractId, status, note) => {
        set((state) => ({
          contracts: state.contracts.map((contract) =>
            contract.id === contractId
              ? {
                  ...contract,
                  status,
                  notes: note ? [...contract.notes, note] : contract.notes
                }
              : contract
          ),
          toasts: [toast(`Contract ${status}.`, status === 'disputed' ? 'warning' : 'success'), ...state.toasts]
        }));
      },
      reserveResource: (resourceId, acceptPolicy) => {
        const currentUser = currentUserFrom(get());
        if (!currentUser || !acceptPolicy) {
          set((state) => ({
            toasts: [toast('Please accept the damage and return policy first.', 'warning'), ...state.toasts]
          }));
          return;
        }
        set((state) => ({
          resources: state.resources.map((resource) =>
            resource.id === resourceId
              ? {
                  ...resource,
                  reservation: {
                    userId: currentUser.id,
                    acceptedPolicy: true,
                    status: 'reserved'
                  }
                }
              : resource
          ),
          toasts: [toast('Resource reserved.'), ...state.toasts]
        }));
      },
      returnResource: (resourceId) => {
        set((state) => ({
          resources: state.resources.map((resource) =>
            resource.id === resourceId && resource.reservation
              ? {
                  ...resource,
                  reservation: { ...resource.reservation, status: 'returned' }
                }
              : resource
          ),
          toasts: [toast('Resource marked as returned.'), ...state.toasts]
        }));
      },
      joinChallenge: (challengeId) => {
        const currentUser = currentUserFrom(get());
        if (!currentUser) {
          return;
        }
        set((state) => ({
          challenges: state.challenges.map((challenge) =>
            challenge.id === challengeId
              ? {
                  ...challenge,
                  participantIds: Array.from(new Set([...challenge.participantIds, currentUser.id]))
                }
              : challenge
          ),
          toasts: [toast('Challenge joined.'), ...state.toasts]
        }));
      },
      submitChallengeEntry: (challengeId, mediaType, caption, mediaUrl, partnerId) => {
        const currentUser = currentUserFrom(get());
        if (!currentUser) {
          return;
        }
        set((state) => ({
          challenges: state.challenges.map((challenge) =>
            challenge.id === challengeId
              ? {
                  ...challenge,
                  entries: [
                    {
                      id: createId('entry'),
                      userId: currentUser.id,
                      partnerId,
                      mediaType,
                      caption,
                      mediaUrl,
                      createdAt: new Date().toISOString(),
                      voters: []
                    },
                    ...challenge.entries
                  ],
                  participantIds: Array.from(new Set([...challenge.participantIds, currentUser.id]))
                }
              : challenge
          ),
          swapLog: [
            {
              id: createId('log'),
              userId: currentUser.id,
              title: 'Submitted a weekly challenge entry',
              type: 'challenge',
              hours: 1,
              badge: 'Made Time',
              happenedAt: new Date().toISOString()
            },
            ...state.swapLog
          ],
          toasts: [toast('Challenge entry submitted.'), ...state.toasts]
        }));
      },
      voteChallengeEntry: (challengeId, entryId) => {
        const currentUser = currentUserFrom(get());
        if (!currentUser) {
          return;
        }
        set((state) => ({
          challenges: state.challenges.map((challenge) =>
            challenge.id === challengeId
              ? {
                  ...challenge,
                  entries: challenge.entries.map((entry) =>
                    entry.id === entryId
                      ? {
                          ...entry,
                          voters: entry.voters.includes(currentUser.id)
                            ? entry.voters.filter((id) => id !== currentUser.id)
                            : [...entry.voters, currentUser.id]
                        }
                      : entry
                  )
                }
              : challenge
          ),
          toasts: [toast('Vote saved anonymously.'), ...state.toasts]
        }));
      },
      rsvpEvent: (eventId) => {
        const currentUser = currentUserFrom(get());
        if (!currentUser) {
          return;
        }
        set((state) => ({
          events: state.events.map((event) =>
            event.id === eventId
              ? {
                  ...event,
                  attendeeIds: event.attendeeIds.includes(currentUser.id)
                    ? event.attendeeIds.filter((id) => id !== currentUser.id)
                    : [...event.attendeeIds, currentUser.id]
                }
              : event
          ),
          notifications: [
            notification(
              currentUser.id,
              'event',
              'RSVP updated',
              'Your event reminder preferences stay minimal and useful.',
              '/app/events'
            ),
            ...state.notifications
          ],
          toasts: [toast('RSVP updated.'), ...state.toasts]
        }));
      },
      hostEvent: (payload) => {
        const currentUser = currentUserFrom(get());
        if (!currentUser) {
          return;
        }
        set((state) => ({
          events: [
            {
              id: createId('event'),
              hostId: currentUser.id,
              title: payload.title,
              description: payload.description,
              date: payload.date,
              time: payload.time,
              format: payload.format,
              location: payload.location,
              requiredSkill: payload.requiredSkill,
              capacity: payload.capacity,
              attendeeIds: [],
              checkedInIds: [],
              moderationStatus: 'pending review'
            },
            ...state.events
          ],
          toasts: [toast('Event submitted for moderation review.'), ...state.toasts]
        }));
      },
      checkInEvent: (eventId) => {
        const currentUser = currentUserFrom(get());
        if (!currentUser) {
          return;
        }
        set((state) => ({
          events: state.events.map((event) =>
            event.id === eventId
              ? {
                  ...event,
                  checkedInIds: Array.from(new Set([...event.checkedInIds, currentUser.id]))
                }
              : event
          ),
          swapLog: [
            {
              id: createId('log'),
              userId: currentUser.id,
              title: 'Checked in to a meetup',
              type: 'event',
              hours: 2,
              badge: 'Local Loop',
              happenedAt: new Date().toISOString()
            },
            ...state.swapLog
          ],
          toasts: [toast('Checked in.'), ...state.toasts]
        }));
      },
      saveEventRecap: (eventId, recap) => {
        set((state) => ({
          events: state.events.map((event) =>
            event.id === eventId ? { ...event, recap } : event
          ),
          toasts: [toast('Event recap saved.'), ...state.toasts]
        }));
      },
      startConversation: (partnerId, contractId) => {
        const currentUser = currentUserFrom(get());
        if (!currentUser) {
          return '';
        }

        const existing = get().threads.find(
          (thread) =>
            thread.participantIds.includes(currentUser.id) &&
            thread.participantIds.includes(partnerId)
        );
        if (existing) {
          return existing.id;
        }

        const threadId = createId('thread');
        set((state) => ({
          threads: [
            {
              id: threadId,
              participantIds: [currentUser.id, partnerId],
              contractId,
              consentRequestedBy: currentUser.id,
              consentGranted: false,
              aliasMode: currentUser.anonymousMode,
              blockedBy: [],
              mutedBy: [],
              messages: []
            },
            ...state.threads
          ],
          toasts: [toast('Conversation request created.'), ...state.toasts]
        }));
        return threadId;
      },
      requestMessageConsent: (threadId) => {
        const currentUser = currentUserFrom(get());
        if (!currentUser) {
          return;
        }
        set((state) => ({
          threads: state.threads.map((thread) =>
            thread.id === threadId
              ? { ...thread, consentRequestedBy: currentUser.id }
              : thread
          ),
          toasts: [toast('Consent request sent.'), ...state.toasts]
        }));
      },
      grantMessageConsent: (threadId) => {
        set((state) => ({
          threads: state.threads.map((thread) =>
            thread.id === threadId
              ? { ...thread, consentGranted: true }
              : thread
          ),
          toasts: [toast('Messaging unlocked for this thread.'), ...state.toasts]
        }));
      },
      sendMessage: async (threadId, body, quickBoundary) => {
        const currentUser = currentUserFrom(get());
        if (!currentUser || !body.trim()) {
          return;
        }
        const encryptedBody = quickBoundary ? `plain:${body}` : await encryptMessage(body);
        set((state) => ({
          threads: state.threads.map((thread) =>
            thread.id === threadId
              ? {
                  ...thread,
                  messages: [
                    ...thread.messages,
                    {
                      id: createId('msg'),
                      senderId: currentUser.id,
                      encryptedBody,
                      createdAt: new Date().toISOString(),
                      quickBoundary
                    }
                  ]
                }
              : thread
          )
        }));
      },
      muteThread: (threadId) => {
        const currentUser = currentUserFrom(get());
        if (!currentUser) {
          return;
        }
        set((state) => ({
          users: updateUser(state.users, currentUser.id, (user) => ({
            ...user,
            mutedThreadIds: user.mutedThreadIds.includes(threadId)
              ? user.mutedThreadIds.filter((id) => id !== threadId)
              : [...user.mutedThreadIds, threadId]
          })),
          threads: state.threads.map((thread) =>
            thread.id === threadId
              ? {
                  ...thread,
                  mutedBy: thread.mutedBy.includes(currentUser.id)
                    ? thread.mutedBy.filter((id) => id !== currentUser.id)
                    : [...thread.mutedBy, currentUser.id]
                }
              : thread
          ),
          toasts: [toast('Thread mute updated.'), ...state.toasts]
        }));
      },
      blockUser: (userId) => {
        const currentUser = currentUserFrom(get());
        if (!currentUser) {
          return;
        }
        set((state) => ({
          users: updateUser(state.users, currentUser.id, (user) => ({
            ...user,
            blockedUserIds: user.blockedUserIds.includes(userId)
              ? user.blockedUserIds
              : [...user.blockedUserIds, userId]
          })),
          toasts: [toast('User blocked.'), ...state.toasts]
        }));
      },
      markNotificationRead: (notificationId) => {
        set((state) => ({
          notifications: state.notifications.map((item) =>
            item.id === notificationId ? { ...item, read: true } : item
          )
        }));
      },
      clearAllNotifications: () => {
        const currentUser = currentUserFrom(get());
        if (!currentUser) {
          return;
        }
        set((state) => ({
          notifications: state.notifications.filter((item) => item.userId !== currentUser.id),
          toasts: [toast('Notifications cleared.'), ...state.toasts]
        }));
      },
      createReport: (payload) => {
        const currentUser = currentUserFrom(get());
        if (!currentUser) {
          return;
        }
        set((state) => ({
          reports: [
            {
              id: createId('report'),
              reporterId: currentUser.id,
              subjectType: payload.subjectType,
              subjectId: payload.subjectId,
              category: payload.category,
              details: payload.details,
              createdAt: new Date().toISOString(),
              status: 'New'
            },
            ...state.reports
          ],
          notifications: [
            notification(
              currentUser.id,
              'safety',
              'Report received',
              'Thanks for helping keep HobbySwap safer. Moderators will review this shortly.',
              '/app/moderation'
            ),
            ...state.notifications
          ],
          toasts: [toast('Report submitted.'), ...state.toasts]
        }));
      },
      quickMatch: () => {
        const currentUser = currentUserFrom(get());
        if (!currentUser) {
          return;
        }
        set((state) => ({
          quickMatches: buildQuickMatches(currentUser, state.users, state.hobbies),
          toasts: [toast('Fresh matches found nearby.'), ...state.toasts]
        }));
      },
      startMentorship: (mentorId, hobbyId) => {
        const currentUser = currentUserFrom(get());
        if (!currentUser) {
          return;
        }
        get().createContract({
          partnerId: mentorId,
          teachSkill: `Beginner accountability in ${hobbyId}`,
          learnSkill: `Peer guidance in ${hobbyId}`,
          sessions: 2,
          durationMinutes: 60,
          format: 'Hybrid',
          meetingPoint: 'Mutual safe public venue or call link',
          notes: 'Framed as peer mentorship with clear boundaries.'
        });
        set((state) => ({
          swapLog: [
            {
              id: createId('log'),
              userId: currentUser.id,
              title: 'Started a peer mentorship match',
              type: 'mentorship',
              hours: 1,
              badge: 'Asked For Support',
              happenedAt: new Date().toISOString()
            },
            ...state.swapLog
          ]
        }));
      },
      createProject: (payload) => {
        const currentUser = currentUserFrom(get());
        if (!currentUser) {
          return;
        }
        set((state) => ({
          projects: [
            {
              id: createId('project'),
              title: payload.title,
              description: payload.description,
              hobbyId: payload.hobbyId,
              ownerId: currentUser.id,
              collaboratorIds: payload.collaboratorIds,
              tasks: { todo: [], inProgress: [], done: [] },
              files: [],
              celebrationSeen: false
            },
            ...state.projects
          ],
          toasts: [toast('Project space created.'), ...state.toasts]
        }));
      },
      addProjectTask: (projectId, title) => {
        const currentUser = currentUserFrom(get());
        if (!currentUser) {
          return;
        }
        set((state) => ({
          projects: state.projects.map((project) =>
            project.id === projectId
              ? {
                  ...project,
                  tasks: {
                    ...project.tasks,
                    todo: [
                      ...project.tasks.todo,
                      { id: createId('task'), title, ownerId: currentUser.id }
                    ]
                  }
                }
              : project
          )
        }));
      },
      moveProjectTask: (projectId, taskId, lane) => {
        set((state) => ({
          projects: state.projects.map((project) => {
            if (project.id !== projectId) {
              return project;
            }

            const allTasks = [...project.tasks.todo, ...project.tasks.inProgress, ...project.tasks.done];
            const task = allTasks.find((item) => item.id === taskId);
            if (!task) {
              return project;
            }

            const nextTasks = {
              todo: project.tasks.todo.filter((item) => item.id !== taskId),
              inProgress: project.tasks.inProgress.filter((item) => item.id !== taskId),
              done: project.tasks.done.filter((item) => item.id !== taskId)
            };
            nextTasks[lane] = [...nextTasks[lane], task];

            return { ...project, tasks: nextTasks };
          })
        }));
      },
      addProjectFile: (projectId, name, url) => {
        set((state) => ({
          projects: state.projects.map((project) =>
            project.id === projectId
              ? {
                  ...project,
                  files: [...project.files, { id: createId('file'), name, url }]
                }
              : project
          ),
          toasts: [toast('Project file shared.'), ...state.toasts]
        }));
      },
      markProjectCelebrationSeen: (projectId) => {
        set((state) => ({
          projects: state.projects.map((project) =>
            project.id === projectId ? { ...project, celebrationSeen: true } : project
          )
        }));
      },
      createVideoPost: (payload) => {
        const currentUser = currentUserFrom(get());
        if (!currentUser) {
          return;
        }
        if (payload.durationSeconds > 180) {
          set((state) => ({
            toasts: [toast('Videos should stay under 3 minutes.', 'warning'), ...state.toasts]
          }));
          return;
        }
        set((state) => ({
          videos: [
            {
              id: createId('video'),
              ownerId: currentUser.id,
              title: payload.title,
              url: payload.url,
              thumbnail: payload.thumbnail,
              hobbyId: payload.hobbyId,
              skillLevel: payload.skillLevel,
              format: payload.format,
              durationSeconds: payload.durationSeconds,
              comments: [],
              reportedBy: []
            },
            ...state.videos
          ],
          toasts: [toast('Video shared.'), ...state.toasts]
        }));
      },
      addVideoComment: (videoId, body) => {
        const currentUser = currentUserFrom(get());
        if (!currentUser || !body.trim()) {
          return;
        }
        set((state) => ({
          videos: state.videos.map((video) =>
            video.id === videoId
              ? {
                  ...video,
                  comments: [
                    ...video.comments,
                    {
                      id: createId('comment'),
                      userId: currentUser.id,
                      body,
                      createdAt: new Date().toISOString(),
                      moderated: true
                    }
                  ]
                }
              : video
          ),
          toasts: [toast('Comment added.'), ...state.toasts]
        }));
      },
      requestVerification: (type) => {
        const currentUser = currentUserFrom(get());
        if (!currentUser) {
          return;
        }
        set((state) => ({
          users: updateUser(state.users, currentUser.id, (user) => ({
            ...user,
            verifiedPhone: type === 'phone' ? true : user.verifiedPhone,
            verifiedLocalId: type === 'local-id' ? true : user.verifiedLocalId
          })),
          toasts: [toast(type === 'phone' ? 'Phone verified.' : 'Local ID verified.'), ...state.toasts]
        }));
      },
      dismissToast: (toastId) =>
        set((state) => ({
          toasts: state.toasts.filter((entry) => entry.id !== toastId)
        })),
      deleteAccount: () => {
        const currentUser = currentUserFrom(get());
        if (!currentUser) {
          return;
        }
        set((state) => ({
          users: state.users.filter((user) => user.id !== currentUser.id),
          currentUserId: null,
          notifications: state.notifications.filter((item) => item.userId !== currentUser.id),
          toasts: [toast('Account deleted and local session cleared.'), ...state.toasts]
        }));
      },
      resetDemoData: () =>
        set({
          ...cloneSeed(),
          currentUserId: null,
          toasts: [toast('Demo data reset.')]
        })
    }),
    {
      name: 'hobbyswap-store',
      storage: createJSONStorage(() => localStorage)
    }
  )
);
