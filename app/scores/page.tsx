'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Calendar, MapPin, Target, TrendingUp, Award } from 'lucide-react'
import { Navigation } from '@/components/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { cn } from '@/lib/utils'
import type { Score } from '@/lib/types'
import { SubscriptionGuard } from '@/components/subscription-guard'

const initialScores: Score[] = [
  { id: '1', value: 36, date: '2026-04-20', course: 'Pebble Beach' },
  { id: '2', value: 38, date: '2026-04-15', course: 'Augusta National' },
  { id: '3', value: 34, date: '2026-04-10', course: 'St Andrews' },
  { id: '4', value: 40, date: '2026-04-05', course: 'Torrey Pines' },
  { id: '5', value: 35, date: '2026-04-01', course: 'Whistling Straits' },
]

const MAX_SCORES = 5
const MIN_SCORE = 1
const MAX_SCORE = 45

function sortScoresByDateDesc(scores: Score[]) {
  return [...scores].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )
}

function ScoreCard({ 
  score, 
  index, 
  isLatest 
}: { 
  score: Score
  index: number
  isLatest: boolean
}) {
  const getScoreColor = (value: number) => {
    if (value >= 38) return 'text-accent'
    if (value >= 34) return 'text-primary'
    return 'text-foreground'
  }

  const getScoreLabel = (value: number) => {
    if (value >= 40) return 'Exceptional'
    if (value >= 38) return 'Excellent'
    if (value >= 36) return 'Great'
    if (value >= 34) return 'Good'
    return 'Solid'
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 50, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: -50, scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      <Card className={cn(
        'relative overflow-hidden border-2 transition-all duration-300 group',
        isLatest 
          ? 'border-primary glow-purple bg-card' 
          : 'border-border/50 bg-card/50 hover:border-border'
      )}>
        {isLatest && (
          <div className="absolute top-2 right-2">
            <span className="bg-primary/20 text-primary text-xs font-medium px-2 py-0.5 rounded-full">
              Latest
            </span>
          </div>
        )}
        
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="flex items-baseline gap-2">
                <span className={cn('text-5xl font-bold tracking-tight', getScoreColor(score.value))}>
                  {score.value}
                </span>
                <span className="text-sm text-muted-foreground">pts</span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">{getScoreLabel(score.value)}</p>
            </div>
            
          </div>
          
          <div className="space-y-2 pt-4 border-t border-border/50">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>{score.course || 'Unknown Course'}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>{new Date(score.date).toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric',
                year: 'numeric'
              })}</span>
            </div>
          </div>
          
          {/* Position Indicator */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-accent to-primary opacity-30" 
               style={{ width: `${(index + 1) * 20}%` }} />
        </CardContent>
      </Card>
    </motion.div>
  )
}

