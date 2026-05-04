export type AgeGroup = '18-24' | '25-34' | '35-44' | '45+';
export type SkillLevel = 'Beginner' | 'Learning' | 'Comfortable' | 'Can Teach';
export type FormatPreference = 'In-person' | 'Hybrid' | 'Online';
export type ListingCondition = 'New' | 'Good' | 'Well-loved';
export type ListingIntent = 'teach' | 'swap' | 'workshop' | 'item';
export type PriceMode = 'free' | 'credits' | 'cash' | 'both';
export type PaymentMethod = 'GCash' | 'Maya' | 'Card' | 'PayPal' | 'Credits';
export type NotificationType =
  | 'swap-request'
  | 'challenge'
  | 'event'
  | 'listing'
  | 'message'
  | 'contract'
  | 'review'
  | 'safety'
  | 'payment'
  | 'credits';
export type ReportCategory =
  | 'Safety concern'
  | 'Spam'
  | 'Harassment'
  | 'Misleading listing'
  | 'Boundary issue'
  | 'Copyright';
export type SubjectType = 'user' | 'listing' | 'message';
export type TaskLane = 'todo' | 'inProgress' | 'done';
export type TutorialTarget = 'home' | 'discover' | 'new' | 'challenges' | 'profile' | 'log';
export type AgreementType = 'equal-swap' | 'credit-booking' | 'cash-booking' | 'workshop';
export type LedgerType =
  | 'teaching'
  | 'learning'
  | 'challenge'
  | 'review-bonus'
  | 'equal-swap'
  | 'workshop';

export interface Hobby {
  id: string;
  label: string;
  icon: string;
  color: string;
}

export interface HobbyProfile {
  hobbyId: string;
  level: SkillLevel;
}

export interface GeoPoint {
  barangay: string;
  city: string;
  lat: number;
  lng: number;
}

export interface PrivacySettings {
  visibility: 'Community' | 'Matches Only' | 'Private';
  showRealName: boolean;
  showExactLocation: boolean;
  showOnMap: boolean;
}

export interface NotificationPreferences {
  swapRequests: boolean;
  challengeReminders: boolean;
  eventReminders: boolean;
  messages: boolean;
  contractUpdates: boolean;
  digestMode: boolean;
}

export interface AccessibilitySettings {
  fontScale: 'Default' | 'Large' | 'Largest';
  theme: 'Light' | 'Dark' | 'System';
  highContrast: boolean;
  screenReaderHints: boolean;
  reduceMotion: boolean;
}

export interface Review {
  id: string;
  authorId: string;
  targetUserId: string;
  body: string;
  score: number;
  createdAt: string;
}

export interface User {
  id: string;
  realName: string;
  displayName: string;
  anonymousAlias: string;
  email: string;
  phone: string;
  password: string;
  location: GeoPoint;
  ageGroup: AgeGroup;
  bio: string;
  avatar: string;
  hobbyProfiles: HobbyProfile[];
  availability: string[];
  preferredFormats: FormatPreference[];
  anonymousMode: boolean;
  onboardingComplete: boolean;
  guideCompleted: boolean;
  trustScore: number;
  premium: boolean;
  verifiedPhone: boolean;
  verifiedLocalId: boolean;
  partnershipBadge?: 'Library' | 'School' | 'NGO' | 'Creative Space';
  privacy: PrivacySettings;
  notificationPreferences: NotificationPreferences;
  accessibility: AccessibilitySettings;
  blockedUserIds: string[];
  mutedThreadIds: string[];
  creditBalance: number;
  pendingCredits: number;
  payoutMethod: 'GCash' | 'Maya' | 'Bank' | 'PayPal';
  nextPayoutDate: string;
  savedListingIds: string[];
}

export interface ListingOffer {
  id: string;
  fromUserId: string;
  offeredItem: string;
  note: string;
  status: 'pending' | 'accepted' | 'declined';
  createdAt: string;
}

export interface MarketplaceListing {
  id: string;
  ownerId: string;
  title: string;
  description: string;
  category: string;
  hobbyId: string;
  photos: string[];
  condition: ListingCondition;
  location: GeoPoint;
  availability: string[];
  format: FormatPreference;
  level: SkillLevel;
  intent: ListingIntent;
  priceMode: PriceMode;
  creditPrice: number | null;
  cashPricePhp: number | null;
  savedBy: string[];
  offers: ListingOffer[];
  status: 'active' | 'reserved' | 'completed';
  createdAt: string;
  ratingAverage: number;
  completedSessions: number;
  swapPreference?: string;
}

