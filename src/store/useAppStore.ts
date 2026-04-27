import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { seedData } from '@/data/seed';
import { buildQuickMatches } from '@/services/matchmaking';
import {
  AccessibilitySettings,
  AgeGroup,
  AppData,
  CreditLedgerEntry,
  FormatPreference,
  GeoPoint,
  HobbyProfile,
  ListingIntent,
  NotificationPreferences,
  PaymentMethod,
  PriceMode,
  ReportCategory,
  SubjectType,
  Toast,
  User
} from '@/types/models';
import { createAnonymousAlias } from '@/utils/aliases';
import { createId } from '@/utils/createId';
import { ACTION_HISTORY_ROUTE } from '@/utils/routes';

type SignUpPayload = {
  realName?: string;
  identifier: string;
  password: string;
  anonymousMode: boolean;
  location?: GeoPoint | null;
  ageGroup: AgeGroup;
};

type OnboardingPayload = {
  displayName: string;
  hobbyProfiles: HobbyProfile[];
  availability: string[];
  preferredFormats: FormatPreference[];
  anonymousMode: boolean;
};

type CreateListingPayload = {
  title: string;
  description: string;
  hobbyId: string;
  intent: ListingIntent;
  level: 'Beginner' | 'Learning' | 'Comfortable' | 'Can Teach';
  format: FormatPreference;
  priceMode: PriceMode;
  creditPrice: number | null;
  cashPricePhp: number | null;
  availability: string[];
  photoUrl: string;
};

type CreateSwapPayload = {
  partnerId: string;
  teachSkill: string;
  learnSkill: string;
  sessions: number;
  durationMinutes: number;
  format: FormatPreference;
  availabilityGrid: string[];
  locationLabel: string;
  equalSwap: boolean;
  creditAmount: number;
  note: string;
};

type BookSessionPayload = {
  listingId: string;
  paymentMethod: PaymentMethod;
  scheduleLabel: string;
  note: string;
};

type ReviewPayload = {
  contractId: string;
  rating: number;
  body: string;
};

type ReportPayload = {
  subjectType: SubjectType;
  subjectId: string;
  category: ReportCategory;
  details: string;
};

type ResourcePayload = {
  title: string;
  description: string;
  hobbyId: string;
  availabilityWindow: string;
  damagePolicy: string;
};

interface AppState extends AppData {
  currentUserId: string | null;
  toasts: Toast[];
  login: (identifier: string, password: string) => { ok: boolean; message: string };
  loginWithProvider: (provider: 'Google' | 'Facebook') => { ok: boolean; message: string };
  signUp: (payload: SignUpPayload) => { ok: boolean; message: string };
  completeOnboarding: (payload: OnboardingPayload) => void;
  completeGuide: () => void;
  restartGuide: () => void;
  logout: () => void;
  updateProfile: (patch: Partial<User>) => void;
  updatePrivacy: (patch: Partial<User['privacy']>) => void;
  updateNotificationPrefs: (patch: Partial<NotificationPreferences>) => void;
  updateAccessibility: (patch: Partial<AccessibilitySettings>) => void;
  togglePremium: () => void;
  requestVerification: (type: 'phone' | 'local-id') => void;
  saveListingForLater: (listingId: string, note?: string) => void;
  createListing: (payload: CreateListingPayload) => void;
  createSwapAgreement: (payload: CreateSwapPayload) => void;
  bookSession: (payload: BookSessionPayload) => void;
  markAgreementDone: (contractId: string) => void;
  leaveAgreementReview: (payload: ReviewPayload) => void;
  joinChallenge: (challengeId: string) => void;
  advanceChallenge: (challengeId: string) => void;
  addResourceItem: (payload: ResourcePayload) => void;
  startConversation: (partnerId: string, contractId?: string) => string;
  sendMessage: (threadId: string, body: string, quickBoundary?: boolean) => void;
  muteThread: (threadId: string) => void;
  blockUser: (userId: string) => void;
  createReport: (payload: ReportPayload) => void;
  markNotificationRead: (notificationId: string) => void;
  clearAllNotifications: () => void;
  dismissToast: (toastId: string) => void;
  deleteAccount: () => void;
  resetDemoData: () => void;
}

