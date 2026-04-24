'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Shield, 
  Users, 
  Trophy, 
  Heart, 
  DollarSign,
  Play,
  CheckCircle,
  Clock,
  Image,
  Eye,
  Trash2,
  Plus,
  Edit,
  X,
  RefreshCw,
  BarChart3,
  AlertCircle,
  FileCheck
} from 'lucide-react'
import { Navigation } from '@/components/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
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
import { mockAdminStats, mockDrawResult, charities } from '@/lib/mock-data'
import {
  type DrawLogicMode,
  simulateDraw,
} from '@/lib/draw-engine'
import { calculatePrizeDistribution } from '@/lib/prize-pool'
import { AdminGuard } from '@/components/admin-guard'
import { useAdmin } from '@/lib/admin-context'

const adminNavItems = [
  { id: 'users', label: 'User Management', icon: Users },
  { id: 'overview', label: 'Overview', icon: BarChart3 },
  { id: 'draws', label: 'Draw Management', icon: Trophy },
  { id: 'verification', label: 'Winners Management', icon: FileCheck },
  { id: 'charities', label: 'Charity Management', icon: Heart },
  { id: 'reports', label: 'Reports & Analytics', icon: BarChart3 },
]

function StatCard({
  title,
  value,
  icon: Icon,
  color = 'primary',
  trend,
}: {
  title: string
  value: string | number
  icon: React.ElementType
  color?: 'primary' | 'accent' | 'success' | 'warning'
  trend?: string
}) {
  const colorClasses = {
    primary: 'bg-primary/10 text-primary',
    accent: 'bg-accent/10 text-accent',
    success: 'bg-success/10 text-success',
    warning: 'bg-warning/10 text-warning',
  }

  return (
    <Card className="bg-card/50 border-border/50">
      <CardContent className="p-6">
        <div className="flex items-center gap-4">
          <div className={cn('p-3 rounded-xl', colorClasses[color])}>
            <Icon className="h-6 w-6" />
          </div>
          <div>
            <p className="text-2xl font-bold">{value}</p>
            <p className="text-sm text-muted-foreground">{title}</p>
            {trend && (
              <p className="text-xs text-success mt-1">{trend}</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function OverviewSection() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Subscribers"
          value={mockAdminStats.totalSubscribers.toLocaleString()}
          icon={Users}
          color="primary"
          trend="+5.2% this week"
        />
        <StatCard
          title="Active Draws"
          value={mockAdminStats.activeDraws}
          icon={Trophy}
          color="accent"
        />
        <StatCard
          title="Pending Verifications"
          value={mockAdminStats.pendingVerifications}
          icon={Clock}
          color="warning"
        />
        <StatCard
          title="Charity Contributions"
          value={`$${mockAdminStats.totalCharityContributions.toLocaleString()}`}
          icon={Heart}
          color="success"
        />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="bg-card/50 border-border/50">
          <CardHeader>
            <CardTitle className="text-lg">Revenue Overview</CardTitle>
            <CardDescription>Monthly subscription revenue</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-3xl font-bold text-gradient">
                    ${mockAdminStats.monthlyRevenue.toLocaleString()}
                  </p>
                  <p className="text-sm text-muted-foreground">This month</p>
                </div>
                <Badge className="bg-success/20 text-success border-0">
                  +12% vs last month
                </Badge>
              </div>
              <Progress value={78} className="h-2" />
              <p className="text-xs text-muted-foreground">
                78% of monthly target ($32,000)
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 border-border/50">
          <CardHeader>
            <CardTitle className="text-lg">Quick Actions</CardTitle>
            <CardDescription>Common administrative tasks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full justify-start gap-3 bg-primary/10 text-primary hover:bg-primary/20">
              <Play className="h-4 w-4" />
              Run New Draw Simulation
            </Button>
            <Button variant="outline" className="w-full justify-start gap-3">
              <FileCheck className="h-4 w-4" />
              Review Pending Verifications ({mockAdminStats.pendingVerifications})
            </Button>
            <Button variant="outline" className="w-full justify-start gap-3">
              <Plus className="h-4 w-4" />
              Add New Charity
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function DrawSimulationsSection() {
  const [isSimulating, setIsSimulating] = useState(false)
  const [simulationResult, setSimulationResult] = useState<number[] | null>(null)
  const [drawLogicMode, setDrawLogicMode] = useState<DrawLogicMode>('random')
  const [officialPublishedResult, setOfficialPublishedResult] = useState<number[] | null>(null)
  const [fiveMatchWinners, setFiveMatchWinners] = useState(mockDrawResult.winners.fiveMatch.length)
  const [jackpotRollover, setJackpotRollover] = useState(0)
  const [lastPublishedAt, setLastPublishedAt] = useState<string | null>(null)
  const [fourMatchWinners] = useState(mockDrawResult.winners.fourMatch.length)
  const [threeMatchWinners] = useState(mockDrawResult.winners.threeMatch.length)

  const distribution = calculatePrizeDistribution({
    activeSubscribers: mockAdminStats.totalSubscribers,
    winnerCounts: {
      '5-match': fiveMatchWinners,
      '4-match': fourMatchWinners,
      '3-match': threeMatchWinners,
    },
    carriedJackpot: jackpotRollover,
  })

  const runSimulation = () => {
    setIsSimulating(true)
    setSimulationResult(null)
    setTimeout(() => {
      const simulated = simulateDraw(
        drawLogicMode,
        mockDrawResult.winningNumbers
      )
      setSimulationResult(simulated.winningNumbers)
      setIsSimulating(false)
    }, 2000)
  }

  const publishOfficialResults = () => {
    if (!simulationResult) return

    setOfficialPublishedResult(simulationResult)
    setLastPublishedAt(new Date().toISOString())
    setJackpotRollover(distribution.nextJackpotRollover)
  }

  return (
    <div className="space-y-6">
      <Card className="bg-card/50 border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-primary" />
            Draw Simulation Engine
          </CardTitle>
          <CardDescription>
            Run pre-analysis simulations before executing the live draw
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-4 gap-4">
            <div className="p-4 rounded-lg border border-border/40 bg-secondary/20">
              <p className="text-xs text-muted-foreground">Cadence</p>
              <p className="font-semibold">Monthly (1x per month)</p>
            </div>
            <div className="p-4 rounded-lg border border-border/40 bg-secondary/20">
              <p className="text-xs text-muted-foreground">Official Publish</p>
              <p className="font-semibold">{officialPublishedResult ? 'Published' : 'Pending'}</p>
            </div>
            <div className="p-4 rounded-lg border border-border/40 bg-secondary/20">
              <p className="text-xs text-muted-foreground">5-Match Winners</p>
              <p className="font-semibold">{fiveMatchWinners}</p>
            </div>
            <div className="p-4 rounded-lg border border-border/40 bg-secondary/20">
              <p className="text-xs text-muted-foreground">Jackpot Rollover</p>
              <p className="font-semibold">${jackpotRollover.toLocaleString()}</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-medium">Simulation Parameters</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between py-2 border-b border-border/30">
                  <span className="text-sm text-muted-foreground">Active Subscribers</span>
                  <span className="font-mono">{mockAdminStats.totalSubscribers}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-border/30">
                  <span className="text-sm text-muted-foreground">Prize Pool</span>
                  <span className="font-mono">${distribution.basePool.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-border/30">
                  <span className="text-sm text-muted-foreground">Draw Types</span>
                  <div className="flex gap-1">
                    <Badge variant="outline">5-Number</Badge>
                    <Badge variant="outline">4-Number</Badge>
                    <Badge variant="outline">3-Number</Badge>
                  </div>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-border/30">
                  <span className="text-sm text-muted-foreground">Draw Logic</span>
                  <Select
                    value={drawLogicMode}
                    onValueChange={(value) => setDrawLogicMode(value as DrawLogicMode)}
                  >
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Select logic mode" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="random">Random generation</SelectItem>
                      <SelectItem value="algorithmic">Algorithmic weighted</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-border/30">
                  <span className="text-sm text-muted-foreground">5-Match Winners</span>
                  <Input
                    type="number"
                    min={0}
                    value={fiveMatchWinners}
                    onChange={(e) => setFiveMatchWinners(Number(e.target.value) || 0)}
                    className="w-24 h-8 bg-input border-border text-foreground"
                  />
                </div>
                <div className="flex items-center justify-between py-2 border-b border-border/30">
                  <span className="text-sm text-muted-foreground">5-Match Pool (40%)</span>
                  <span className="font-mono">${distribution.tiers['5-match'].pool.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-border/30">
                  <span className="text-sm text-muted-foreground">4-Match Pool (35%)</span>
                  <span className="font-mono">${distribution.tiers['4-match'].pool.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-border/30">
                  <span className="text-sm text-muted-foreground">3-Match Pool (25%)</span>
                  <span className="font-mono">${distribution.tiers['3-match'].pool.toLocaleString()}</span>
                </div>
              </div>
              <Button 
                onClick={runSimulation}
                disabled={isSimulating}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
              >
                {isSimulating ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Simulating...
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 mr-2" />
                    Run Simulation
                  </>
                )}
              </Button>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium">Simulation Result</h4>
              <div className="min-h-[120px] flex items-center justify-center">
                <AnimatePresence mode="wait">
                  {isSimulating ? (
                    <motion.div
                      key="loading"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex gap-2"
                    >
                      {[...Array(5)].map((_, i) => (
                        <motion.div
                          key={i}
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, delay: i * 0.1 }}
                          className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center"
                        >
                          <RefreshCw className="h-5 w-5 text-primary" />
                        </motion.div>
                      ))}
                    </motion.div>
                  ) : simulationResult ? (
                    <motion.div
                      key="result"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex gap-2"
                    >
                      {simulationResult.map((num, i) => (
                        <motion.div
                          key={i}
                          initial={{ scale: 0, rotateY: 180 }}
                          animate={{ scale: 1, rotateY: 0 }}
                          transition={{ delay: i * 0.1 }}
                          className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg glow-purple"
                        >
                          {num}
                        </motion.div>
                      ))}
                    </motion.div>
                  ) : (
                    <motion.div
                      key="empty"
                      className="text-center text-muted-foreground"
                    >
                      <Trophy className="h-10 w-10 mx-auto mb-2 opacity-30" />
                      <p className="text-sm">Run a simulation to see results</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              {simulationResult && (
                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1" onClick={runSimulation}>
                    Re-run
                  </Button>
                  <Button
                    onClick={publishOfficialResults}
                    className="flex-1 bg-accent text-accent-foreground hover:bg-accent/90"
                  >
                    Publish Official Draw
                  </Button>
                </div>
              )}
              {officialPublishedResult && (
                <p className="text-xs text-muted-foreground">
                  Published {lastPublishedAt ? new Date(lastPublishedAt).toLocaleString() : 'just now'}.
                  {' '}5-match payout per winner: ${distribution.tiers['5-match'].payoutPerWinner.toLocaleString()}.
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Draws Table */}
      <Card className="bg-card/50 border-border/50">
        <CardHeader>
          <CardTitle className="text-lg">Recent Draws</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-border/30">
                <TableHead>Date</TableHead>
                <TableHead>Winning Numbers</TableHead>
                <TableHead>Prize Pool</TableHead>
                <TableHead>Winners</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow className="border-border/30">
                <TableCell>{new Date(mockDrawResult.date).toLocaleDateString()}</TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    {(officialPublishedResult ?? mockDrawResult.winningNumbers).map((n, i) => (
                      <span key={i} className="font-mono text-xs bg-primary/20 text-primary px-2 py-0.5 rounded">
                        {n}
                      </span>
                    ))}
                  </div>
                </TableCell>
                <TableCell>${distribution.totalPoolWithRollover.toLocaleString()}</TableCell>
                <TableCell>
                  {fiveMatchWinners + fourMatchWinners + threeMatchWinners}
                </TableCell>
                <TableCell>
                  <Badge className="bg-success/20 text-success border-0">
                    {officialPublishedResult ? 'Published' : 'Simulated'}
                  </Badge>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

function VerificationSection() {
  const initialWinners = [
    ...mockDrawResult.winners.fiveMatch.map(w => ({ ...w, tier: '5-Match' })),
    ...mockDrawResult.winners.fourMatch.map(w => ({ ...w, tier: '4-Match' })),
    ...mockDrawResult.winners.threeMatch.map(w => ({ ...w, tier: '3-Match' })),
  ]

  const [winnerSubmissions, setWinnerSubmissions] = useState(
    initialWinners.map((winner) => ({
      ...winner,
      reviewStatus:
        winner.status === 'verified' || winner.status === 'paid'
          ? 'approved'
          : 'pending',
      paymentStatus: winner.status === 'paid' ? 'paid' : 'pending',
    }))
  )

  const pendingWinners = winnerSubmissions.filter(
    (winner) => winner.reviewStatus === 'pending'
  )

  const updateWinner = (
    winnerId: string,
    updater: (winner: (typeof winnerSubmissions)[number]) => (typeof winnerSubmissions)[number]
  ) => {
    setWinnerSubmissions((prev) =>
      prev.map((winner) => (winner.userId === winnerId ? updater(winner) : winner))
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold">Winner Verification Queue</h3>
          <p className="text-sm text-muted-foreground">
            Eligibility verification applies to winners only. Upload score screenshots, then approve or reject.
          </p>
        </div>
        <Badge className="bg-warning/20 text-warning border-0">
          {pendingWinners.length} Pending
        </Badge>
      </div>

      <div className="space-y-4">
        {winnerSubmissions.map((winner, index) => (
          <motion.div
            key={winner.userId}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card className={cn(
              'bg-card/50 border-border/50',
              winner.status === 'pending' && 'border-warning/50'
            )}>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      'w-12 h-12 rounded-full flex items-center justify-center',
                      winner.paymentStatus === 'paid' && 'bg-success/20',
                      winner.reviewStatus === 'approved' && winner.paymentStatus !== 'paid' && 'bg-accent/20',
                      winner.reviewStatus === 'pending' && 'bg-warning/20',
                      winner.reviewStatus === 'rejected' && 'bg-destructive/20'
                    )}>
                      {winner.paymentStatus === 'paid' && <CheckCircle className="h-6 w-6 text-success" />}
                      {winner.reviewStatus === 'approved' && winner.paymentStatus !== 'paid' && <FileCheck className="h-6 w-6 text-accent" />}
                      {winner.reviewStatus === 'pending' && <Clock className="h-6 w-6 text-warning" />}
                      {winner.reviewStatus === 'rejected' && <X className="h-6 w-6 text-destructive" />}
                    </div>
                    <div>
                      <p className="font-semibold">{winner.userName}</p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Badge variant="outline" className="text-xs">{winner.tier}</Badge>
                        <span>•</span>
                        <span>Matched: {winner.matchedNumbers.join(', ')}</span>
                        <span>•</span>
                        <span>Payment: {winner.paymentStatus}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-xl font-bold">${winner.prizeAmount.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">Prize Amount</p>
                    </div>

                    <div className="flex gap-2">
                      {winner.proofUrl ? (
                        <Button variant="outline" size="sm" className="gap-1">
                          <Image className="h-4 w-4" />
                          View Proof
                        </Button>
                      ) : winner.reviewStatus === 'pending' ? (
                        <Badge variant="outline" className="text-warning">
                          <AlertCircle className="h-3 w-3 mr-1" />
                          Awaiting Upload
                        </Badge>
                      ) : null}

                      {winner.reviewStatus === 'pending' && (
                        <label className="inline-flex items-center gap-1 rounded-md border border-border px-3 py-1.5 text-sm cursor-pointer hover:bg-muted/50">
                          <Image className="h-4 w-4" />
                          Upload Proof
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(event) => {
                              const file = event.target.files?.[0]
                              if (!file) return
                              updateWinner(winner.userId, (current) => ({
                                ...current,
                                proofUrl: file.name,
                                reviewStatus: 'pending',
                              }))
                            }}
                          />
                        </label>
                      )}

                      {winner.reviewStatus === 'pending' && (
                        <>
                          <Button
                            size="sm"
                            className="bg-success/20 text-success hover:bg-success/30"
                            disabled={!winner.proofUrl}
                            onClick={() =>
                              updateWinner(winner.userId, (current) => ({
                                ...current,
                                reviewStatus: 'approved',
                              }))
                            }
                          >
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-destructive hover:text-destructive"
                            onClick={() =>
                              updateWinner(winner.userId, (current) => ({
                                ...current,
                                reviewStatus: 'rejected',
                                paymentStatus: 'pending',
                              }))
                            }
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </>
                      )}

                      {winner.reviewStatus === 'approved' && winner.paymentStatus === 'pending' && (
                        <Button
                          size="sm"
                          className="bg-accent text-accent-foreground hover:bg-accent/90"
                          onClick={() =>
                            updateWinner(winner.userId, (current) => ({
                              ...current,
                              paymentStatus: 'paid',
                            }))
                          }
                        >
                          Mark Paid
                        </Button>
                      )}

                      {winner.reviewStatus === 'rejected' && (
                        <Badge variant="outline" className="text-destructive">
                          Rejected
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

function CharityManagementSection() {
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [charityItems, setCharityItems] = useState(charities)
  const [editingCharityId, setEditingCharityId] = useState<string | null>(null)
  const [formName, setFormName] = useState('')
  const [formDescription, setFormDescription] = useState('')
  const [formCategory, setFormCategory] = useState('')
  const [formImpactPercentage, setFormImpactPercentage] = useState('10')
  const [formImageUrl, setFormImageUrl] = useState('')

  const resetForm = () => {
    setFormName('')
    setFormDescription('')
    setFormCategory('')
    setFormImpactPercentage('10')
    setFormImageUrl('')
  }

  const addCharity = () => {
    if (!formName.trim() || !formDescription.trim() || !formCategory.trim()) return
    setCharityItems((prev) => [
      {
        id: `charity-${Date.now()}`,
        name: formName.trim(),
        description: formDescription.trim(),
        longDescription: formDescription.trim(),
        category: formCategory.trim(),
        impactPercentage: Number(formImpactPercentage) || 10,
        isSpotlight: false,
        imageUrl: formImageUrl.trim() || '/charities/custom.jpg',
        galleryImages: formImageUrl.trim() ? [formImageUrl.trim()] : [],
        upcomingEvents: [],
        totalRaised: 0,
      },
      ...prev,
    ])
    setShowAddDialog(false)
    resetForm()
  }

  const beginEditCharity = (charityId: string) => {
    const charity = charityItems.find((item) => item.id === charityId)
    if (!charity) return
    setEditingCharityId(charityId)
    setFormName(charity.name)
    setFormDescription(charity.description)
    setFormCategory(charity.category)
    setFormImpactPercentage(String(charity.impactPercentage))
    setFormImageUrl(charity.imageUrl)
  }

  const saveEditCharity = () => {
    if (!editingCharityId) return
    setCharityItems((prev) =>
      prev.map((charity) =>
        charity.id === editingCharityId
          ? {
              ...charity,
              name: formName.trim() || charity.name,
              description: formDescription.trim() || charity.description,
              longDescription: formDescription.trim() || charity.longDescription,
              category: formCategory.trim() || charity.category,
              impactPercentage: Number(formImpactPercentage) || charity.impactPercentage,
              imageUrl: formImageUrl.trim() || charity.imageUrl,
            }
          : charity
      )
    )
    setEditingCharityId(null)
    resetForm()
  }

  const deleteCharity = (charityId: string) => {
    setCharityItems((prev) => prev.filter((charity) => charity.id !== charityId))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold">Charity Management</h3>
          <p className="text-sm text-muted-foreground">
            Add, edit, or remove charity partners
          </p>
        </div>
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
              <Plus className="h-4 w-4" />
              Add Charity
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card border-border">
            <DialogHeader>
              <DialogTitle>Add New Charity</DialogTitle>
              <DialogDescription>
                Enter the details for the new charity partner.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Charity Name</Label>
                <Input
                  placeholder="Enter charity name"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="bg-input border-border text-foreground"
                />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Input
                  placeholder="Brief description"
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="bg-input border-border text-foreground"
                />
              </div>
              <div className="space-y-2">
                <Label>Category</Label>
                <Input
                  placeholder="e.g., Youth Development"
                  value={formCategory}
                  onChange={(e) => setFormCategory(e.target.value)}
                  className="bg-input border-border text-foreground"
                />
              </div>
              <div className="space-y-2">
                <Label>Impact Percentage</Label>
                <Input
                  type="number"
                  placeholder="10"
                  min={1}
                  max={100}
                  value={formImpactPercentage}
                  onChange={(e) => setFormImpactPercentage(e.target.value)}
                  className="bg-input border-border text-foreground"
                />
              </div>
              <div className="space-y-2">
                <Label>Media URL</Label>
                <Input
                  placeholder="https://..."
                  value={formImageUrl}
                  onChange={(e) => setFormImageUrl(e.target.value)}
                  className="bg-input border-border text-foreground"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowAddDialog(false)}>Cancel</Button>
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90" onClick={addCharity}>
                Add Charity
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {charityItems.map((charity, index) => (
          <motion.div
            key={charity.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card className="bg-card/50 border-border/50 h-full">
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-base">{charity.name}</CardTitle>
                    {charity.isSpotlight && (
                      <Badge className="bg-primary/20 text-primary border-0 text-xs">
                        Spotlight
                      </Badge>
                    )}
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => beginEditCharity(charity.id)}
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive"
                      onClick={() => deleteCharity(charity.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                <Badge variant="outline" className="w-fit text-xs">
                  {charity.category}
                </Badge>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                  {charity.description}
                </p>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-accent font-semibold">{charity.impactPercentage}% Impact</span>
                  <span className="text-muted-foreground">${charity.totalRaised.toLocaleString()}</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {editingCharityId && (
        <Card className="bg-card/50 border-border/50">
          <CardHeader>
            <CardTitle className="text-lg">Edit Charity Content & Media</CardTitle>
            <CardDescription>Update profile content and media reference</CardDescription>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input value={formName} onChange={(e) => setFormName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Category</Label>
              <Input value={formCategory} onChange={(e) => setFormCategory(e.target.value)} />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label>Description</Label>
              <Input value={formDescription} onChange={(e) => setFormDescription(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Impact %</Label>
              <Input
                type="number"
                min={1}
                max={100}
                value={formImpactPercentage}
                onChange={(e) => setFormImpactPercentage(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Media URL</Label>
              <Input value={formImageUrl} onChange={(e) => setFormImageUrl(e.target.value)} />
            </div>
            <div className="md:col-span-2 flex gap-2">
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90" onClick={saveEditCharity}>
                Save Changes
              </Button>
              <Button variant="outline" onClick={() => setEditingCharityId(null)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

function UserManagementSection() {
  const [users, setUsers] = useState([
    {
      id: 'user-1',
      name: 'Alex Thompson',
      email: 'alex@example.com',
      subscriptionStatus: 'active',
      renewalDate: '2026-05-15',
      charityPercentage: 15,
      scores: [36, 38, 34, 40, 35],
    },
    {
      id: 'user-2',
      name: 'Sarah Chen',
      email: 'sarah@example.com',
      subscriptionStatus: 'inactive',
      renewalDate: '2026-04-30',
      charityPercentage: 20,
      scores: [41, 39, 37, 36, 40],
    },
  ])

  const updateUser = (userId: string, updater: (user: (typeof users)[number]) => (typeof users)[number]) => {
    setUsers((prev) => prev.map((user) => (user.id === userId ? updater(user) : user)))
  }

  return (
    <div className="space-y-6">
      <Card className="bg-card/50 border-border/50">
        <CardHeader>
          <CardTitle>User Management</CardTitle>
          <CardDescription>View/edit profiles, golf scores, and subscriptions</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {users.map((user) => (
            <div key={user.id} className="rounded-xl border border-border/40 p-4 space-y-3">
              <div className="grid md:grid-cols-3 gap-3">
                <div>
                  <Label>Name</Label>
                  <Input
                    value={user.name}
                    onChange={(e) =>
                      updateUser(user.id, (current) => ({ ...current, name: e.target.value }))
                    }
                  />
                </div>
                <div>
                  <Label>Email</Label>
                  <Input
                    value={user.email}
                    onChange={(e) =>
                      updateUser(user.id, (current) => ({ ...current, email: e.target.value }))
                    }
                  />
                </div>
                <div>
                  <Label>Subscription</Label>
                  <Select
                    value={user.subscriptionStatus}
                    onValueChange={(value) =>
                      updateUser(user.id, (current) => ({
                        ...current,
                        subscriptionStatus: value as 'active' | 'inactive',
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-3">
                <div>
                  <Label>Renewal Date</Label>
                  <Input
                    type="date"
                    value={user.renewalDate}
                    onChange={(e) =>
                      updateUser(user.id, (current) => ({ ...current, renewalDate: e.target.value }))
                    }
                  />
                </div>
                <div>
                  <Label>Charity Contribution %</Label>
                  <Input
                    type="number"
                    min={10}
                    max={100}
                    value={user.charityPercentage}
                    onChange={(e) =>
                      updateUser(user.id, (current) => ({
                        ...current,
                        charityPercentage: Number(e.target.value) || current.charityPercentage,
                      }))
                    }
                  />
                </div>
              </div>

              <div>
                <Label>Golf Scores (editable)</Label>
                <div className="grid grid-cols-5 gap-2 mt-2">
                  {user.scores.map((score, index) => (
                    <Input
                      key={`${user.id}-score-${index}`}
                      type="number"
                      min={1}
                      max={45}
                      value={score}
                      onChange={(e) =>
                        updateUser(user.id, (current) => {
                          const nextScores = [...current.scores]
                          nextScores[index] = Number(e.target.value) || score
                          return { ...current, scores: nextScores }
                        })
                      }
                    />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}

function ReportsAnalyticsSection() {
  const totalPrizePool = mockDrawResult.prizePool
  const totalWinners =
    mockDrawResult.winners.fiveMatch.length +
    mockDrawResult.winners.fourMatch.length +
    mockDrawResult.winners.threeMatch.length

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Users" value={mockAdminStats.totalSubscribers.toLocaleString()} icon={Users} />
        <StatCard title="Total Prize Pool" value={`$${totalPrizePool.toLocaleString()}`} icon={Trophy} color="accent" />
        <StatCard
          title="Charity Contributions"
          value={`$${mockAdminStats.totalCharityContributions.toLocaleString()}`}
          icon={Heart}
          color="success"
        />
        <StatCard title="Draw Winners" value={totalWinners} icon={FileCheck} color="warning" />
      </div>

      <Card className="bg-card/50 border-border/50">
        <CardHeader>
          <CardTitle>Draw Statistics</CardTitle>
          <CardDescription>Current draw performance and winner distribution</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-3 gap-4">
            <div className="rounded-lg border border-border/40 p-4">
              <p className="text-sm text-muted-foreground">5-Match Winners</p>
              <p className="text-2xl font-bold">{mockDrawResult.winners.fiveMatch.length}</p>
            </div>
            <div className="rounded-lg border border-border/40 p-4">
              <p className="text-sm text-muted-foreground">4-Match Winners</p>
              <p className="text-2xl font-bold">{mockDrawResult.winners.fourMatch.length}</p>
            </div>
            <div className="rounded-lg border border-border/40 p-4">
              <p className="text-sm text-muted-foreground">3-Match Winners</p>
              <p className="text-2xl font-bold">{mockDrawResult.winners.threeMatch.length}</p>
            </div>
          </div>
          <Progress value={72} className="h-2" />
          <p className="text-xs text-muted-foreground">
            Draw participation trend: 72% of active subscribers entered the latest cycle.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('overview')
  const { logout, adminName } = useAdmin()

  return (
    <AdminGuard>
      <div className="min-h-screen bg-background">
        <Navigation />
        
        <main className="container mx-auto px-4 py-8 md:py-12">
          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/20">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold tracking-tight">
                    <span className="text-gradient">Admin Control Center</span>
                  </h1>
                  <p className="text-sm text-muted-foreground">Welcome back, {adminName}</p>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={async () => await logout()} className="text-muted-foreground hover:text-destructive">
                Log Out
              </Button>
            </div>
          </motion.div>

          {/* Tabs Navigation */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="bg-secondary/50 p-1 h-auto flex-wrap">
              {adminNavItems.map(item => (
                <TabsTrigger
                  key={item.id}
                  value={item.id}
                  className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  <item.icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{item.label}</span>
                </TabsTrigger>
              ))}
            </TabsList>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <TabsContent value="overview" className="mt-0">
                  <OverviewSection />
                </TabsContent>
                <TabsContent value="users" className="mt-0">
                  <UserManagementSection />
                </TabsContent>
                <TabsContent value="draws" className="mt-0">
                  <DrawSimulationsSection />
                </TabsContent>
                <TabsContent value="verification" className="mt-0">
                  <VerificationSection />
                </TabsContent>
                <TabsContent value="charities" className="mt-0">
                  <CharityManagementSection />
                </TabsContent>
                <TabsContent value="reports" className="mt-0">
                  <ReportsAnalyticsSection />
                </TabsContent>
              </motion.div>
            </AnimatePresence>
          </Tabs>
        </main>
      </div>
    </AdminGuard>
  )
}