export interface Transaction {
  id: string;
  listingId: string;
  buyerId: string;
  sellerId: string;
  type: 'swap' | 'sale';
  amountPhp: number;
  status: 'pending' | 'completed' | 'cancelled';
  ratingByBuyer?: number;
  ratingBySeller?: number;
  createdAt: string;
}

export interface SessionRecord {
  id: string;
  label: string;
  date: string;
  durationMinutes: number;
  status: 'scheduled' | 'completed';
}

export interface SwapContract {
  id: string;
  title: string;
  type: AgreementType;
  intent: ListingIntent;
  hobbyId: string;
  teacherId: string;
  learnerId: string;
  teachSkill: string;
  learnSkill?: string;
  sessions: number;
  durationMinutes: number;
  format: FormatPreference;
  locationLabel: string;
  availabilityGrid: string[];
  note: string;
  paymentMethod?: PaymentMethod;
  creditAmount: number;
  cashAmountPhp: number;
  platformFeePhp: number;
  teacherNetPhp: number;
  isEqualSwap: boolean;
  status: 'pending' | 'confirmed' | 'active' | 'awaiting-review' | 'completed' | 'cancelled';
  confirmedBy: string[];
  reviewLeftBy: string[];
  sessionRecords: SessionRecord[];
  createdAt: string;
  listingId?: string;
}

export interface SwapLogEntry {
  id: string;
  userId: string;
  title: string;
  type: 'learned' | 'taught' | 'challenge' | 'mentorship' | 'workshop';
  hours: number;
  badge?: string;
  happenedAt: string;
}

export interface CreditLedgerEntry {
  id: string;
  userId: string;
  delta: number;
  title: string;
  sessionType: LedgerType;
  createdAt: string;
  status: 'held' | 'posted';
  agreementId?: string;
}

export interface CashPayoutEntry {
  id: string;
  userId: string;
  title: string;
  grossPhp: number;
  feePhp: number;
  netPhp: number;
  createdAt: string;
  payoutDate: string;
  payoutMethod: User['payoutMethod'];
  status: 'held' | 'scheduled' | 'paid';
  agreementId?: string;
}

export interface ResourceItem {
  id: string;
  ownerId: string;
  title: string;
  hobbyId: string;
  description: string;
  condition: ListingCondition;
  location: GeoPoint;
  availabilityWindow: string;
  damagePolicy: string;
}

export interface Challenge {
  id: string;
  title: string;
  prompt: string;
  focus: 'Teach' | 'Swap' | 'Share';
  weekOf: string;
  creditReward: number;
  progressGoal: number;
  participantIds: string[];
  userProgress: Record<string, number>;
  rewardedUserIds: string[];
  archived: boolean;
}

export interface MessageItem {
  id: string;
  senderId: string;
  body: string;
  createdAt: string;
  quickBoundary?: boolean;
  imageUrl?: string;
}

export interface MessageThread {
  id: string;
  participantIds: string[];
  contractId?: string;
  aliasMode: boolean;
  blockedBy: string[];
  mutedBy: string[];
  messages: MessageItem[];
}

export interface NotificationItem {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  body: string;
  route: string;
  createdAt: string;
  read: boolean;
}

export interface ReportItem {
  id: string;
  reporterId: string;
  subjectType: SubjectType;
  subjectId: string;
  category: ReportCategory;
  details: string;
  createdAt: string;
  status: 'New' | 'Reviewing' | 'Resolved';
}

export interface QuickMatch {
  id: string;
  userId: string;
  matchUserId: string;
  hobbyId: string;
  reason: string;
  createdAt: string;
}

export interface Toast {
  id: string;
  tone: 'success' | 'warning' | 'error';
  message: string;
  title?: string;
  route?: string;
  actionLabel?: string;
}

export interface TutorialStep {
  id: string;
  title: string;
  body: string;
  target: TutorialTarget;
}

export interface AppData {
  hobbies: Hobby[];
  users: User[];
  reviews: Review[];
  listings: MarketplaceListing[];
  transactions: Transaction[];
  contracts: SwapContract[];
  swapLog: SwapLogEntry[];
  creditLedger: CreditLedgerEntry[];
  cashPayouts: CashPayoutEntry[];
  resources: ResourceItem[];
  challenges: Challenge[];
  threads: MessageThread[];
  notifications: NotificationItem[];
  reports: ReportItem[];
  quickMatches: QuickMatch[];
  tutorialSteps: TutorialStep[];
}
