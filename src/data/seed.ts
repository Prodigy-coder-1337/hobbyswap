import { AppData } from '@/types/models';

export const seedData: AppData = {
  hobbies: [
    { id: 'watercolor', label: 'Watercolor', icon: '🎨', color: '#ef8b5a' },
    { id: 'pottery', label: 'Pottery', icon: '🏺', color: '#8f6d50' },
    { id: 'film-photo', label: 'Film Photo', icon: '📷', color: '#7e6df2' },
    { id: 'guitar', label: 'Guitar', icon: '🎸', color: '#f6b941' },
    { id: 'skate', label: 'Skate', icon: '🛹', color: '#36a18b' },
    { id: 'crochet', label: 'Crochet', icon: '🧶', color: '#f46aa3' },
    { id: 'urban-gardening', label: 'Urban Gardening', icon: '🪴', color: '#4a9e62' },
    { id: 'dance', label: 'Street Dance', icon: '🕺', color: '#f07b52' },
    { id: 'journaling', label: 'Journaling', icon: '📔', color: '#4f6ddf' },
    { id: 'badminton', label: 'Badminton', icon: '🏸', color: '#37a5d8' }
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
      bio: 'I like beginner-friendly art nights, journal swaps, and hobbies that fit into city life.',
      avatar: '#ef8b5a',
      hobbyProfiles: [
        { hobbyId: 'watercolor', level: 'Learning' },
        { hobbyId: 'journaling', level: 'Can Teach' },
        { hobbyId: 'urban-gardening', level: 'Comfortable' }
      ],
      availability: ['Tue evening', 'Thu evening', 'Sat morning'],
      preferredFormats: ['In-person', 'Hybrid'],
      anonymousMode: true,
      onboardingComplete: true,
      guideCompleted: false,
      trustScore: 88,
      premium: true,
      verifiedPhone: true,
      verifiedLocalId: true,
      partnershipBadge: 'Creative Space',
      privacy: {
        visibility: 'Community',
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
      bio: 'Comfortable teaching film basics and happy to trade for gardening tips.',
      avatar: '#36a18b',
      hobbyProfiles: [
        { hobbyId: 'film-photo', level: 'Can Teach' },
        { hobbyId: 'urban-gardening', level: 'Learning' },
        { hobbyId: 'guitar', level: 'Comfortable' }
      ],
      availability: ['Wed evening', 'Fri evening', 'Sun afternoon'],
      preferredFormats: ['In-person', 'Online'],
      anonymousMode: false,
      onboardingComplete: true,
      guideCompleted: true,
      trustScore: 91,
      premium: false,
      verifiedPhone: true,
      verifiedLocalId: false,
      privacy: {
        visibility: 'Community',
        showRealName: true,
        showExactLocation: true
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
      mutedThreadIds: []
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
      bio: 'Crochet circles, thrifted supplies, and calm weekend swaps.',
      avatar: '#f46aa3',
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
      trustScore: 84,
      premium: false,
      verifiedPhone: true,
      verifiedLocalId: true,
      partnershipBadge: 'NGO',
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
        fontScale: 'Large',
        highContrast: false,
        screenReaderHints: true,
        reduceMotion: false
      },
      blockedUserIds: [],
      mutedThreadIds: []
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
      bio: 'I organize low-pressure meetup jam sessions by the bay.',
      avatar: '#f6b941',
      hobbyProfiles: [
        { hobbyId: 'guitar', level: 'Can Teach' },
        { hobbyId: 'dance', level: 'Learning' },
        { hobbyId: 'badminton', level: 'Comfortable' }
      ],
      availability: ['Thu evening', 'Sat evening'],
      preferredFormats: ['In-person', 'Hybrid'],
      anonymousMode: false,
      onboardingComplete: true,
      guideCompleted: true,
      trustScore: 94,
      premium: true,
      verifiedPhone: true,
      verifiedLocalId: true,
      partnershipBadge: 'School',
      privacy: {
        visibility: 'Community',
        showRealName: true,
        showExactLocation: true
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
        highContrast: true,
        screenReaderHints: true,
        reduceMotion: true
      },
      blockedUserIds: [],
      mutedThreadIds: []
    },
    {
      id: 'user-5',
      realName: 'Lia Ong',
      displayName: 'Lia',
      anonymousAlias: 'Soft Lantern',
      email: 'lia@example.com',
      phone: '09461234567',
      password: 'HobbySwap9',
      location: { barangay: 'B.F. Homes', city: 'Paranaque', lat: 14.4505, lng: 121.0411 },
      ageGroup: '18-24',
      bio: 'Starting with pottery and willing to mentor anyone on mindful routines.',
      avatar: '#7e6df2',
      hobbyProfiles: [
        { hobbyId: 'pottery', level: 'Learning' },
        { hobbyId: 'journaling', level: 'Comfortable' },
        { hobbyId: 'urban-gardening', level: 'Beginner' }
      ],
      availability: ['Mon evening', 'Sat morning'],
      preferredFormats: ['Hybrid', 'Online'],
      anonymousMode: true,
      onboardingComplete: true,
      guideCompleted: true,
      trustScore: 79,
      premium: false,
      verifiedPhone: true,
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
    },
    {
      id: 'user-6',
      realName: 'Noel Reyes',
      displayName: 'Noel',
      anonymousAlias: 'Binondo Echo',
      email: 'noel@example.com',
      phone: '09571234567',
      password: 'HobbySwap9',
      location: { barangay: 'Binondo', city: 'Manila', lat: 14.6027, lng: 120.9744 },
      ageGroup: '35-44',
      bio: 'Happy to share badminton drills and borrow cameras for community events.',
      avatar: '#37a5d8',
      hobbyProfiles: [
        { hobbyId: 'badminton', level: 'Can Teach' },
        { hobbyId: 'film-photo', level: 'Learning' },
        { hobbyId: 'dance', level: 'Beginner' }
      ],
      availability: ['Tue morning', 'Sun afternoon'],
      preferredFormats: ['In-person'],
      anonymousMode: false,
      onboardingComplete: true,
      guideCompleted: true,
      trustScore: 86,
      premium: false,
      verifiedPhone: true,
      verifiedLocalId: true,
      privacy: {
        visibility: 'Community',
        showRealName: true,
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
    }
  ],
  reviews: [
    {
      id: 'review-1',
      authorId: 'user-2',
      targetUserId: 'user-me',
      body: 'Mika made the session feel easy to join, especially for someone rusty with journaling.',
      score: 5,
      createdAt: '2026-04-20T08:00:00.000Z'
    },
    {
      id: 'review-2',
      authorId: 'user-3',
      targetUserId: 'user-me',
      body: 'Clear with boundaries, generous with prompts, and very patient about beginner pacing.',
      score: 5,
      createdAt: '2026-04-16T08:00:00.000Z'
    }
  ],
  listings: [
    {
      id: 'listing-1',
      ownerId: 'user-3',
      title: 'Pastel Crochet Starter Kit',
      description: 'Hooks, stitch markers, and soft cotton yarn. Looking to trade for a watercolor travel palette.',
      category: 'Craft Tools',
      hobbyId: 'crochet',
      photos: [
        'https://images.unsplash.com/photo-1584467735871-829f9280a686?auto=format&fit=crop&w=800&q=80'
      ],
      condition: 'Good',
      swapPreference: 'Watercolor palette or brush roll',
      pricePhp: 650,
      location: { barangay: 'Kapitolyo', city: 'Pasig', lat: 14.5716, lng: 121.0632 },
      availability: 'Weekends, 2 PM to 6 PM',
      mode: 'both',
      savedBy: ['user-me'],
      offers: [
        {
          id: 'offer-1',
          fromUserId: 'user-me',
          offeredItem: 'Pocket journal set + PHP 200',
          note: 'Can meet near Rockwell or Pasig weekend markets.',
          status: 'pending',
          createdAt: '2026-04-18T09:00:00.000Z'
        }
      ],
      status: 'active',
      createdAt: '2026-04-14T11:00:00.000Z'
    },
    {
      id: 'listing-2',
      ownerId: 'user-2',
      title: 'Point-and-Shoot Film Camera',
      description: 'Works well, recently tested. Prefer a straight sale or a swap for beginner pottery tools.',
      category: 'Cameras',
      hobbyId: 'film-photo',
      photos: [
        'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80'
      ],
      condition: 'Well-loved',
      swapPreference: 'Pottery rib tools',
      pricePhp: 2200,
      location: { barangay: 'Teachers Village', city: 'Quezon City', lat: 14.6476, lng: 121.0619 },
      availability: 'Fridays after 6 PM',
      mode: 'both',
      savedBy: [],
      offers: [],
      status: 'active',
      createdAt: '2026-04-10T12:00:00.000Z'
    },
    {
      id: 'listing-3',
      ownerId: 'user-4',
      title: 'Acoustic Guitar Stand + Capo',
      description: 'Useful if you are just setting up your jam corner.',
      category: 'Music Gear',
      hobbyId: 'guitar',
      photos: [
        'https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=800&q=80'
      ],
      condition: 'Good',
      swapPreference: 'Sketchbooks, art pens, or PHP',
      pricePhp: 900,
      location: { barangay: 'Malate', city: 'Manila', lat: 14.5692, lng: 120.9912 },
      availability: 'Saturday evenings',
      mode: 'both',
      savedBy: ['user-me'],
      offers: [],
      status: 'active',
      createdAt: '2026-04-16T16:00:00.000Z'
    },
    {
      id: 'listing-4',
      ownerId: 'user-me',
      title: 'Beginner Journaling Bundle',
      description: 'Washi tape, grid notebook, and mildliners. Happy to trade for indoor plant cuttings.',
      category: 'Stationery',
      hobbyId: 'journaling',
      photos: [
        'https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=800&q=80'
      ],
      condition: 'New',
      swapPreference: 'Plant cuttings or pottery tools',
      pricePhp: 480,
      location: { barangay: 'Poblacion', city: 'Makati', lat: 14.5656, lng: 121.0292 },
      availability: 'Weekday evenings',
      mode: 'both',
      savedBy: ['user-5'],
      offers: [],
      status: 'active',
      createdAt: '2026-04-12T08:00:00.000Z'
    }
  ],
  transactions: [
    {
      id: 'txn-1',
      listingId: 'listing-3',
      buyerId: 'user-6',
      sellerId: 'user-4',
      type: 'sale',
      amountPhp: 900,
      status: 'completed',
      ratingByBuyer: 5,
      ratingBySeller: 5,
      createdAt: '2026-04-06T11:00:00.000Z'
    }
  ],
  contracts: [
    {
      id: 'contract-1',
      initiatorId: 'user-me',
      partnerId: 'user-2',
      teachSkill: 'Journaling for creative blocks',
      learnSkill: 'Film camera basics',
      sessions: 3,
      durationMinutes: 90,
      format: 'Hybrid',
      meetingPoint: 'Salcedo coffee shop + one online follow-up',
      videoLink: 'https://meet.jit.si/hobbyswap-film-journal',
      notes: ['Keep the first session anonymous-friendly and beginner-paced.'],
      milestones: ['Kickoff done', 'Shared first prompt pack'],
      status: 'active',
      confirmedBy: ['user-me', 'user-2'],
      sessionRecords: [
        {
          id: 'session-1',
          label: 'Session 1: camera warm-up',
          date: '2026-04-19T10:00:00.000Z',
          durationMinutes: 90,
          status: 'completed'
        },
        {
          id: 'session-2',
          label: 'Session 2: journal exchange',
          date: '2026-04-26T10:00:00.000Z',
          durationMinutes: 90,
          status: 'scheduled'
        }
      ],
      createdAt: '2026-04-11T08:00:00.000Z'
    },
    {
      id: 'contract-2',
      initiatorId: 'user-3',
      partnerId: 'user-me',
      teachSkill: 'Crochet granny square basics',
      learnSkill: 'Watercolor travel palette setup',
      sessions: 2,
      durationMinutes: 120,
      format: 'In-person',
      meetingPoint: 'Kapitolyo community table',
      notes: ['Bring portable water cup and scrap yarn.'],
      milestones: ['Terms reviewed'],
      status: 'pending',
      confirmedBy: ['user-3'],
      sessionRecords: [
        {
          id: 'session-3',
          label: 'Session 1',
          date: '2026-04-28T13:00:00.000Z',
          durationMinutes: 120,
          status: 'scheduled'
        }
      ],
      createdAt: '2026-04-20T06:00:00.000Z'
    }
  ],
  swapLog: [
    {
      id: 'log-1',
      userId: 'user-me',
      title: 'Completed first hybrid journaling exchange',
      type: 'taught',
      hours: 1.5,
      badge: 'Warm Welcome',
      happenedAt: '2026-04-19T10:00:00.000Z'
    },
    {
      id: 'log-2',
      userId: 'user-me',
      title: 'Joined commute sketch challenge',
      type: 'challenge',
      hours: 1,
      badge: 'Showed Up',
      happenedAt: '2026-04-15T10:00:00.000Z'
    },
    {
      id: 'log-3',
      userId: 'user-me',
      title: 'Attended rooftop plant swap',
      type: 'event',
      hours: 2,
      happenedAt: '2026-04-13T10:00:00.000Z'
    }
  ],
  resources: [
    {
      id: 'resource-1',
      ownerId: 'user-2',
      title: 'Compact tripod for hobby shoots',
      hobbyId: 'film-photo',
      description: 'Lightweight tripod for beginner videos or self-timer practice.',
      condition: 'Good',
      location: { barangay: 'Teachers Village', city: 'Quezon City', lat: 14.6476, lng: 121.0619 },
      availabilityWindow: 'Borrow up to 3 days',
      damagePolicy: 'Return clean, replace quick-release plate if lost.'
    },
    {
      id: 'resource-2',
      ownerId: 'user-4',
      title: 'Spare ukulele for first sessions',
      hobbyId: 'guitar',
      description: 'Best for trying chords before buying your own instrument.',
      condition: 'Well-loved',
      location: { barangay: 'Malate', city: 'Manila', lat: 14.5692, lng: 120.9912 },
      availabilityWindow: 'Weekend borrow only',
      damagePolicy: 'No beach use, return with strings wiped down.'
    }
  ],
  challenges: [
    {
      id: 'challenge-1',
      title: 'Draw Your Commute',
      prompt: 'Create something inspired by your route today: jeepney color blocks, train rhythm, or the little corners you always pass by.',
      weekOf: '2026-04-20T00:00:00.000Z',
      hobbyId: 'watercolor',
      participantIds: ['user-me', 'user-3'],
      archived: false,
      entries: [
        {
          id: 'entry-1',
          userId: 'user-me',
          partnerId: 'user-3',
          mediaType: 'text',
          caption: 'Wrote a tiny journal + sketch combo about the Guadalupe footbridge crowd.',
          createdAt: '2026-04-21T10:00:00.000Z',
          voters: ['user-2', 'user-4']
        }
      ]
    },
    {
      id: 'challenge-2',
      title: 'Pocket Garden Sunday',
      prompt: 'Swap a cutting, document the process, and reflect on how you care for tiny spaces.',
      weekOf: '2026-04-13T00:00:00.000Z',
      hobbyId: 'urban-gardening',
      participantIds: ['user-2', 'user-5'],
      archived: true,
      entries: []
    }
  ],
  events: [
    {
      id: 'event-1',
      hostId: 'user-4',
      title: 'Sunset Jam for Shy Beginners',
      description: 'Bring one song you want to practice. No pressure to perform solo.',
      date: '2026-04-26T00:00:00.000Z',
      time: '5:30 PM',
      format: 'In-person',
      location: { barangay: 'Malate', city: 'Manila', lat: 14.5692, lng: 120.9912 },
      requiredSkill: 'Beginner',
      capacity: 12,
      attendeeIds: ['user-me', 'user-6'],
      checkedInIds: [],
      moderationStatus: 'approved'
    },
    {
      id: 'event-2',
      hostId: 'user-2',
      title: 'Film Walk: UP Oval to Maginhawa',
      description: 'Slow photo walk for analog beginners with optional coffee critique after.',
      date: '2026-04-27T00:00:00.000Z',
      time: '7:00 AM',
      format: 'Hybrid',
      location: { barangay: 'UP Campus', city: 'Quezon City', lat: 14.6518, lng: 121.0497 },
      requiredSkill: 'Beginner',
      capacity: 10,
      attendeeIds: ['user-me', 'user-3'],
      checkedInIds: [],
      moderationStatus: 'approved'
    },
    {
      id: 'event-3',
      hostId: 'user-me',
      title: 'Pocket Journal Swap Circle',
      description: 'Share one page, one prompt, and one hobby supply tip.',
      date: '2026-05-02T00:00:00.000Z',
      time: '3:00 PM',
      format: 'Hybrid',
      location: { barangay: 'Poblacion', city: 'Makati', lat: 14.5656, lng: 121.0292 },
      requiredSkill: 'Beginner',
      capacity: 16,
      attendeeIds: ['user-3'],
      checkedInIds: [],
      moderationStatus: 'approved'
    }
  ],
  videos: [
    {
      id: 'video-1',
      ownerId: 'user-2',
      title: 'How I Load Film Without Stress',
      url: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
      thumbnail: 'https://images.unsplash.com/photo-1495707902641-75cac588d2e9?auto=format&fit=crop&w=800&q=80',
      hobbyId: 'film-photo',
      skillLevel: 'Beginner',
      format: 'Hybrid',
      durationSeconds: 138,
      comments: [
        {
          id: 'comment-1',
          userId: 'user-me',
          body: 'Love that this feels beginner-safe and not intimidating.',
          createdAt: '2026-04-18T07:00:00.000Z',
          moderated: true
        }
      ],
      reportedBy: []
    },
    {
      id: 'video-2',
      ownerId: 'user-4',
      title: 'Warm-up Chords for First Meetups',
      url: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
      thumbnail: 'https://images.unsplash.com/photo-1458560871784-56d23406c091?auto=format&fit=crop&w=800&q=80',
      hobbyId: 'guitar',
      skillLevel: 'Beginner',
      format: 'In-person',
      durationSeconds: 176,
      comments: [],
      reportedBy: []
    }
  ],
  threads: [
    {
      id: 'thread-1',
      participantIds: ['user-me', 'user-2'],
      contractId: 'contract-1',
      consentRequestedBy: 'user-me',
      consentGranted: true,
      aliasMode: true,
      blockedBy: [],
      mutedBy: [],
      messages: [
        {
          id: 'msg-1',
          senderId: 'user-2',
          encryptedBody: 'plain:Excited for our next session. I can bring an extra roll of film so we can practice without pressure.',
          createdAt: '2026-04-19T10:00:00.000Z'
        }
      ]
    },
    {
      id: 'thread-2',
      participantIds: ['user-me', 'user-3'],
      consentRequestedBy: 'user-3',
      consentGranted: false,
      aliasMode: true,
      blockedBy: [],
      mutedBy: [],
      messages: []
    }
  ],
  notifications: [
    {
      id: 'notif-1',
      userId: 'user-me',
      type: 'contract',
      title: 'Next session tomorrow',
      body: 'Film + journaling session with Paolo starts at 10:00 AM.',
      route: '/app/contracts',
      createdAt: '2026-04-21T10:00:00.000Z',
      read: false
    },
    {
      id: 'notif-2',
      userId: 'user-me',
      type: 'swap-request',
      title: 'New offer on your journaling bundle',
      body: 'Lia offered plant cuttings and a ceramic tray.',
      route: '/app/swap',
      createdAt: '2026-04-21T11:00:00.000Z',
      read: false
    },
    {
      id: 'notif-3',
      userId: 'user-me',
      type: 'challenge',
      title: 'Challenge reminder',
      body: 'You still have time to submit to Draw Your Commute.',
      route: '/app/challenges',
      createdAt: '2026-04-21T12:00:00.000Z',
      read: true
    }
  ],
  projects: [
    {
      id: 'project-1',
      title: 'Zine Club Vol. 2',
      description: 'A collaborative mini-zine about tiny creative habits in Manila.',
      hobbyId: 'journaling',
      ownerId: 'user-me',
      collaboratorIds: ['user-2', 'user-3'],
      tasks: {
        todo: [{ id: 'task-1', title: 'Finalize cover palette', ownerId: 'user-me' }],
        inProgress: [{ id: 'task-2', title: 'Collect commute photos', ownerId: 'user-2' }],
        done: [{ id: 'task-3', title: 'Draft contributor prompt', ownerId: 'user-3' }]
      },
      files: [
        {
          id: 'file-1',
          name: 'moodboard.png',
          url: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80'
        }
      ],
      celebrationSeen: false
    }
  ],
  reports: [
    {
      id: 'report-1',
      reporterId: 'user-3',
      subjectType: 'listing',
      subjectId: 'listing-2',
      category: 'Misleading listing',
      details: 'The price field and condition note were inconsistent before the owner updated it.',
      createdAt: '2026-04-09T10:00:00.000Z',
      status: 'Resolved'
    }
  ],
  quickMatches: [
    {
      id: 'match-seed-1',
      userId: 'user-me',
      matchUserId: 'user-3',
      hobbyId: 'watercolor',
      reason: 'Sam is learning watercolor too and prefers low-pressure hybrid meetups.',
      createdAt: '2026-04-20T10:00:00.000Z'
    }
  ],
  tutorialSteps: [
    {
      id: 'tutorial-1',
      title: 'Home keeps your week grounded',
      body: 'The dashboard focuses on a few meaningful next steps instead of an endless content feed.',
      target: 'home'
    },
    {
      id: 'tutorial-2',
      title: 'Discover is local and filterable',
      body: 'Use the map and list filters to find people, swaps, and events near your barangay.',
      target: 'discover'
    },
    {
      id: 'tutorial-3',
      title: 'Swap is your materials hub',
      body: 'List hobby gear for sale, swap supplies, track offers, and rate each exchange once it is done.',
      target: 'swap'
    },
    {
      id: 'tutorial-4',
      title: 'Events stay beginner-friendly',
      body: 'RSVP, host small meetups, and check in after without pressure to perform.',
      target: 'events'
    },
    {
      id: 'tutorial-5',
      title: 'Profile is about trust, not clout',
      body: 'Your reputation comes from showing up, completing swaps, and helping the community.',
      target: 'profile'
    },
    {
      id: 'tutorial-6',
      title: 'Messages are consent-first',
      body: 'Request chat access before the first message, keep aliases on if you need them, and use quick boundary responses any time.',
      target: 'messages'
    }
  ]
};
