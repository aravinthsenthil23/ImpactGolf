export type DrawType = '5-match' | '4-match' | '3-match'
export type DrawLogicMode = 'random' | 'algorithmic'

export interface SimulatedDrawResult {
  winningNumbers: number[]
  mode: DrawLogicMode
  drawDate: string
}

const MIN_STABLEFORD = 1
const MAX_STABLEFORD = 45
const DRAW_SIZE = 5

function uniqueNumbers(numbers: number[]) {
  return Array.from(new Set(numbers))
}

function pickUniqueRandom(pool: number[], size: number) {
  const source = [...pool]
  const result: number[] = []

  while (result.length < size && source.length > 0) {
    const index = Math.floor(Math.random() * source.length)
    result.push(source[index])
    source.splice(index, 1)
  }

  return result
}

function buildStablefordUniverse() {
  return Array.from(
    { length: MAX_STABLEFORD - MIN_STABLEFORD + 1 },
    (_, index) => index + MIN_STABLEFORD
  )
}

function buildWeightedPool(userScores: number[]) {
  const frequency = new Map<number, number>()
  for (const value of userScores) {
    if (value < MIN_STABLEFORD || value > MAX_STABLEFORD) continue
    frequency.set(value, (frequency.get(value) ?? 0) + 1)
  }

  // Frequency-sorted pool: most frequent first
  const sortedByFrequency = buildStablefordUniverse().sort((a, b) => {
    const aFreq = frequency.get(a) ?? 0
    const bFreq = frequency.get(b) ?? 0
    if (aFreq !== bFreq) return bFreq - aFreq
    return a - b
  })

  return sortedByFrequency
}

/**
 * Standard Lottery: Purely random selection from the Stableford range (1-45).
 */
function generateRandomDraw(): number[] {
  return pickUniqueRandom(buildStablefordUniverse(), DRAW_SIZE).sort((a, b) => a - b)
}

/**
 * Algorithmic: Weighted by user score frequency.
 * Mixes 3 numbers from the most frequent scores and 2 from the least frequent scores.
 * This ensures the draw reflects user activity while maintaining unpredictability.
 */
function generateAlgorithmicDraw(userScores: number[]): number[] {
  const poolSortedByFreq = buildWeightedPool(userScores)
  
  // Define top/bottom frequency brackets
  const mostFrequent = poolSortedByFreq.slice(0, 15)
  const leastFrequent = poolSortedByFreq.slice(-15)
  
  // Pick a mix of popular and rare numbers
  const drawn = new Set<number>()
  
  // Pick 3 from most frequent
  const topPicks = pickUniqueRandom(mostFrequent, 3)
  topPicks.forEach(n => drawn.add(n))
  
  // Pick 2 from least frequent
  const bottomPicks = pickUniqueRandom(leastFrequent, 2)
  bottomPicks.forEach(n => drawn.add(n))
  
  // Ensure we have exactly DRAW_SIZE unique numbers (handle collisions/edge cases)
  if (drawn.size < DRAW_SIZE) {
    const universe = buildStablefordUniverse()
    while (drawn.size < DRAW_SIZE) {
      const randomNum = universe[Math.floor(Math.random() * universe.length)]
      drawn.add(randomNum)
    }
  }

  return Array.from(drawn).sort((a, b) => a - b)
}

export function simulateDraw(
  mode: DrawLogicMode,
  userScores: number[],
  drawDate = new Date().toISOString().split('T')[0]
): SimulatedDrawResult {
  const winningNumbers =
    mode === 'algorithmic'
      ? generateAlgorithmicDraw(userScores)
      : generateRandomDraw()

  return {
    winningNumbers,
    mode,
    drawDate,
  }
}

export function resolveJackpotRollover(
  currentJackpot: number,
  fiveMatchWinnerCount: number
) {
  return fiveMatchWinnerCount === 0 ? currentJackpot : 0
}

export interface UserScore {
  userId: string;
  scores: number[];
}

export interface Winner {
  userId: string;
  matches: number;
  winnings: number;
}

export interface DrawResults {
  fiveMatchWinners: Winner[];
  fourMatchWinners: Winner[];
  threeMatchWinners: Winner[];
}

/**
 * Compares a winning number against user scores to find matches and calculate prize shares.
 * @param winningNumbers - The 5-digit winning number.
 * @param userScores - An array of user scores to check against the winning numbers.
 * @param totalPrizePool - The total prize pool to be distributed among winners.
 * @returns An object containing arrays of winners for 5, 4, and 3 matches.
 */
export function processDrawResults(
  winningNumbers: number[],
  userScores: UserScore[],
  totalPrizePool: number
): DrawResults {
  const fiveMatchWinners: Winner[] = [];
  const fourMatchWinners: Winner[] = [];
  const threeMatchWinners: Winner[] = [];

  for (const userScore of userScores) {
    const matches = winningNumbers.filter(winningNumber =>
      userScore.scores.includes(winningNumber)
    ).length;

    if (matches === 5) {
      fiveMatchWinners.push({ userId: userScore.userId, matches: 5, winnings: 0 });
    } else if (matches === 4) {
      fourMatchWinners.push({ userId: userScore.userId, matches: 4, winnings: 0 });
    } else if (matches === 3) {
      threeMatchWinners.push({ userId: userScore.userId, matches: 3, winnings: 0 });
    }
  }

  const prizePool5Match = totalPrizePool * 0.75;
  const prizePool4Match = totalPrizePool * 0.20;
  const prizePool3Match = totalPrizePool * 0.05;

  if (fiveMatchWinners.length > 0) {
    const winningsPerWinner = prizePool5Match / fiveMatchWinners.length;
    for (const winner of fiveMatchWinners) {
      winner.winnings = winningsPerWinner;
    }
  }

  if (fourMatchWinners.length > 0) {
    const winningsPerWinner = prizePool4Match / fourMatchWinners.length;
    for (const winner of fourMatchWinners) {
      winner.winnings = winningsPerWinner;
    }
  }

  if (threeMatchWinners.length > 0) {
    const winningsPerWinner = prizePool3Match / threeMatchWinners.length;
    for (const winner of threeMatchWinners) {
      winner.winnings = winningsPerWinner;
    }
  }

  return {
    fiveMatchWinners,
    fourMatchWinners,
    threeMatchWinners,
  };
}
