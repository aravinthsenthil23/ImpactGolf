import type { Charity, User, DrawResult, PrizePool, AdminStats } from './types'

export const charities: Charity[] = [
  {
    id: '1',
    name: 'First Tee Foundation',
    description: 'Building game-changers by integrating golf with character development.',
    longDescription:
      'First Tee helps young people build confidence, character, and life skills through golf programs delivered by trained coaches and partner schools.',
    category: 'Youth Development',
    impactPercentage: 15,
    isSpotlight: true,
    imageUrl: 'https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?q=80&w=800&auto=format&fit=crop',
    galleryImages: ['https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?q=80&w=800&auto=format&fit=crop'],
    upcomingEvents: [
      { id: 'fte-1', title: 'Junior Golf Day', date: '2026-06-12', location: 'Pebble Beach' },
      { id: 'fte-2', title: 'Coach Development Clinic', date: '2026-07-08', location: 'San Diego' },
    ],
    totalRaised: 125000,
  },
  {
    id: '2',
    name: 'Birdies for the Brave',
    description: 'Supporting military families through golf programs and events.',
    longDescription:
      'Birdies for the Brave supports military families with access to golf-based wellness activities, mentoring, and community support.',
    category: 'Military Support',
    impactPercentage: 12,
    isSpotlight: false,
    imageUrl: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?q=80&w=800&auto=format&fit=crop',
    galleryImages: ['https://images.unsplash.com/photo-1593113598332-cd288d649433?q=80&w=800&auto=format&fit=crop'],
    upcomingEvents: [
      { id: 'bfb-1', title: 'Veterans Golf Day', date: '2026-06-21', location: 'Phoenix' },
    ],
    totalRaised: 89000,
  },
  {
    id: '3',
    name: 'Golf for Good',
    description: 'Providing equipment and course access to underserved communities.',
    longDescription:
      'Golf for Good expands access by funding starter kits, transport, and beginner coaching for underserved communities.',
    category: 'Access & Equity',
    impactPercentage: 18,
    isSpotlight: true,
    imageUrl: 'https://images.unsplash.com/photo-1535131749006-b7f58c99034b?q=80&w=800&auto=format&fit=crop',
    galleryImages: ['https://images.unsplash.com/photo-1535131749006-b7f58c99034b?q=80&w=800&auto=format&fit=crop'],
    upcomingEvents: [
      { id: 'gfg-1', title: 'Community Range Weekend', date: '2026-05-30', location: 'Dallas' },
    ],
    totalRaised: 156000,
  },
  {
    id: '4',
    name: 'Links to Learning',
    description: 'Funding STEM education through golf scholarships.',
    longDescription:
      'Links to Learning funds scholarships that combine STEM development with golf leadership pathways for students.',
    category: 'Education',
    impactPercentage: 10,
    isSpotlight: false,
    imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop',
    galleryImages: ['https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop'],
    upcomingEvents: [
      { id: 'ltl-1', title: 'Scholarship Invitational', date: '2026-08-15', location: 'Chicago' },
    ],
    totalRaised: 67000,
  },
  {
    id: '5',
    name: 'Green Earth Initiative',
    description: 'Promoting sustainable golf course management and environmental conservation.',
    longDescription:
      'Green Earth Initiative helps courses adopt water-saving and habitat-protection practices while educating local communities.',
    category: 'Environment',
    impactPercentage: 14,
    isSpotlight: false,
    imageUrl: 'https://images.unsplash.com/photo-1542601906970-d4d897bebb14?q=80&w=800&auto=format&fit=crop',
    galleryImages: ['https://images.unsplash.com/photo-1542601906970-d4d897bebb14?q=80&w=800&auto=format&fit=crop'],
    upcomingEvents: [
      { id: 'gei-1', title: 'Sustainable Grounds Workshop', date: '2026-07-18', location: 'Orlando' },
    ],
    totalRaised: 93000,
  },
  {
    id: '6',
    name: 'Swing for Hope',
    description: 'Supporting mental health awareness and resources for athletes.',
    longDescription:
      'Swing for Hope provides mental wellness resources, peer groups, and counseling access for athletes and families.',
    category: 'Mental Health',
    impactPercentage: 16,
    isSpotlight: true,
    imageUrl: 'https://images.unsplash.com/photo-1499209974431-9dac3adaf471?q=80&w=800&auto=format&fit=crop',
    galleryImages: ['https://images.unsplash.com/photo-1499209974431-9dac3adaf471?q=80&w=800&auto=format&fit=crop'],
    upcomingEvents: [
      { id: 'sfh-1', title: 'Mindful Golf Retreat', date: '2026-06-28', location: 'Scottsdale' },
    ],
    totalRaised: 112000,
  },
]

export const mockUser: User = {
  id: 'user-1',
  name: 'Guest User',
  email: 'user@example.com',
  subscriptionStatus: 'active',
  subscriptionTier: 'monthly',
  scores: [
    { id: 's1', value: 36, date: '2026-04-20', course: 'Pebble Beach' },
    { id: 's2', value: 38, date: '2026-04-15', course: 'Augusta National' },
    { id: 's3', value: 34, date: '2026-04-10', course: 'St Andrews' },
    { id: 's4', value: 40, date: '2026-04-05', course: 'Torrey Pines' },
    { id: 's5', value: 35, date: '2026-04-01', course: 'Whistling Straits' },
  ],
  selectedCharity: charities[0],
  walletBalance: 250.00,
  pendingWinnings: 75.00,
  paidWinnings: 175.00,
}

export const mockDrawResult: DrawResult = {
  id: 'draw-1',
  date: '2026-04-23',
  winningNumbers: [36, 38, 34, 40, 35],
  prizePool: 15000,
  winners: {
    fiveMatch: [
      {
        userId: 'user-2',
        userName: 'Sarah Chen',
        matchedNumbers: [36, 38, 34, 40, 35],
        prizeAmount: 6000,
        status: 'pending',
      },
    ],
    fourMatch: [
      {
        userId: 'user-3',
        userName: 'Mike Johnson',
        matchedNumbers: [36, 38, 34, 40],
        prizeAmount: 2625,
        status: 'verified',
      },
      {
        userId: 'user-4',
        userName: 'Emily Davis',
        matchedNumbers: [38, 34, 40, 35],
        prizeAmount: 2625,
        status: 'paid',
      },
    ],
    threeMatch: [
      {
        userId: 'user-5',
        userName: 'James Wilson',
        matchedNumbers: [36, 38, 34],
        prizeAmount: 1250,
        status: 'pending',
      },
      {
        userId: 'user-6',
        userName: 'Lisa Brown',
        matchedNumbers: [34, 40, 35],
        prizeAmount: 1250,
        status: 'verified',
      },
      {
        userId: 'user-7',
        userName: 'David Lee',
        matchedNumbers: [36, 40, 35],
        prizeAmount: 1250,
        status: 'pending',
        proofUrl: '/proofs/david-lee.jpg',
      },
    ],
  },
}

export const mockPrizePool: PrizePool = {
  total: 15000,
  fiveMatchShare: 6000, // 40%
  fourMatchShare: 5250, // 35%
  threeMatchShare: 3750, // 25%
  activeSubscribers: 1247,
}

export const mockAdminStats: AdminStats = {
  totalSubscribers: 1247,
  activeDraws: 3,
  pendingVerifications: 12,
  totalCharityContributions: 45680,
  monthlyRevenue: 24940,
}

export const charityCategories = [
  'All',
  'Youth Development',
  'Military Support',
  'Access & Equity',
  'Education',
  'Environment',
  'Mental Health',
]
