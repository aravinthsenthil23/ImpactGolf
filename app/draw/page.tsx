'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Trophy, Users, Zap, Clock, CheckCircle2, Gift, RefreshCw } from 'lucide-react'
import { Navigation } from '@/components/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { mockUser, mockDrawResult, mockPrizePool } from '@/lib/mock-data'
import { calculatePrizeDistribution } from '@/lib/prize-pool'
import { simulateDraw as engineSimulateDraw, type DrawLogicMode } from '@/lib/draw-engine'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { SubscriptionGuard } from '@/components/subscription-guard'

function NumberBall({ 
  number, 
  isMatched,
  isDrawn,
  delay = 0 
}: { 
  number: number | null
  isMatched?: boolean
  isDrawn?: boolean
  delay?: number 
}) {
  return (
    <motion.div
      initial={{ scale: 0, rotateY: 180 }}
      animate={{ scale: 1, rotateY: 0 }}
      transition={{ 
        type: 'spring', 
        stiffness: 300, 
        damping: 20,
        delay 
      }}
      className={cn(
        'w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center text-xl md:text-2xl font-bold shadow-lg transition-all',
        isDrawn && isMatched && 'bg-accent text-accent-foreground glow-teal',
        isDrawn && !isMatched && 'bg-secondary text-foreground',
        !isDrawn && 'bg-primary text-primary-foreground glow-purple'
      )}
    >
      {number !== null ? number : '?'}
    </motion.div>
  )
}

function PrizePoolBar({
  label,
  percentage,
  amount,
  winners,
  color
}: {
  label: string
  percentage: number
  amount: number
  winners: number
  color: 'primary' | 'accent' | 'muted'
}) {
  const colorClasses = {
    primary: 'bg-primary',
    accent: 'bg-accent',
    muted: 'bg-muted-foreground'
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-2"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-semibold">{label}</span>
          <Badge variant="outline" className="text-xs">
            {winners} winner{winners !== 1 ? 's' : ''}
          </Badge>
        </div>
        <span className="text-lg font-bold">${new Intl.NumberFormat('en-US').format(amount)}</span>
      </div>
      <div className="h-3 bg-secondary rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className={cn('h-full rounded-full', colorClasses[color])}
        />
      </div>
      <p className="text-xs text-muted-foreground text-right">{percentage}% of pool</p>
    </motion.div>
  )
}

