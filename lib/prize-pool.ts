export type MatchTier = '5-match' | '4-match' | '3-match'

export const SUBSCRIPTION_PRIZE_CONTRIBUTION = 12

const TIER_SHARE: Record<MatchTier, number> = {
  '5-match': 0.4,
  '4-match': 0.35,
  '3-match': 0.25,
}

const TIER_ROLLOVER_ELIGIBLE: Record<MatchTier, boolean> = {
  '5-match': true,
  '4-match': false,
  '3-match': false,
}

export interface PrizeDistributionInput {
  activeSubscribers: number
  winnerCounts: Record<MatchTier, number>
  carriedJackpot: number
  contributionPerSubscriber?: number
}

export interface TierDistribution {
  share: number
  pool: number
  winners: number
  payoutPerWinner: number
  rolloverToNextDraw: number
  rolloverEligible: boolean
}

export interface PrizeDistributionResult {
  contributionPerSubscriber: number
  activeSubscribers: number
  basePool: number
  totalPoolWithRollover: number
  tiers: Record<MatchTier, TierDistribution>
  nextJackpotRollover: number
}

function toCurrencyAmount(value: number) {
  return Math.max(0, Math.round(value * 100) / 100)
}

export function calculatePrizeDistribution({
  activeSubscribers,
  winnerCounts,
  carriedJackpot,
  contributionPerSubscriber = SUBSCRIPTION_PRIZE_CONTRIBUTION,
}: PrizeDistributionInput): PrizeDistributionResult {
  const basePool = toCurrencyAmount(activeSubscribers * contributionPerSubscriber)
  const fivePool = toCurrencyAmount(basePool * TIER_SHARE['5-match'] + carriedJackpot)
  const fourPool = toCurrencyAmount(basePool * TIER_SHARE['4-match'])
  const threePool = toCurrencyAmount(basePool * TIER_SHARE['3-match'])

  const pools: Record<MatchTier, number> = {
    '5-match': fivePool,
    '4-match': fourPool,
    '3-match': threePool,
  }

  const tiers = (Object.keys(pools) as MatchTier[]).reduce(
    (acc, tier) => {
      const winners = Math.max(0, winnerCounts[tier] ?? 0)
      const rolloverEligible = TIER_ROLLOVER_ELIGIBLE[tier]
      const pool = pools[tier]
      const payoutPerWinner = winners > 0 ? toCurrencyAmount(pool / winners) : 0
      const rolloverToNextDraw =
        winners === 0 && rolloverEligible ? toCurrencyAmount(pool) : 0

      acc[tier] = {
        share: TIER_SHARE[tier],
        pool,
        winners,
        payoutPerWinner,
        rolloverToNextDraw,
        rolloverEligible,
      }
      return acc
    },
    {} as Record<MatchTier, TierDistribution>
  )

  return {
    contributionPerSubscriber,
    activeSubscribers,
    basePool,
    totalPoolWithRollover: toCurrencyAmount(basePool + carriedJackpot),
    tiers,
    nextJackpotRollover: tiers['5-match'].rolloverToNextDraw,
  }
}
