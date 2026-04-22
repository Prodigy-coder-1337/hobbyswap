import { AppData } from '@/types/models';

export const seedData: AppData = {
  hobbies: [
    { id: 'watercolor', label: 'Watercolor', icon: '🎨', color: '#d86c42' },
    { id: 'pottery', label: 'Pottery', icon: '🏺', color: '#9c6a48' },
    { id: 'film-photo', label: 'Film Photo', icon: '📷', color: '#7f8f6b' },
    { id: 'guitar', label: 'Guitar', icon: '🎸', color: '#d79a35' },
    { id: 'crochet', label: 'Crochet', icon: '🧶', color: '#cc5f8d' },
    { id: 'journaling', label: 'Journaling', icon: '📔', color: '#5a73c8' },
    { id: 'urban-gardening', label: 'Urban Gardening', icon: '🪴', color: '#4f8b5a' },
    { id: 'dance', label: 'Street Dance', icon: '🕺', color: '#ef8b5a' }
  ],
  users: [
    {
      id: 'user-me',
      realName: 'Mikaela Santos',
      displayName: 'Mika',
      anonymousAlias: 'Comet Mango',
      email: 'mika@hobbyswap.app',
      phone: '09171234567',
      password: 'HobbySwap9',
      location: { barangay: 'Poblacion', city: 'Makati', lat: 14.5656, lng: 121.0292 },
      ageGroup: '25-34',
      bio: 'I love low-pressure swaps, journaling circles, and creative plans that actually fit city schedules.',
      avatar: '#ef8b5a',
      hobbyProfiles: [
        { hobbyId: 'journaling', level: 'Can Teach' },
        { hobbyId: 'watercolor', level: 'Learning' },
        { hobbyId: 'urban-gardening', level: 'Comfortable' }
      ],
      availability: ['Tue evening', 'Thu evening', 'Sat morning'],
      preferredFormats: ['In-person', 'Hybrid'],
      anonymousMode: false,
      onboardingComplete: true,
      guideCompleted: true,
      trustScore: 89,
      premium: true,
      verifiedPhone: true,
      verifiedLocalId: true,
      privacy: {
        visibility: 'Community',
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
      creditBalance: 72,
      pendingCredits: 18,
      payoutMethod: 'GCash',
      nextPayoutDate: '2026-04-30T09:00:00.000Z',
      savedListingIds: ['listing-2']
    },
    {
      id: 'user-2',
      realName: 'Paolo Cruz',
      displayName: 'Paolo',
      anonymousAlias: 'Northside Fern',
      email: 'paolo@example.com',
      phone: '09181234567',
      password: 'HobbySwap9',
      location: { barangay: 'Teachers Village', city: 'Quezon City', lat: 14.6476, lng: 121.0619 },
      ageGroup: '25-34',
      bio: 'Happy to teach film basics, host slow photo walks, and trade camera practice for plant care tips.',
      avatar: '#5f8b62',
      hobbyProfiles: [
        { hobbyId: 'film-photo', level: 'Can Teach' },
        { hobbyId: 'urban-gardening', level: 'Learning' },
        { hobbyId: 'journaling', level: 'Comfortable' }
      ],
      availability: ['Wed evening', 'Fri evening', 'Sun morning'],
      preferredFormats: ['Hybrid', 'In-person'],
      anonymousMode: false,
      onboardingComplete: true,
      guideCompleted: true,
      trustScore: 92,
      premium: false,
      verifiedPhone: true,
      verifiedLocalId: false,
      privacy: {
        visibility: 'Community',
        showRealName: true,
        showExactLocation: true,
        showOnMap: true
      },
      notificationPreferences: {
        swapRequests: true,
        challengeReminders: true,
        eventReminders: true,
        messages: true,
        contractUpdates: true,
        digestMode: true
      },
      accessibility: {
        fontScale: 'Default',
        highContrast: false,
        screenReaderHints: true,
        reduceMotion: false
      },
      blockedUserIds: [],
      mutedThreadIds: [],
      creditBalance: 118,
      pendingCredits: 10,
      payoutMethod: 'Maya',
      nextPayoutDate: '2026-04-29T09:00:00.000Z',
      savedListingIds: []
    },
    {
      id: 'user-3',
      realName: 'Sam Rivera',
      displayName: 'Sam',
      anonymousAlias: 'Quiet Atlas',
      email: 'sam@example.com',
      phone: '09221234567',
      password: 'HobbySwap9',
      location: { barangay: 'Kapitolyo', city: 'Pasig', lat: 14.5716, lng: 121.0632 },
      ageGroup: '18-24',
      bio: 'Crochet circles, thrifted supplies, and beginner-safe skill swaps.',
      avatar: '#cc5f8d',
      hobbyProfiles: [
        { hobbyId: 'crochet', level: 'Can Teach' },
        { hobbyId: 'watercolor', level: 'Beginner' },
        { hobbyId: 'journaling', level: 'Comfortable' }
      ],
      availability: ['Sat afternoon', 'Sun morning'],
      preferredFormats: ['Hybrid', 'In-person'],
      anonymousMode: true,
      onboardingComplete: true,
      guideCompleted: true,
      trustScore: 85,
      premium: false,
      verifiedPhone: true,
      verifiedLocalId: true,
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
        fontScale: 'Large',
        highContrast: false,
        screenReaderHints: true,
        reduceMotion: false
      },
      blockedUserIds: [],
      mutedThreadIds: [],
      creditBalance: 54,
      pendingCredits: 0,
      payoutMethod: 'GCash',
      nextPayoutDate: '2026-05-01T09:00:00.000Z',
      savedListingIds: ['listing-1']
    },
    {
      id: 'user-4',
      realName: 'Jules Bautista',
      displayName: 'Jules',
      anonymousAlias: 'Amber Transit',
      email: 'jules@example.com',
      phone: '09351234567',
      password: 'HobbySwap9',
      location: { barangay: 'Malate', city: 'Manila', lat: 14.5692, lng: 120.9912 },
      ageGroup: '25-34',
      bio: 'I host warm-up jam sessions and low-pressure beginner workshops near the bay.',
      avatar: '#d79a35',
      hobbyProfiles: [
        { hobbyId: 'guitar', level: 'Can Teach' },
        { hobbyId: 'dance', level: 'Learning' }
      ],
      availability: ['Thu evening', 'Sat evening'],
      preferredFormats: ['In-person', 'Hybrid'],
      anonymousMode: false,
      onboardingComplete: true,
      guideCompleted: true,
      trustScore: 95,
      premium: true,
      verifiedPhone: true,
      verifiedLocalId: true,
      partnershipBadge: 'School',
      privacy: {
        visibility: 'Community',
        showRealName: true,
        showExactLocation: true,
        showOnMap: true
      },
      notificationPreferences: {
        swapRequests: true,
        challengeReminders: false,
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
      creditBalance: 140,
      pendingCredits: 15,
      payoutMethod: 'PayPal',
      nextPayoutDate: '2026-04-28T09:00:00.000Z',
      savedListingIds: []
    }
  ],
  reviews: [
    {
      id: 'review-1',
      authorId: 'user-2',
      targetUserId: 'user-me',
      body: 'Mika kept the session structured and kind, with good follow-through after.',
      score: 5,
      createdAt: '2026-04-19T08:00:00.000Z'
    },
    {
      id: 'review-2',
      authorId: 'user-3',
      targetUserId: 'user-me',
      body: 'Clear communication, gentle pacing, and a very fair swap setup.',
      score: 5,
      createdAt: '2026-04-16T08:00:00.000Z'
    },
    {
      id: 'review-3',
      authorId: 'user-me',
      targetUserId: 'user-4',
      body: 'Jules made a workshop feel welcoming even for total beginners.',
      score: 5,
      createdAt: '2026-04-17T08:00:00.000Z'
    }
  ],
  listings: [
    {
      id: 'listing-1',
      ownerId: 'user-2',
      title: 'Film Camera Basics Walkthrough',
      description: 'A one-on-one beginner session covering loading, framing, and calm first-roll practice.',
      category: 'Teacher Listing',
      hobbyId: 'film-photo',
      photos: ['https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80'],
      condition: 'Good',
      location: { barangay: 'Teachers Village', city: 'Quezon City', lat: 14.6476, lng: 121.0619 },
      availability: ['Fri evening', 'Sun morning'],
      format: 'Hybrid',
      level: 'Beginner',
      intent: 'teach',
      priceMode: 'both',
      creditPrice: 18,
      cashPricePhp: 320,
      savedBy: ['user-3'],
      offers: [],
      status: 'active',
      createdAt: '2026-04-14T11:00:00.000Z',
      ratingAverage: 4.9,
      completedSessions: 21
    },
    {
      id: 'listing-2',
      ownerId: 'user-3',
      title: 'Crochet for Watercolor Swap',
      description: 'I can teach granny-square basics if someone helps me assemble a travel watercolor palette.',
      category: 'Skill Swap',
      hobbyId: 'crochet',
      photos: ['https://images.unsplash.com/photo-1584467735871-829f9280a686?auto=format&fit=crop&w=800&q=80'],
      condition: 'Good',
      location: { barangay: 'Kapitolyo', city: 'Pasig', lat: 14.5716, lng: 121.0632 },
      availability: ['Sat afternoon', 'Sun morning'],
      format: 'In-person',
      level: 'Learning',
      intent: 'swap',
      priceMode: 'free',
      creditPrice: null,
      cashPricePhp: null,
      savedBy: ['user-me'],
      offers: [],
      status: 'active',
      createdAt: '2026-04-12T10:00:00.000Z',
      ratingAverage: 4.8,
      completedSessions: 12,
      swapPreference: 'Equal swap only'
    },
    {
      id: 'listing-3',
      ownerId: 'user-4',
      title: 'Sunset Guitar Circle',
      description: 'A six-seat group workshop for shy beginners. Bring one song you want to try.',
      category: 'Workshop',
      hobbyId: 'guitar',
      photos: ['https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=800&q=80'],
      condition: 'Good',
      location: { barangay: 'Malate', city: 'Manila', lat: 14.5692, lng: 120.9912 },
      availability: ['Sat evening'],
      format: 'In-person',
      level: 'Beginner',
      intent: 'workshop',
      priceMode: 'both',
      creditPrice: 35,
      cashPricePhp: 350,
      savedBy: [],
      offers: [],
      status: 'active',
      createdAt: '2026-04-15T16:00:00.000Z',
      ratingAverage: 4.95,
      completedSessions: 34
    },
    {
      id: 'listing-4',
      ownerId: 'user-me',
      title: 'Journaling for Creative Blocks',
      description: 'A guided 60-minute journaling session with prompt packs and gentle reflection pacing.',
      category: 'Teacher Listing',
      hobbyId: 'journaling',
      photos: ['https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=800&q=80'],
      condition: 'New',
      location: { barangay: 'Poblacion', city: 'Makati', lat: 14.5656, lng: 121.0292 },
      availability: ['Tue evening', 'Thu evening'],
      format: 'Hybrid',
      level: 'Beginner',
      intent: 'teach',
      priceMode: 'credits',
      creditPrice: 15,
      cashPricePhp: null,
      savedBy: [],
      offers: [],
      status: 'active',
      createdAt: '2026-04-16T08:00:00.000Z',
      ratingAverage: 4.85,
      completedSessions: 16
    }
  ],
  transactions: [],
  contracts: [
    {
      id: 'contract-1',
      title: 'Journaling ↔ Film Basics',
      type: 'equal-swap',
      intent: 'swap',
      hobbyId: 'journaling',
      teacherId: 'user-me',
      learnerId: 'user-2',
      teachSkill: 'Journaling for creative blocks',
      learnSkill: 'Film camera basics',
      sessions: 3,
      durationMinutes: 90,
      format: 'Hybrid',
      locationLabel: 'Salcedo coffee shop + one online follow-up',
      availabilityGrid: ['Tue evening', 'Sat morning'],
      note: 'Equal swap, no credits needed.',
      creditAmount: 0,
      cashAmountPhp: 0,
      platformFeePhp: 0,
      teacherNetPhp: 0,
      isEqualSwap: true,
      status: 'active',
      confirmedBy: ['user-me', 'user-2'],
      reviewLeftBy: [],
      sessionRecords: [
        {
          id: 'session-1',
          label: 'Session 1',
          date: '2026-04-19T10:00:00.000Z',
          durationMinutes: 90,
          status: 'completed'
        },
        {
          id: 'session-2',
          label: 'Session 2',
          date: '2026-04-26T10:00:00.000Z',
          durationMinutes: 90,
          status: 'scheduled'
        },
        {
          id: 'session-3',
          label: 'Session 3',
          date: '2026-05-03T10:00:00.000Z',
          durationMinutes: 90,
          status: 'scheduled'
        }
      ],
      createdAt: '2026-04-11T08:00:00.000Z'
    },
    {
      id: 'contract-2',
      title: 'Film Camera Basics with Paolo',
      type: 'credit-booking',
      intent: 'teach',
      hobbyId: 'film-photo',
      teacherId: 'user-2',
      learnerId: 'user-me',
      teachSkill: 'Film camera basics',
      sessions: 1,
      durationMinutes: 75,
      format: 'Hybrid',
      locationLabel: 'UP Campus and one follow-up chat',
      availabilityGrid: ['Fri evening'],
      note: 'Credits held in escrow until the learner confirms the session is done.',
      paymentMethod: 'Credits',
      creditAmount: 18,
      cashAmountPhp: 0,
      platformFeePhp: 0,
      teacherNetPhp: 0,
      isEqualSwap: false,
      status: 'awaiting-review',
      confirmedBy: ['user-me', 'user-2'],
      reviewLeftBy: [],
      sessionRecords: [
        {
          id: 'session-4',
          label: 'Session 1',
          date: '2026-04-21T18:00:00.000Z',
          durationMinutes: 75,
          status: 'completed'
        }
      ],
      createdAt: '2026-04-18T08:00:00.000Z',
      listingId: 'listing-1'
    },
    {
      id: 'contract-3',
      title: 'Sunset Guitar Circle',
      type: 'cash-booking',
      intent: 'workshop',
      hobbyId: 'guitar',
      teacherId: 'user-4',
      learnerId: 'user-me',
      teachSkill: 'Beginner guitar workshop',
      sessions: 1,
      durationMinutes: 120,
      format: 'In-person',
      locationLabel: 'Malate bayside studio',
      availabilityGrid: ['Sat evening'],
      note: 'Cash booking via GCash with 9% platform fee shown at checkout.',
      paymentMethod: 'GCash',
      creditAmount: 0,
      cashAmountPhp: 350,
      platformFeePhp: 31.5,
      teacherNetPhp: 318.5,
      isEqualSwap: false,
      status: 'active',
      confirmedBy: ['user-me', 'user-4'],
      reviewLeftBy: [],
      sessionRecords: [
        {
          id: 'session-5',
          label: 'Workshop seat',
          date: '2026-04-27T17:30:00.000Z',
          durationMinutes: 120,
          status: 'scheduled'
        }
      ],
      createdAt: '2026-04-20T09:00:00.000Z',
      listingId: 'listing-3'
    }
  ],
  swapLog: [
    {
      id: 'log-1',
      userId: 'user-me',
      title: 'Completed first equal swap session',
      type: 'taught',
      hours: 1.5,
      badge: 'Warm Welcome',
      happenedAt: '2026-04-19T10:00:00.000Z'
    },
    {
      id: 'log-2',
      userId: 'user-me',
      title: 'Booked a film basics session with credits',
      type: 'learned',
      hours: 1.25,
      happenedAt: '2026-04-21T18:00:00.000Z'
    },
    {
      id: 'log-3',
      userId: 'user-me',
      title: 'Joined a weekly teaching challenge',
      type: 'challenge',
      hours: 0.5,
      badge: 'Showed Up',
      happenedAt: '2026-04-15T10:00:00.000Z'
    }
  ],
  creditLedger: [
    {
      id: 'ledger-1',
      userId: 'user-me',
      delta: +15,
      title: 'Taught journaling for creative blocks',
      sessionType: 'teaching',
      createdAt: '2026-04-19T10:00:00.000Z',
      status: 'posted',
      agreementId: 'contract-1'
    },
    {
      id: 'ledger-2',
      userId: 'user-me',
      delta: -18,
      title: 'Film Camera Basics with Paolo',
      sessionType: 'learning',
      createdAt: '2026-04-18T08:00:00.000Z',
      status: 'held',
      agreementId: 'contract-2'
    },
    {
      id: 'ledger-3',
      userId: 'user-me',
      delta: +10,
      title: 'Teach something in 30 minutes challenge',
      sessionType: 'challenge',
      createdAt: '2026-04-15T08:00:00.000Z',
      status: 'posted'
    },
    {
      id: 'ledger-4',
      userId: 'user-2',
      delta: +18,
      title: 'Film Camera Basics with Mika',
      sessionType: 'teaching',
      createdAt: '2026-04-18T08:00:00.000Z',
      status: 'held',
      agreementId: 'contract-2'
    }
  ],
  cashPayouts: [
    {
      id: 'cash-1',
      userId: 'user-4',
      title: 'Sunset Guitar Circle',
      grossPhp: 350,
      feePhp: 31.5,
      netPhp: 318.5,
      createdAt: '2026-04-20T09:00:00.000Z',
      payoutDate: '2026-04-28T09:00:00.000Z',
      payoutMethod: 'PayPal',
      status: 'held',
      agreementId: 'contract-3'
    }
  ],
  resources: [
    {
      id: 'resource-1',
      ownerId: 'user-me',
      title: 'Portable journaling kit',
      hobbyId: 'journaling',
      description: 'Washi tape, prompt cards, and a fold-flat writing board for swap partners.',
      condition: 'New',
      location: { barangay: 'Poblacion', city: 'Makati', lat: 14.5656, lng: 121.0292 },
      availabilityWindow: 'Borrow during hybrid sessions',
      damagePolicy: 'Return clean, keep paper inserts dry.'
    },
    {
      id: 'resource-2',
      ownerId: 'user-2',
      title: 'Compact tripod',
      hobbyId: 'film-photo',
      description: 'Good for hobby demos and self-timer practice.',
      condition: 'Good',
      location: { barangay: 'Teachers Village', city: 'Quezon City', lat: 14.6476, lng: 121.0619 },
      availabilityWindow: 'Borrow up to 3 days',
      damagePolicy: 'Return with plate attached.'
    }
  ],
  challenges: [
    {
      id: 'challenge-1',
      title: 'Teach a hobby in 30 minutes',
      prompt: 'Share one compact lesson with a friend, match, or new learner this week.',
      focus: 'Teach',
      weekOf: '2026-04-20T00:00:00.000Z',
      creditReward: 15,
      progressGoal: 3,
      participantIds: ['user-me', 'user-2', 'user-4'],
      userProgress: {
        'user-me': 2,
        'user-2': 3,
        'user-4': 1
      },
      rewardedUserIds: ['user-2'],
      archived: false
    },
    {
      id: 'challenge-2',
      title: 'Complete your first equal swap',
      prompt: 'Set up an equal exchange and finish the first session with clear expectations.',
      focus: 'Swap',
      weekOf: '2026-04-20T00:00:00.000Z',
      creditReward: 10,
      progressGoal: 1,
      participantIds: ['user-me', 'user-3'],
      userProgress: {
        'user-me': 1,
        'user-3': 0
      },
      rewardedUserIds: ['user-me'],
      archived: false
    },
    {
      id: 'challenge-3',
      title: 'Share one resource with a swap partner',
      prompt: 'Offer a useful tool or kit that helps someone start faster.',
      focus: 'Share',
      weekOf: '2026-04-13T00:00:00.000Z',
      creditReward: 5,
      progressGoal: 1,
      participantIds: ['user-me', 'user-2'],
      userProgress: {
        'user-me': 1,
        'user-2': 1
      },
      rewardedUserIds: ['user-me', 'user-2'],
      archived: true
    }
  ],
  threads: [
    {
      id: 'thread-1',
      participantIds: ['user-me', 'user-2'],
      contractId: 'contract-2',
      aliasMode: false,
      blockedBy: [],
      mutedBy: [],
      messages: [
        {
          id: 'msg-1',
          senderId: 'user-2',
          body: 'Hope the film basics session felt clear. Happy to answer follow-up questions too.',
          createdAt: '2026-04-21T19:15:00.000Z'
        },
        {
          id: 'msg-2',
          senderId: 'user-me',
          body: 'It did, thanks. I’m opening the review screen next so the credits can release cleanly.',
          createdAt: '2026-04-21T19:23:00.000Z'
        }
      ]
    }
  ],
  notifications: [
    {
      id: 'notif-1',
      userId: 'user-me',
      type: 'credits',
      title: '18 credits are waiting on your review',
      body: 'Finish Paolo’s session review to release the held credit transfer.',
      route: '/app/log',
      createdAt: '2026-04-21T20:00:00.000Z',
      read: false
    },
    {
      id: 'notif-2',
      userId: 'user-me',
      type: 'event',
      title: 'Your next session is tomorrow',
      body: 'Journaling ↔ Film Basics continues at 10:00 AM.',
      route: '/app/home',
      createdAt: '2026-04-21T09:00:00.000Z',
      read: false
    }
  ],
  reports: [],
  quickMatches: [
    {
      id: 'match-1',
      userId: 'user-me',
      matchUserId: 'user-3',
      hobbyId: 'watercolor',
      reason: 'Sam is nearby and open to equal swaps with beginner-friendly pacing.',
      createdAt: '2026-04-20T09:00:00.000Z'
    }
  ],
  tutorialSteps: [
    {
      id: 'tutorial-1',
      title: 'Your balance stays visible up top',
      body: 'The home page keeps credits, pending earnings, and your next session in one clean first view.',
      target: 'home'
    },
    {
      id: 'tutorial-2',
      title: 'Discover is organized by intent',
      body: 'Map pins and list cards separate swaps, teachers, and workshops without making you dig.',
      target: 'discover'
    },
    {
      id: 'tutorial-3',
      title: 'The plus button is the main action hub',
      body: 'Build an equal swap, book a session with escrow, or publish a teacher listing from one page.',
      target: 'new'
    },
    {
      id: 'tutorial-4',
      title: 'Challenges are private and transparent',
      body: 'You can see rewards, progress, and rules without a public feed or popularity contest.',
      target: 'challenges'
    },
    {
      id: 'tutorial-5',
      title: 'Your profile shows participation-based trust',
      body: 'Reliability, responsiveness, and follow-through come from behavior, not follower counts.',
      target: 'profile'
    },
    {
      id: 'tutorial-6',
      title: 'Swap Log is your ledger and payout tracker',
      body: 'Track credit movement, active sessions, review release, and upcoming cash payout dates.',
      target: 'log'
    }
  ]
};