function AddScoreDialog({ onAdd }: { onAdd: (score: Omit<Score, 'id'>) => void }) {
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState('')
  const [course, setCourse] = useState('')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [error, setError] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const scoreValue = parseInt(value)
    const selectedDate = date.trim()

    if (!selectedDate) {
      setError('Date is required.')
      return
    }

    if (Number.isNaN(scoreValue) || scoreValue < MIN_SCORE || scoreValue > MAX_SCORE) {
      setError(`Stableford score must be between ${MIN_SCORE} and ${MAX_SCORE}.`)
      return
    }

    onAdd({ value: scoreValue, course, date: selectedDate })
    setValue('')
    setCourse('')
    setDate(new Date().toISOString().split('T')[0])
    setError('')
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
          <Plus className="h-4 w-4" />
          Add Score
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-card border-border">
        <DialogHeader>
          <DialogTitle>Add New Score</DialogTitle>
          <DialogDescription>
            Enter your Stableford score (1-45) from your latest round.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="score">Stableford Score</Label>
              <Input
                id="score"
                type="number"
                min={1}
                max={45}
                placeholder="Enter score (1-45)"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="bg-input border-border text-foreground text-lg"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="course">Course Name</Label>
              <Input
                id="course"
                type="text"
                placeholder="e.g., Pebble Beach"
                value={course}
                onChange={(e) => setCourse(e.target.value)}
                className="bg-input border-border text-foreground"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="date">Date Played</Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="bg-input border-border text-foreground"
                required
              />
            </div>
            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90">
              Add Score
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default function ScoresPage() {
  const [scores, setScores] = useState<Score[]>(
    sortScoresByDateDesc(initialScores).slice(0, MAX_SCORES)
  )

  const addScore = (newScore: Omit<Score, 'id'>) => {
    const scoreWithId = {
      ...newScore,
      id: Date.now().toString(),
    }
    
    setScores(prev => {
      const updated = sortScoresByDateDesc([...prev, scoreWithId])
      return updated.slice(0, MAX_SCORES)
    })
  }

  const avgScore = scores.length > 0 
    ? (scores.reduce((sum, s) => sum + s.value, 0) / scores.length).toFixed(1)
    : 0

  const bestScore = scores.length > 0 
    ? Math.max(...scores.map(s => s.value))
    : 0

  const drawNumbers = scores.map(s => s.value)

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-12">
        <SubscriptionGuard requiredTier="starter">
          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12"
          >
            <div>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">
                <span className="text-gradient">Your Rolling Scores</span>
              </h1>
              <p className="text-muted-foreground">
                Your latest 5 scores are automatically entered into the monthly draw.
              </p>
            </div>
            
            <AddScoreDialog onAdd={addScore} />
          </motion.div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            <Card className="bg-card/50 border-border/50">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-2">
                  <Award className="h-5 w-5 text-primary" />
                  <span className="text-sm text-muted-foreground font-medium uppercase tracking-wider">Average</span>
                </div>
                <p className="text-3xl font-bold text-foreground">{avgScore}</p>
              </CardContent>
            </Card>
            
            <Card className="bg-card/50 border-border/50">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-2">
                  <Target className="h-5 w-5 text-accent" />
                  <span className="text-sm text-muted-foreground font-medium uppercase tracking-wider">Best</span>
                </div>
                <p className="text-3xl font-bold text-foreground">{bestScore}</p>
              </CardContent>
            </Card>

            <Card className="bg-card/50 border-border/50">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  <span className="text-sm text-muted-foreground font-medium uppercase tracking-wider">Draw Entry</span>
                </div>
                <div className="flex gap-1">
                  {drawNumbers.map((n, i) => (
                    <span key={i} className="text-xs font-bold text-primary bg-primary/10 w-6 h-6 rounded flex items-center justify-center">
                      {n}
                    </span>
                  ))}
                  {[...Array(5 - drawNumbers.length)].map((_, i) => (
                    <span key={i} className="text-xs font-bold text-muted-foreground bg-muted/10 w-6 h-6 rounded flex items-center justify-center">
                      -
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card/50 border-border/50">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-2">
                  <Calendar className="h-5 w-5 text-accent" />
                  <span className="text-sm text-muted-foreground font-medium uppercase tracking-wider">Rounds</span>
                </div>
                <p className="text-3xl font-bold text-foreground">{scores.length}</p>
              </CardContent>
            </Card>
          </div>

          {/* Scores List */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            <AnimatePresence mode="popLayout">
              {scores.map((score, index) => (
                <ScoreCard 
                  key={score.id} 
                  score={score} 
                  index={index} 
                  isLatest={index === 0} 
                />
              ))}
            </AnimatePresence>
            
            {scores.length < MAX_SCORES && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center justify-center p-6 border-2 border-dashed border-border rounded-xl bg-muted/30"
              >
                <div className="text-center">
                  <div className="w-12 h-12 bg-background rounded-full flex items-center justify-center mx-auto mb-3">
                    <Plus className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <p className="text-sm text-muted-foreground font-medium">Empty Slot</p>
                  <p className="text-xs text-muted-foreground/60">Add a score to complete your entry</p>
                </div>
              </motion.div>
            )}
          </div>
        </SubscriptionGuard>
      </main>
    </div>
  )
}