export default function DrawPage() {
  const [activeSubscribers, setActiveSubscribers] = useState(mockPrizePool.activeSubscribers)
  const [isSimulating, setIsSimulating] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [carriedJackpot] = useState(0)
  const [drawMode, setDrawMode] = useState<DrawLogicMode>('random')
  const [winningNumbers, setWinningNumbers] = useState<number[]>(mockDrawResult.winningNumbers)

  // Simulate subscriber count updates
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSubscribers(prev => {
        const change = Math.floor(Math.random() * 5) - 2
        return Math.max(1000, prev + change)
      })
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  const winnerCounts = {
    '5-match': mockDrawResult.winners.fiveMatch.length,
    '4-match': mockDrawResult.winners.fourMatch.length,
    '3-match': mockDrawResult.winners.threeMatch.length,
  } as const

  const distribution = calculatePrizeDistribution({
    activeSubscribers,
    winnerCounts,
    carriedJackpot,
  })

  const prizePool = distribution.basePool
  const fiveMatchPrize = distribution.tiers['5-match'].pool
  const fourMatchPrize = distribution.tiers['4-match'].pool
  const threeMatchPrize = distribution.tiers['3-match'].pool

  const userNumbers = mockUser.scores.map(s => s.value)

  // Check matches
  const matchedNumbers = userNumbers.filter(n => winningNumbers.includes(n))
  const matchCount = matchedNumbers.length

  const simulateDraw = () => {
    setIsSimulating(true)
    setShowResults(false)
    
    // Use real engine logic for simulation
    // In a real app, userScores would come from all active users in the DB
    // For this simulation, we'll use a larger set of mock scores
    const allUserScores = [
      ...mockUser.scores.map(s => s.value),
      36, 38, 34, 40, 35, 22, 18, 42, 45, 12, 36, 38, 40, 22, 18
    ]
    
    const result = engineSimulateDraw(drawMode, allUserScores)
    
    setTimeout(() => {
      setWinningNumbers(result.winningNumbers)
      setShowResults(true)
      setIsSimulating(false)
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-12">
        <SubscriptionGuard requiredTier="starter">
          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">
              <span className="text-gradient">The Draw Engine</span>
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Match 3, 4, or 5 of your rolling scores with the winning numbers to claim your share of the prize pool.
            </p>
          </motion.div>

          {/* Prize Pool Tracker */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-10"
          >
            <Card className="border-2 border-primary/30 bg-card/80 backdrop-blur glow-purple overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <CardTitle className="text-2xl flex items-center gap-2">
                      <Trophy className="h-6 w-6 text-primary" />
                      Current Prize Pool
                    </CardTitle>
                    <CardDescription>
                      Updated in real-time based on active subscribers
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Users className="h-4 w-4" />
                      <motion.span
                        key={activeSubscribers}
                        initial={{ scale: 1.2, color: 'var(--accent)' }}
                        animate={{ scale: 1, color: 'var(--foreground)' }}
                        className="font-mono font-semibold"
                      >
                        {new Intl.NumberFormat('en-US').format(activeSubscribers)}
                      </motion.span>
                      <span>Active</span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-center py-6">
                  <motion.p
                    key={prizePool}
                    initial={{ scale: 1.05 }}
                    animate={{ scale: 1 }}
                    className="text-5xl md:text-6xl font-bold text-gradient"
                  >
                    ${new Intl.NumberFormat('en-US').format(prizePool)}
                  </motion.p>
                  <p className="text-muted-foreground mt-2">Total Prize Pool</p>
                </div>

                <div className="grid md:grid-cols-3 gap-6 pt-6 border-t border-border/50">
                  <PrizePoolBar
                    label="5-Number Match"
                    percentage={40}
                    amount={Math.round(fiveMatchPrize)}
                    winners={distribution.tiers['5-match'].winners}
                    color="primary"
                  />
                  <PrizePoolBar
                    label="4-Number Match"
                    percentage={35}
                    amount={Math.round(fourMatchPrize)}
                    winners={distribution.tiers['4-match'].winners}
                    color="accent"
                  />
                  <PrizePoolBar
                    label="3-Number Match"
                    percentage={25}
                    amount={Math.round(threeMatchPrize)}
                    winners={distribution.tiers['3-match'].winners}
                    color="muted"
                  />
                </div>
                {distribution.nextJackpotRollover > 0 && (
                  <p className="text-sm text-muted-foreground mt-4 text-right">
                    5-match jackpot unclaimed. ${new Intl.NumberFormat('en-US').format(distribution.nextJackpotRollover)} rolls to next month.
                  </p>
                )}
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="mb-10"
          >
            <Card className="bg-card/50 border-border/50">
              <CardHeader>
                <CardTitle className="text-lg">Draw Operations</CardTitle>
                <CardDescription>
                  Draws run monthly with admin-controlled publishing and simulation before official release.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid md:grid-cols-2 gap-4 text-sm text-muted-foreground">
                <p>
                  <strong className="text-foreground">Draw types:</strong> 5-number, 4-number, and 3-number matches are evaluated for each result.
                </p>
                <p>
                  <strong className="text-foreground">Logic modes:</strong> random generation or algorithmic weighted selection based on score frequency.
                </p>
                <p>
                  <strong className="text-foreground">Cadence:</strong> monthly execution cycle with one official publish event each month.
                </p>
                <p>
                  <strong className="text-foreground">Rollover:</strong> jackpot rolls to the next month when there are no 5-match winners.
                </p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Draw Visualization */}
          <div className="grid lg:grid-cols-2 gap-6 mb-10">
            {/* Your Numbers */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="h-full bg-card/50 border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-primary" />
                    Your Numbers
                  </CardTitle>
                  <CardDescription>
                    Your 5 rolling Stableford scores
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-center gap-3 flex-wrap">
                    {userNumbers.map((num, i) => (
                      <NumberBall 
                        key={i} 
                        number={num} 
                        isDrawn={false}
                        isMatched={showResults && winningNumbers.includes(num)}
                        delay={i * 0.1}
                      />
                    ))}
                  </div>
                  {userNumbers.length < 5 && (
                    <p className="text-center text-sm text-muted-foreground mt-4">
                      Add {5 - userNumbers.length} more score{5 - userNumbers.length !== 1 ? 's' : ''} to complete your entry
                    </p>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Winning Numbers */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.25 }}
            >
              <Card className="h-full bg-card/50 border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-accent" />
                    Winning Numbers
                  </CardTitle>
                  <CardDescription>
                    This week&apos;s drawn numbers
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <AnimatePresence mode="wait">
                    {!showResults && !isSimulating ? (
                      <motion.div
                        key="pending"
                        exit={{ opacity: 0 }}
                        className="flex items-center justify-center gap-3 flex-wrap"
                      >
                        {[...Array(5)].map((_, i) => (
                          <div
                            key={i}
                            className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-secondary/50 border-2 border-dashed border-border flex items-center justify-center"
                          >
                            <Clock className="h-5 w-5 text-muted-foreground" />
                          </div>
                        ))}
                      </motion.div>
                    ) : isSimulating ? (
                      <motion.div
                        key="simulating"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center justify-center gap-3 flex-wrap"
                      >
                        {[...Array(5)].map((_, i) => (
                          <motion.div
                            key={i}
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: 'linear', delay: i * 0.1 }}
                            className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-primary/20 flex items-center justify-center"
                          >
                            <RefreshCw className="h-5 w-5 text-primary" />
                          </motion.div>
                        ))}
                      </motion.div>
                    ) : (
                      <motion.div
                        key="results"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex items-center justify-center gap-3 flex-wrap"
                      >
                        {winningNumbers.map((num, i) => (
                          <NumberBall 
                            key={i} 
                            number={num} 
                            isDrawn={true}
                            isMatched={userNumbers.includes(num)}
                            delay={i * 0.15}
                          />
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="text-center mt-6 space-y-6">
                    <div className="flex flex-col items-center gap-3">
                      <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Draw Logic Option</p>
                      <Tabs 
                        defaultValue="random" 
                        onValueChange={(v) => setDrawMode(v as DrawLogicMode)}
                        className="w-full max-w-[300px]"
                      >
                        <TabsList className="grid w-full grid-cols-2">
                          <TabsTrigger value="random">Random</TabsTrigger>
                          <TabsTrigger value="algorithmic">Algorithmic</TabsTrigger>
                        </TabsList>
                      </Tabs>
                      <p className="text-[10px] text-muted-foreground italic">
                        {drawMode === 'random' 
                          ? 'Standard lottery-style: Purely random selection.' 
                          : 'Algorithmic: Weighted by most/least frequent user scores.'}
                      </p>
                    </div>

                    <Button
                      onClick={simulateDraw}
                      disabled={isSimulating}
                      className="w-full md:w-auto bg-primary text-primary-foreground hover:bg-primary/90"
                    >
                      {isSimulating ? (
                        <>
                          <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                          Drawing...
                        </>
                      ) : (
                        <>
                          <Zap className="h-4 w-4 mr-2" />
                          Simulate Draw
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Results Section */}
          <AnimatePresence>
            {showResults && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
              >
                <Card className={cn(
                  'border-2',
                  matchCount >= 5 && 'border-primary glow-purple bg-primary/10',
                  matchCount >= 3 && matchCount < 5 && 'border-accent glow-teal bg-accent/10',
                  matchCount < 3 && 'border-border bg-card/50'
                )}>
                  <CardContent className="py-8 text-center">
                    {matchCount >= 3 ? (
                      <div className="space-y-4">
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: 'spring', stiffness: 300 }}
                        >
                          <Gift className={cn(
                            'h-16 w-16 mx-auto',
                            matchCount >= 5 ? 'text-primary' : 'text-accent'
                          )} />
                        </motion.div>
                        <h3 className="text-2xl font-bold">
                          {matchCount === 5 && 'JACKPOT! 5-Number Match!'}
                          {matchCount === 4 && 'Amazing! 4-Number Match!'}
                          {matchCount === 3 && 'Winner! 3-Number Match!'}
                        </h3>
                        <p className="text-muted-foreground">
                          You matched: {matchedNumbers.join(', ')}
                        </p>
                        <div className="pt-4">
                          <p className="text-sm text-muted-foreground">Your Estimated Prize</p>
                          <p className="text-4xl font-bold text-gradient">
                          ${new Intl.NumberFormat('en-US').format(
                            matchCount === 5 
                              ? Math.round(distribution.tiers['5-match'].payoutPerWinner)
                              : matchCount === 4
                              ? Math.round(distribution.tiers['4-match'].payoutPerWinner)
                              : Math.round(distribution.tiers['3-match'].payoutPerWinner)
                          )}
                        </p>
                        </div>
                        <Button className="mt-4 bg-accent text-accent-foreground hover:bg-accent/90">
                          Claim Your Prize
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <CheckCircle2 className="h-12 w-12 mx-auto text-muted-foreground" />
                        <h3 className="text-xl font-semibold">
                          {matchCount > 0 
                            ? `${matchCount} Match${matchCount !== 1 ? 'es' : ''} - Keep Playing!`
                            : 'No Matches This Time'
                          }
                        </h3>
                        <p className="text-muted-foreground">
                          Keep submitting scores for more chances to win!
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          {/* How It Works */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-12"
          >
            <Card className="bg-secondary/30 border-border/50">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-primary" />
                  Prize Pool Distribution
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-2">
                <p>
                  <strong className="text-foreground">40% (5-Number Match):</strong> Jackpot tier. If no winner, this amount rolls into next month.
                </p>
                <p>
                  <strong className="text-foreground">35% (4-Number Match):</strong> Split equally among all players who match exactly 4 numbers.
                </p>
                <p>
                  <strong className="text-foreground">25% (3-Number Match):</strong> Split equally among all players who match exactly 3 numbers.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </SubscriptionGuard>
      </main>
    </div>
  )
}
