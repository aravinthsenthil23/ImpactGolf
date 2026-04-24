export interface Score {
  id: string
  value: number
  date: string
  course?: string
}

export interface Charity {
  id: string
  name: string
  description: string
  longDescription?: string
  category: string
  impactPercentage: number
  isSpotlight: boolean
  imageUrl: string
  galleryImages?: string[]
  upcomingEvents?: CharityEvent[]
  totalRaised: number
}

export interface CharityEvent {
  id: string
  title: string
  date: string
  location: string
}

export interface User {
  id: string
  name: string
  email: string
  subscriptionStatus: 'active' | 'inactive' | 'pending'
  subscriptionTier: 'monthly' | 'yearly'
  scores: Score[]
  selectedCharity: Charity | null
  walletBalance: number
  pendingWinnings: number
  paidWinnings: number
}

export interface DrawResult {
  id: string
  date: string
  winningNumbers: number[]
  prizePool: number
  winners: {
    fiveMatch: Winner[]
    fourMatch: Winner[]
    threeMatch: Winner[]
  }
}

export interface Winner {
  userId: string
  userName: string
  matchedNumbers: number[]
  prizeAmount: number
  status: 'pending' | 'verified' | 'paid'
  proofUrl?: string
}

export interface PrizePool {
  total: number
  fiveMatchShare: number // 40%
  fourMatchShare: number // 35%
  threeMatchShare: number // 25%
  activeSubscribers: number
}

export interface SubscriptionPlan {
  id: string
  name: string
  monthlyPrice: number
  yearlyPrice: number
  features: string[]
  charityContribution: number
}

export interface AdminStats {
  totalSubscribers: number
  activeDraws: number
  pendingVerifications: number
  totalCharityContributions: number
  monthlyRevenue: number
}
