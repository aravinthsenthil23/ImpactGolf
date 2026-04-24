export interface SubscriptionPlan {
  id: string
  name: string
  description: string
  priceMonthly: number // in cents
  priceYearly: number // in cents (discounted)
  features: string[]
  tier: 'starter' | 'pro' | 'elite'
  charityPercentage: number
  drawEntries: number
  highlighted?: boolean
}

// Subscription plans - source of truth for all pricing
export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: 'starter',
    name: 'Starter',
    description: 'Perfect for casual golfers who want to participate',
    priceMonthly: 999, // $9.99/month
    priceYearly: 9990, // $99.90/year (save ~17%)
    features: [
      'Submit up to 5 rolling scores',
      '1 draw entry per month',
      'Basic charity selection',
      'Monthly prize pool access',
    ],
    tier: 'starter',
    charityPercentage: 10,
    drawEntries: 1,
  },
  {
    id: 'pro',
    name: 'Pro',
    description: 'For dedicated golfers seeking better odds',
    priceMonthly: 2499, // $24.99/month
    priceYearly: 23990, // $239.90/year (save 20%)
    features: [
      'Submit up to 5 rolling scores',
      '3 draw entries per month',
      'Priority charity selection',
      'Weekly & monthly prize pools',
      'Score analytics dashboard',
    ],
    tier: 'pro',
    charityPercentage: 15,
    drawEntries: 3,
    highlighted: true,
  },
  {
    id: 'elite',
    name: 'Elite',
    description: 'Maximum entries and exclusive benefits',
    priceMonthly: 4999, // $49.99/month
    priceYearly: 47990, // $479.90/year (save 20%)
    features: [
      'Submit up to 5 rolling scores',
      '5 draw entries per month',
      'VIP charity partnerships',
      'All prize pool tiers',
      'Advanced analytics & insights',
      'Priority winner verification',
      'Exclusive member events',
    ],
    tier: 'elite',
    charityPercentage: 20,
    drawEntries: 5,
  },
]

export function getPlanById(planId: string): SubscriptionPlan | undefined {
  return SUBSCRIPTION_PLANS.find((plan) => plan.id === planId)
}

export function formatPrice(cents: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(cents / 100)
}

export function getYearlySavings(plan: SubscriptionPlan): number {
  const monthlyTotal = plan.priceMonthly * 12
  return monthlyTotal - plan.priceYearly
}

export function getYearlySavingsPercentage(plan: SubscriptionPlan): number {
  const monthlyTotal = plan.priceMonthly * 12
  return Math.round(((monthlyTotal - plan.priceYearly) / monthlyTotal) * 100)
}