function cloneSeed(): AppData {
  return JSON.parse(JSON.stringify(seedData)) as AppData;
}

type ToastOptions = Pick<Toast, 'actionLabel' | 'route' | 'title'>;

function toast(message: string, tone: Toast['tone'] = 'success', options: ToastOptions = {}): Toast {
  return { id: createId('toast'), tone, message, ...options };
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

function addToast(
  state: AppState,
  message: string,
  tone: Toast['tone'] = 'success',
  options: ToastOptions = {}
) {
  return [toast(message, tone, options), ...state.toasts].slice(0, 4);
}

function nextIso(days: number, hour = 10) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  date.setHours(hour, 0, 0, 0);
  return date.toISOString();
}

function sessionTemplate(count: number, durationMinutes: number, startDay = 3) {
  return Array.from({ length: count }, (_, index) => ({
    id: createId('session'),
    label: `Session ${index + 1}`,
    date: nextIso(startDay + index * 7),
    durationMinutes,
    status: 'scheduled' as const
  }));
}

function releaseHeldCredits(
  users: User[],
  creditLedger: CreditLedgerEntry[],
  teacherId: string,
  agreementId: string
) {
  const heldAmount = creditLedger
    .filter(
      (entry) =>
        entry.userId === teacherId &&
        entry.agreementId === agreementId &&
        entry.status === 'held'
    )
    .reduce((sum, entry) => sum + entry.delta, 0);

  return {
    users: updateUser(users, teacherId, (user) => ({
      ...user,
      creditBalance: user.creditBalance + heldAmount,
      pendingCredits: Math.max(0, user.pendingCredits - heldAmount)
    })),
    creditLedger: creditLedger.map((entry) =>
      entry.agreementId === agreementId ? { ...entry, status: 'posted' as const } : entry
    )
  };
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      ...cloneSeed(),
      currentUserId: null,
      toasts: [],
      login: (identifier, password) => {
        const normalized = identifier.trim().toLowerCase();
        const user = get().users.find(
          (entry) =>
            (entry.email.toLowerCase() === normalized || entry.phone === identifier.trim()) &&
            entry.password === password
        );

        if (!user) {
          set((state) => ({
            toasts: addToast(state, 'We could not match that login. Try the demo account or sign up.', 'error')
          }));
          return { ok: false, message: 'Invalid credentials.' };
        }

        set((state) => ({
          currentUserId: user.id,
          toasts: addToast(state, `Welcome back, ${user.displayName}.`)
        }));

        return { ok: true, message: 'Logged in.' };
      },
      loginWithProvider: (provider) => {
        const email = provider === 'Google' ? 'google.friend@hobbyswap.app' : 'facebook.friend@hobbyswap.app';
        const existing = get().users.find((user) => user.email === email);

        if (existing) {
          set((state) => ({
            currentUserId: existing.id,
            toasts: addToast(state, `Signed in with ${provider}.`)
          }));
          return { ok: true, message: 'Signed in.' };
        }

        const userId = createId('user');
        const alias = createAnonymousAlias(userId);
        const newUser: User = {
          id: userId,
          realName: `${provider} Friend`,
          displayName: `${provider} Friend`,
          anonymousAlias: alias,
          email,
          phone: '09999999999',
          password: 'SocialLogin9',
          location: { barangay: 'Poblacion', city: 'Makati', lat: 14.5656, lng: 121.0292 },
          ageGroup: '25-34',
          bio: 'New here and looking for gentle ways into local hobbies.',
          avatar: provider === 'Google' ? '#ef8b5a' : '#5a73c8',
          hobbyProfiles: [],
          availability: [],
          preferredFormats: ['Hybrid'],
          anonymousMode: false,
          onboardingComplete: false,
          guideCompleted: false,
          trustScore: 60,
          premium: false,
          verifiedPhone: false,
          verifiedLocalId: false,
          privacy: {
            visibility: 'Matches Only',
            showRealName: false,
            showExactLocation: false,
            showOnMap: true
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
          mutedThreadIds: [],
          creditBalance: 40,
          pendingCredits: 0,
          payoutMethod: 'GCash',
          nextPayoutDate: nextIso(7),
          savedListingIds: []
        };

        set((state) => ({
          users: [newUser, ...state.users],
          currentUserId: userId,
          toasts: addToast(state, `Signed in with ${provider}.`)
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
            toasts: addToast(state, 'That email or phone is already connected to an account.', 'error')
          }));
          return { ok: false, message: 'Account already exists.' };
        }

        const userId = createId('user');
        const isEmail = normalized.includes('@');
        const alias = createAnonymousAlias(userId);
        const fallbackLocation = payload.location ?? {
          barangay: 'Poblacion',
          city: 'Makati',
          lat: 14.5656,
          lng: 121.0292
        };
        const preferredName = payload.realName?.trim() || '';
        const newUser: User = {
          id: userId,
          realName: preferredName || alias,
          displayName: payload.anonymousMode ? alias : preferredName.split(' ')[0] ?? preferredName,
          anonymousAlias: alias,
          email: isEmail ? normalized : `${userId}@hobbyswap.app`,
          phone: isEmail ? '09170000000' : payload.identifier.trim(),
          password: payload.password,
          location: fallbackLocation,
          ageGroup: payload.ageGroup,
          bio: 'New to HobbySwap and open to swaps, workshops, and gentle skill-sharing.',
          avatar: '#103b39',
          hobbyProfiles: [],
          availability: [],
          preferredFormats: ['Hybrid'],
          anonymousMode: payload.anonymousMode,
          onboardingComplete: false,
          guideCompleted: false,
          trustScore: 58,
          premium: false,
          verifiedPhone: !isEmail,
          verifiedLocalId: false,
          privacy: {
            visibility: 'Matches Only',
            showRealName: false,
            showExactLocation: false,
            showOnMap: true
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
          mutedThreadIds: [],
          creditBalance: 35,
          pendingCredits: 0,
          payoutMethod: 'GCash',
          nextPayoutDate: nextIso(7),
          savedListingIds: []
        };

        set((state) => ({
          users: [newUser, ...state.users],
          currentUserId: userId,
          notifications: [
            notification(
              userId,
              'credits',
              'You start with 35 welcome credits',
              'Use them for your first session if you do not have a direct skill swap ready yet.',
              '/app/home'
            ),
            ...state.notifications
          ],
          toasts: addToast(state, 'Account created. Let’s tailor your first week.')
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
            displayName: payload.anonymousMode
              ? user.anonymousAlias
              : payload.displayName.trim() || user.displayName,
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
              displayName: payload.anonymousMode
                ? currentUser.anonymousAlias
                : payload.displayName.trim() || currentUser.displayName,
              hobbyProfiles: payload.hobbyProfiles,
              availability: payload.availability,
              preferredFormats: payload.preferredFormats
            },
            state.users,
            state.hobbies
          ),
          toasts: addToast(state, 'Your dashboard is ready.')
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
      restartGuide: () => {
        const currentUser = currentUserFrom(get());
        if (!currentUser) {
          return;
        }

        set((state) => ({
          users: updateUser(state.users, currentUser.id, (user) => ({
            ...user,
            guideCompleted: false
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
          toasts: addToast(state, 'Profile updated.')
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
          toasts: addToast(state, 'Privacy settings saved.')
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
          toasts: addToast(state, 'Notification preferences updated.')
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
            accessibility: {
              ...user.accessibility,
              ...patch
            }
          })),
          toasts: addToast(state, 'Accessibility preferences updated.')
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
          toasts: addToast(state, currentUser.premium ? 'Premium paused.' : 'Premium enabled.')
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
          toasts: addToast(state, type === 'phone' ? 'Phone verified.' : 'Local ID verified.')
        }));
      },
      saveListingForLater: (listingId) => {
        const currentUser = currentUserFrom(get());
        if (!currentUser) {
          return;
        }

        set((state) => ({
          users: updateUser(state.users, currentUser.id, (user) => ({
            ...user,
            savedListingIds: user.savedListingIds.includes(listingId)
              ? user.savedListingIds
              : [...user.savedListingIds, listingId]
          })),
          listings: state.listings.map((listing) =>
            listing.id === listingId
              ? {
                  ...listing,
                  savedBy: listing.savedBy.includes(currentUser.id)
                    ? listing.savedBy
                    : [...listing.savedBy, currentUser.id]
                }
              : listing
          ),
          toasts: addToast(state, 'Saved to your shortlist.')
        }));
      },
      createListing: (payload) => {
        const currentUser = currentUserFrom(get());
        if (!currentUser) {
          return;
        }

        const listingTitle = payload.title.trim() || 'Untitled listing';

        set((state) => ({
          listings: [
            {
              id: createId('listing'),
              ownerId: currentUser.id,
              title: listingTitle,
              description: payload.description,
              category:
                payload.intent === 'workshop'
                  ? 'Workshop'
                  : payload.intent === 'item'
                    ? 'Marketplace Item'
                    : 'Teacher Listing',
              hobbyId: payload.hobbyId,
              photos: [
                payload.photoUrl ||
                  'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80'
              ],
              condition: 'Good',
              location: currentUser.location,
              availability: payload.availability,
              format: payload.format,
              level: payload.level,
              intent: payload.intent,
              priceMode: payload.priceMode,
              creditPrice: payload.creditPrice,
              cashPricePhp: payload.cashPricePhp,
              savedBy: [],
              offers: [],
              status: 'active',
              createdAt: new Date().toISOString(),
              ratingAverage: 5,
              completedSessions: 0
            },
            ...state.listings
          ],
          notifications: [
            notification(
              currentUser.id,
              'listing',
              'Listing published',
              `${listingTitle} is now live and ready for ${payload.intent === 'item' ? 'buyer messages or saves' : 'bookings or swap offers'}.`,
              ACTION_HISTORY_ROUTE
            ),
            ...state.notifications
          ],
          toasts: addToast(
            state,
            'Listing published. You can open your full activity trail from here.',
            'success',
            {
              title: 'Listing live',
              route: ACTION_HISTORY_ROUTE
            }
          )
        }));
      },
      createSwapAgreement: (payload) => {
        const currentUser = currentUserFrom(get());
        if (!currentUser) {
          return;
        }

        const contractId = createId('contract');
        const records = sessionTemplate(payload.sessions, payload.durationMinutes);

        set((state) => ({
          contracts: [
            {
              id: contractId,
              title: `${payload.teachSkill} ↔ ${payload.learnSkill}`,
              type: payload.equalSwap ? 'equal-swap' : 'credit-booking',
              intent: 'swap',
              hobbyId: currentUser.hobbyProfiles[0]?.hobbyId ?? state.hobbies[0].id,
              teacherId: currentUser.id,
              learnerId: payload.partnerId,
              teachSkill: payload.teachSkill,
              learnSkill: payload.learnSkill,
              sessions: payload.sessions,
              durationMinutes: payload.durationMinutes,
              format: payload.format,
              locationLabel: payload.locationLabel,
              availabilityGrid: payload.availabilityGrid,
              note: payload.equalSwap
                ? `${payload.note} Equal swap — no credits needed.`
                : `${payload.note} Credit-based swap — ${payload.creditAmount} credits.`,
              creditAmount: payload.equalSwap ? 0 : payload.creditAmount,
              cashAmountPhp: 0,
              platformFeePhp: 0,
              teacherNetPhp: 0,
              isEqualSwap: payload.equalSwap,
              status: 'active',
              confirmedBy: [currentUser.id, payload.partnerId],
              reviewLeftBy: [],
              sessionRecords: records,
              createdAt: new Date().toISOString()
            },
            ...state.contracts
          ],
          notifications: [
            notification(
              payload.partnerId,
              'contract',
              'New swap agreement ready',
              payload.equalSwap
                ? 'This swap is clearly labeled as equal, so no credits are needed.'
                : 'A credit-based swap agreement is ready for review.',
              ACTION_HISTORY_ROUTE
            ),
            notification(
              currentUser.id,
              'contract',
              'Swap agreement created',
              `Your ${payload.equalSwap ? 'equal' : 'credit-based'} swap is now part of your activity history.`,
              ACTION_HISTORY_ROUTE
            ),
            ...state.notifications
          ],
          toasts: addToast(
            state,
            'Swap agreement created. Tap to review the full action history.',
            'success',
            {
              title: 'Swap ready',
              route: ACTION_HISTORY_ROUTE
            }
          )
        }));
      },
      bookSession: (payload) => {
        const currentUser = currentUserFrom(get());
        if (!currentUser) {
          return;
        }

        const listing = get().listings.find((entry) => entry.id === payload.listingId);
        if (!listing) {
          return;
        }

        const contractId = createId('contract');
        const teacherId = listing.ownerId;
        const creditAmount = payload.paymentMethod === 'Credits' ? listing.creditPrice ?? 0 : 0;
        const cashAmountPhp = payload.paymentMethod === 'Credits' ? 0 : listing.cashPricePhp ?? 0;
        const platformFeePhp = cashAmountPhp > 0 ? Number((cashAmountPhp * 0.09).toFixed(2)) : 0;
        const teacherNetPhp = Number((cashAmountPhp - platformFeePhp).toFixed(2));
        const record = [
          {
            id: createId('session'),
            label: payload.scheduleLabel || 'Scheduled session',
            date: nextIso(4),
            durationMinutes: 75,
            status: 'scheduled' as const
          }
        ];

        set((state) => {
          let nextUsers = state.users;
          let nextLedger = state.creditLedger;
          let nextCashPayouts = state.cashPayouts;

          if (creditAmount > 0) {
            nextUsers = updateUser(nextUsers, currentUser.id, (user) => ({
              ...user,
              creditBalance: user.creditBalance - creditAmount
            }));
            nextUsers = updateUser(nextUsers, teacherId, (user) => ({
              ...user,
              pendingCredits: user.pendingCredits + creditAmount
            }));
            nextLedger = [
              {
                id: createId('ledger'),
                userId: currentUser.id,
                delta: -creditAmount,
                title: listing.title,
                sessionType: listing.intent === 'workshop' ? 'workshop' : 'learning',
                createdAt: new Date().toISOString(),
                status: 'held',
                agreementId: contractId
              },
              {
                id: createId('ledger'),
                userId: teacherId,
                delta: creditAmount,
                title: listing.title,
                sessionType: 'teaching',
                createdAt: new Date().toISOString(),
                status: 'held',
                agreementId: contractId
              },
              ...nextLedger
            ];
          }

          if (cashAmountPhp > 0) {
            nextCashPayouts = [
              {
                id: createId('cash'),
                userId: teacherId,
                title: listing.title,
                grossPhp: cashAmountPhp,
                feePhp: platformFeePhp,
                netPhp: teacherNetPhp,
                createdAt: new Date().toISOString(),
                payoutDate: nextIso(5, 9),
                payoutMethod:
                  state.users.find((user) => user.id === teacherId)?.payoutMethod ?? 'GCash',
                status: 'held',
                agreementId: contractId
              },
              ...nextCashPayouts
            ];
          }

          return {
            users: nextUsers,
            creditLedger: nextLedger,
            cashPayouts: nextCashPayouts,
            contracts: [
              {
                id: contractId,
                title: listing.title,
                type:
                  listing.intent === 'workshop'
                    ? payload.paymentMethod === 'Credits'
                      ? 'workshop'
                      : 'cash-booking'
                    : payload.paymentMethod === 'Credits'
                      ? 'credit-booking'
                      : 'cash-booking',
                intent: listing.intent,
                hobbyId: listing.hobbyId,
                teacherId,
                learnerId: currentUser.id,
                teachSkill: listing.title,
                sessions: 1,
                durationMinutes: 75,
                format: listing.format,
                locationLabel: `${listing.location.barangay}, ${listing.location.city}`,
                availabilityGrid: listing.availability,
                note: payload.note,
                paymentMethod: payload.paymentMethod,
                creditAmount,
                cashAmountPhp,
                platformFeePhp,
                teacherNetPhp,
                isEqualSwap: false,
                status: 'active',
                confirmedBy: [currentUser.id, teacherId],
                reviewLeftBy: [],
                sessionRecords: record,
                createdAt: new Date().toISOString(),
                listingId: listing.id
              },
              ...state.contracts
            ],
            notifications: [
              notification(
                teacherId,
                'contract',
                'New booking confirmed',
                payload.paymentMethod === 'Credits'
                  ? `${currentUser.displayName} booked ${listing.title} with credits held in escrow.`
                  : `${currentUser.displayName} booked ${listing.title}. Cash is being held in escrow.`,
                ACTION_HISTORY_ROUTE
              ),
              notification(
                currentUser.id,
                payload.paymentMethod === 'Credits' ? 'credits' : 'payment',
                payload.paymentMethod === 'Credits' ? 'Credits held in escrow' : 'Booking confirmed',
                payload.paymentMethod === 'Credits'
                  ? `${creditAmount} credits are being held until the session is confirmed complete.`
                  : `You paid ${cashAmountPhp} PHP. The teacher receives ${teacherNetPhp} PHP after the 9% platform fee.`,
                ACTION_HISTORY_ROUTE
              ),
              ...state.notifications
            ],
            toasts: addToast(
              state,
              'Booking confirmed. Tap to open the full payment and action history.',
              'success',
              {
                title: payload.paymentMethod === 'Credits' ? 'Credits held' : 'Payment recorded',
                route: ACTION_HISTORY_ROUTE
              }
            )
          };
        });
      },
      markAgreementDone: (contractId) => {
        const currentUser = currentUserFrom(get());
        if (!currentUser) {
          return;
        }

        set((state) => {
          const contract = state.contracts.find((entry) => entry.id === contractId);
          if (!contract) {
            return state;
          }

          const nextContracts = state.contracts.map((entry) => {
            if (entry.id !== contractId) {
              return entry;
            }

            const nextSessions = entry.sessionRecords.map((session, index) =>
              session.status === 'scheduled' && index === entry.sessionRecords.findIndex((item) => item.status === 'scheduled')
                ? { ...session, status: 'completed' as const }
                : session
            );
            const finished = nextSessions.every((session) => session.status === 'completed');

            return {
              ...entry,
              sessionRecords: nextSessions,
              status: finished ? ('awaiting-review' as const) : ('active' as const)
            };
          });

          let nextUsers = state.users;
          let nextLedger = state.creditLedger;
          let nextCashPayouts = state.cashPayouts;

          const updatedContract = nextContracts.find((entry) => entry.id === contractId)!;
          const finished = updatedContract.sessionRecords.every((session) => session.status === 'completed');

          if (finished && contract.creditAmount > 0) {
            const released = releaseHeldCredits(nextUsers, nextLedger, contract.teacherId, contractId);
            nextUsers = released.users;
            nextLedger = released.creditLedger;
          }

          if (finished && contract.cashAmountPhp > 0) {
            nextCashPayouts = state.cashPayouts.map((entry) =>
              entry.agreementId === contractId ? { ...entry, status: 'scheduled' } : entry
            );
          }

          return {
            contracts: nextContracts,
            users: nextUsers,
            creditLedger: nextLedger,
            cashPayouts: nextCashPayouts,
            swapLog: [
              {
                id: createId('log'),
                userId: currentUser.id,
                title: `Marked ${contract.title} as done`,
                type: contract.intent === 'workshop' ? 'workshop' : 'learned',
                hours: updatedContract.durationMinutes / 60,
                happenedAt: new Date().toISOString()
              },
              ...state.swapLog
            ],
            notifications: [
              notification(
                contract.teacherId,
                'contract',
                'Session marked done',
                finished
                  ? 'The session is complete. Reviews can now release final rewards or payout scheduling.'
                  : 'One session was marked complete.',
                ACTION_HISTORY_ROUTE
              ),
              notification(
                currentUser.id,
                'contract',
                finished ? 'Session complete' : 'Session progress updated',
                finished
                  ? 'Your completed session now appears in the action history with the payout and review steps.'
                  : 'The session progress was added to your action history.',
                ACTION_HISTORY_ROUTE
              ),
              ...state.notifications
            ],
            toasts: addToast(
              state,
              finished ? 'Session complete. Review is ready.' : 'Progress updated.',
              'success',
              {
                title: finished ? 'Session finished' : 'Progress saved',
                route: ACTION_HISTORY_ROUTE
              }
            )
          };
        });
      },
      leaveAgreementReview: ({ contractId, rating, body }) => {
        const currentUser = currentUserFrom(get());
        if (!currentUser) {
          return;
        }

        set((state) => {
          const contract = state.contracts.find((entry) => entry.id === contractId);
          if (!contract) {
            return state;
          }

          const targetUserId =
            contract.learnerId === currentUser.id ? contract.teacherId : contract.learnerId;

          let nextUsers = state.users;
          let nextLedger = state.creditLedger;

          if (rating === 5) {
            nextUsers = updateUser(nextUsers, targetUserId, (user) => ({
              ...user,
              creditBalance: user.creditBalance + 5
            }));
            nextLedger = [
              {
                id: createId('ledger'),
                userId: targetUserId,
                delta: 5,
                title: '5-star review bonus',
                sessionType: 'review-bonus',
                createdAt: new Date().toISOString(),
                status: 'posted' as const,
                agreementId: contractId
              },
              ...nextLedger
            ];
          }

          return {
            users: nextUsers,
            creditLedger: nextLedger,
            reviews: [
              {
                id: createId('review'),
                authorId: currentUser.id,
                targetUserId,
                body,
                score: rating,
                createdAt: new Date().toISOString()
              },
              ...state.reviews
            ],
            contracts: state.contracts.map((entry) =>
              entry.id === contractId
                ? {
                    ...entry,
                    reviewLeftBy: Array.from(new Set([...entry.reviewLeftBy, currentUser.id])),
                    status: 'completed' as const
                  }
                : entry
            ),
            listings: state.listings.map((listing) =>
              listing.id === contract.listingId
                ? {
                    ...listing,
                    ratingAverage: Number(
                      (
                        (listing.ratingAverage * listing.completedSessions + rating) /
                        (listing.completedSessions + 1)
                      ).toFixed(2)
                    ),
                    completedSessions: listing.completedSessions + 1
                  }
                : listing
            ),
            notifications: [
              notification(
                targetUserId,
                rating === 5 ? 'credits' : 'review',
                rating === 5 ? 'You earned a review bonus' : 'New review received',
                rating === 5
                  ? 'A 5-star review added +5 credits to your balance.'
                  : 'A new review was added to your profile.',
                ACTION_HISTORY_ROUTE
              ),
              notification(
                currentUser.id,
                'review',
                'Review sent',
                'Your review was added to the shared action history for this exchange.',
                ACTION_HISTORY_ROUTE
              ),
              ...state.notifications
            ],
            toasts: addToast(
              state,
              rating === 5 ? 'Review sent and bonus applied.' : 'Review sent.',
              'success',
              {
                title: 'Review saved',
                route: ACTION_HISTORY_ROUTE
              }
            )
          };
        });
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
          toasts: addToast(state, 'Challenge joined.', 'success', {
            title: 'Challenge added',
            route: ACTION_HISTORY_ROUTE
          })
        }));
      },
      advanceChallenge: (challengeId) => {
        const currentUser = currentUserFrom(get());
        if (!currentUser) {
          return;
        }

        set((state) => {
          const challenge = state.challenges.find((entry) => entry.id === challengeId);
          if (!challenge) {
            return state;
          }

          const currentProgress = challenge.userProgress[currentUser.id] ?? 0;
          const nextProgress = Math.min(challenge.progressGoal, currentProgress + 1);
          const completedNow =
            nextProgress === challenge.progressGoal &&
            !challenge.rewardedUserIds.includes(currentUser.id);

          return {
            users: completedNow
              ? updateUser(state.users, currentUser.id, (user) => ({
                  ...user,
                  creditBalance: user.creditBalance + challenge.creditReward
                }))
              : state.users,
            creditLedger: completedNow
              ? [
                  {
                    id: createId('ledger'),
                    userId: currentUser.id,
                    delta: challenge.creditReward,
                    title: challenge.title,
                    sessionType: 'challenge',
                    createdAt: new Date().toISOString(),
                    status: 'posted'
                  },
                  ...state.creditLedger
                ]
              : state.creditLedger,
            challenges: state.challenges.map((entry) =>
              entry.id === challengeId
                ? {
                    ...entry,
                    participantIds: Array.from(new Set([...entry.participantIds, currentUser.id])),
                    userProgress: {
                      ...entry.userProgress,
                      [currentUser.id]: nextProgress
                    },
                    rewardedUserIds: completedNow
                      ? [...entry.rewardedUserIds, currentUser.id]
                      : entry.rewardedUserIds
                  }
                : entry
            ),
            toasts: addToast(
              state,
              completedNow
                ? `Challenge completed. +${challenge.creditReward} credits added.`
                : 'Challenge progress updated.',
              'success',
              {
                title: completedNow ? 'Challenge reward added' : 'Challenge updated',
                route: ACTION_HISTORY_ROUTE
              }
            )
          };
        });
      },
      addResourceItem: (payload) => {
        const currentUser = currentUserFrom(get());
        if (!currentUser) {
          return;
        }

        set((state) => ({
          resources: [
            {
              id: createId('resource'),
              ownerId: currentUser.id,
              title: payload.title,
              hobbyId: payload.hobbyId,
              description: payload.description,
              condition: 'Good',
              location: currentUser.location,
              availabilityWindow: payload.availabilityWindow,
              damagePolicy: payload.damagePolicy
            },
            ...state.resources
          ],
          toasts: addToast(state, 'Resource added to your library.', 'success', {
            title: 'Resource saved',
            route: ACTION_HISTORY_ROUTE
          })
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
              aliasMode: currentUser.anonymousMode,
              blockedBy: [],
              mutedBy: [],
              messages: []
            },
            ...state.threads
          ],
          toasts: addToast(state, 'Conversation ready.')
        }));
        return threadId;
      },
      sendMessage: (threadId, body, quickBoundary) => {
        const currentUser = currentUserFrom(get());
        if (!currentUser || !body.trim()) {
          return;
        }

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
                      body,
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
          toasts: addToast(state, 'Thread mute updated.')
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
          toasts: addToast(state, 'User blocked.')
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
          toasts: addToast(state, 'Report submitted.')
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
          toasts: addToast(state, 'Notifications cleared.')
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
          toasts: addToast(state, 'Account deleted and local session cleared.')
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
      name: 'hobbyswap-store-v2',
      storage: createJSONStorage(() => localStorage)
    }
  )
);
