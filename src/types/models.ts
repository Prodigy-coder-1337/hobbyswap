export type AgeGroup = '18-24' | '25-34' | '35-44' | '45+';
export type SkillLevel = 'Beginner' | 'Learning' | 'Comfortable' | 'Can Teach';
export type FormatPreference = 'In-person' | 'Hybrid' | 'Online';
export type ListingCondition = 'New' | 'Good' | 'Well-loved';
export type NotificationType =
  | 'swap-request'
  | 'challenge'
  | 'event'
  | 'message'
  | 'contract'
  | 'safety';
export type ReportCategory =
  | 'Safety concern'
  | 'Spam'
  | 'Harassment'
  | 'Misleading listing'
  | 'Boundary issue'
  | 'Copyright';
export type SubjectType = 'user' | 'listing' | 'video' | 'message' | 'event';
export type TaskLane = 'todo' | 'inProgress' | 'done';
export type TutorialTarget =
  | 'home'
  | 'discover'
  | 'swap'
  | 'events'
  | 'profile'
  | 'messages';

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
  swapPreference: string;
  pricePhp: number | null;
  location: GeoPoint;
  availability: string;
  mode: 'swap' | 'sale' | 'both';
  savedBy: string[];
  offers: ListingOffer[];
  status: 'active' | 'reserved' | 'completed';
  createdAt: string;
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
  initiatorId: string;
  partnerId: string;
  teachSkill: string;
  learnSkill: string;
  sessions: number;
  durationMinutes: number;
  format: FormatPreference;
  meetingPoint: string;
  videoLink?: string;
  notes: string[];
  milestones: string[];
  status: 'pending' | 'active' | 'completed' | 'disputed' | 'cancelled';
  confirmedBy: string[];
  sessionRecords: SessionRecord[];
  createdAt: string;
}

export interface SwapLogEntry {
  id: string;
  userId: string;
  title: string;
  type: 'learned' | 'taught' | 'event' | 'challenge' | 'mentorship';
  hours: number;
  badge?: string;
  happenedAt: string;
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
  reservation?: {
    userId: string;
    acceptedPolicy: boolean;
    status: 'reserved' | 'returned';
  };
}

export interface ChallengeEntry {
  id: string;
  userId: string;
  partnerId?: string;
  mediaType: 'photo' | 'video' | 'text';
  caption: string;
  mediaUrl?: string;
  createdAt: string;
  voters: string[];
}

export interface Challenge {
  id: string;
  title: string;
  prompt: string;
  weekOf: string;
  hobbyId: string;
  entries: ChallengeEntry[];
  participantIds: string[];
  archived: boolean;
}

export interface EventItem {
  id: string;
  hostId: string;
  title: string;
  description: string;
  date: string;
  time: string;
  format: FormatPreference;
  location: GeoPoint;
  requiredSkill: SkillLevel;
  capacity: number;
  attendeeIds: string[];
  checkedInIds: string[];
  recap?: string;
  moderationStatus: 'approved' | 'pending review';
}

export interface VideoComment {
  id: string;
  userId: string;
  body: string;
  createdAt: string;
  moderated: boolean;
}

export interface VideoPost {
  id: string;
  ownerId: string;
  title: string;
  url: string;
  thumbnail: string;
  hobbyId: string;
  skillLevel: SkillLevel;
  format: FormatPreference;
  durationSeconds: number;
  comments: VideoComment[];
  reportedBy: string[];
}

export interface MessageItem {
  id: string;
  senderId: string;
  encryptedBody: string;
  createdAt: string;
  quickBoundary?: boolean;
}

export interface MessageThread {
  id: string;
  participantIds: string[];
  contractId?: string;
  consentRequestedBy?: string;
  consentGranted: boolean;
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

export interface ProjectTask {
  id: string;
  title: string;
  ownerId: string;
}

export interface ProjectFile {
  id: string;
  name: string;
  url: string;
}

export interface SharedProject {
  id: string;
  title: string;
  description: string;
  hobbyId: string;
  ownerId: string;
  collaboratorIds: string[];
  tasks: Record<TaskLane, ProjectTask[]>;
  files: ProjectFile[];
  celebrationSeen: boolean;
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
  resources: ResourceItem[];
  challenges: Challenge[];
  events: EventItem[];
  videos: VideoPost[];
  threads: MessageThread[];
  notifications: NotificationItem[];
  projects: SharedProject[];
  reports: ReportItem[];
  quickMatches: QuickMatch[];
  tutorialSteps: TutorialStep[];
}
