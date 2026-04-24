"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Navigation } from "@/components/navigation";
import {
  Trophy,
  Heart,
  Target,
  TrendingUp,
  Wallet,
  Calendar,
  ArrowRight,
  Plus,
  Clock,
  CheckCircle2,
  AlertCircle,
  Upload,
  Pencil,
  Save,
  XCircle,
} from "lucide-react";
import { mockUser, charities, mockDrawResult } from "@/lib/mock-data";
import { SubscriptionGuard } from "@/components/subscription-guard";
import { UploadScoreCardDialog } from "@/components/upload-score-card-dialog";
import { ManageSubscriptionButton } from '@/components/manage-subscription-button';
import { useSubscription } from "@/lib/subscription-context";

export default function DashboardPage() {
  const { userName } = useSubscription();
  const [user] = useState(mockUser);
  const [userScores, setUserScores] = useState(
    [...user.scores]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5)
  );
  const [newScoreValue, setNewScoreValue] = useState("");
  const [newScoreDate, setNewScoreDate] = useState(new Date().toISOString().split("T")[0]);
  const [editingScoreId, setEditingScoreId] = useState<string | null>(null);
  const [editScoreValue, setEditScoreValue] = useState("");
  const [editScoreDate, setEditScoreDate] = useState("");
  const selectedCharity = charities.find((c) => c.id === user.selectedCharity?.id);
  const contributionPercentage = selectedCharity?.impactPercentage ?? 10;
  const nextDraw = {
    date: "2026-05-31",
    prizePool: 16000,
  };
  const lastDraw = mockDrawResult;

  const pendingWinnings = user.pendingWinnings;
  const paidWinnings = user.paidWinnings;
  const totalWon = pendingWinnings + paidWinnings;
  const drawsEntered = userScores.length;
  const paymentStatus = pendingWinnings > 0 ? "Pending verification" : "Paid";

  const addScore = () => {
    const value = Number(newScoreValue);
    if (!newScoreDate || Number.isNaN(value) || value < 1 || value > 45) return;
    const nextScores = [
      ...userScores,
      { id: Date.now().toString(), value, date: newScoreDate, course: "Manual Entry" },
    ]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5);
    setUserScores(nextScores);
    setNewScoreValue("");
    setNewScoreDate(new Date().toISOString().split("T")[0]);
  };

  const beginEditScore = (id: string) => {
    const score = userScores.find((item) => item.id === id);
    if (!score) return;
    setEditingScoreId(id);
    setEditScoreValue(String(score.value));
    setEditScoreDate(score.date);
  };

  const saveEditScore = () => {
    if (!editingScoreId) return;
    const value = Number(editScoreValue);
    if (!editScoreDate || Number.isNaN(value) || value < 1 || value > 45) return;
    const nextScores = userScores
      .map((score) =>
        score.id === editingScoreId ? { ...score, value, date: editScoreDate } : score
      )
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5);
    setUserScores(nextScores);
    setEditingScoreId(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="pt-20 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <SubscriptionGuard requiredTier="starter">
            {/* Welcome Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Welcome back, {userName || user.name.split(" ")[0]}
              </h1>
              <p className="text-muted-foreground">
                Your Impact Golf dashboard - track scores, winnings, and charitable
                impact.
              </p>
            </motion.div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-card border border-border rounded-2xl p-5"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Target className="w-5 h-5 text-primary" />
                  </div>
                  <span className="text-sm text-muted-foreground">
                    Current Numbers
                  </span>
                </div>
                <div className="flex gap-1.5">
                  {userScores.map((score, i) => (
                    <div
                      key={i}
                      className="w-9 h-9 rounded-lg bg-primary/20 text-primary font-bold text-sm flex items-center justify-center"
                    >
                      {score.value}
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="bg-card border border-border rounded-2xl p-5"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                    <Wallet className="w-5 h-5 text-accent" />
                  </div>
                  <span className="text-sm text-muted-foreground">Wallet</span>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Total Won</span>
                    <span className="text-sm font-semibold text-yellow-500">
                      ${totalWon.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Payment Status</span>
                    <span className="text-sm font-semibold text-accent">
                      {paymentStatus}
                    </span>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-card border border-border rounded-2xl p-5"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-rose-500/10 flex items-center justify-center">
                    <Heart className="w-5 h-5 text-rose-500" />
                  </div>
                  <span className="text-sm text-muted-foreground">
                    Charity Impact
                  </span>
                </div>
                <div className="text-2xl font-bold text-foreground">
                  {selectedCharity?.name ?? "No Charity Selected"}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Contribution: {contributionPercentage}% of subscription
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="bg-card border border-border rounded-2xl p-5"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-primary" />
                  </div>
                  <span className="text-sm text-muted-foreground">Next Draw</span>
                </div>
                <div className="text-lg font-bold text-foreground">
                  {nextDraw
                    ? new Date(nextDraw.date).toLocaleDateString("en-US", {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                      })
                    : "TBD"}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Pool: ${new Intl.NumberFormat('en-US').format(nextDraw?.prizePool || 0)}
                </p>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.28 }}
              className="bg-card border border-border rounded-2xl p-5 mb-8"
            >
              <h2 className="text-lg font-bold text-foreground mb-3">Participation Summary</h2>
              <div className="grid md:grid-cols-3 gap-4 text-sm">
                <div className="bg-background border border-border rounded-xl p-4">
                  <p className="text-muted-foreground">Draws Entered</p>
                  <p className="text-xl font-bold">{drawsEntered}</p>
                </div>
                <div className="bg-background border border-border rounded-xl p-4">
                  <p className="text-muted-foreground">Upcoming Draw</p>
                  <p className="text-xl font-bold">
                    {new Date(nextDraw.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                </div>
                <div className="bg-background border border-border rounded-xl p-4">
                  <p className="text-muted-foreground">Subscription</p>
                  <p className="text-xl font-bold capitalize">{user.subscriptionStatus}</p>
                  <ManageSubscriptionButton />
                </div>
              </div>
            </motion.div>

            {/* Main Content Grid */}
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Left Column - Scores & Actions */}
              <div className="lg:col-span-2 space-y-6">
                {/* Rolling Scores */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-card border border-border rounded-2xl p-6"
                >
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                      <Target className="w-5 h-5 text-primary" />
                      Rolling Scores
                    </h2>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock className="w-3.5 h-3.5" />
                      Last 5 rounds count
                    </div>
                  </div>

                  <div className="space-y-4 mb-8">
                    {userScores.map((score) => (
                      <div
                        key={score.id}
                        className="flex items-center justify-between p-4 bg-background border border-border rounded-xl group hover:border-primary/30 transition-colors"
                      >
                        {editingScoreId === score.id ? (
                          <div className="flex-1 flex flex-wrap items-center gap-4">
                            <div className="space-y-1">
                              <label className="text-[10px] uppercase font-bold text-muted-foreground">
                                Score
                              </label>
                              <input
                                type="number"
                                value={editScoreValue}
                                onChange={(e) => setEditScoreValue(e.target.value)}
                                className="w-16 h-10 bg-muted border border-border rounded-lg px-2 text-center font-bold"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[10px] uppercase font-bold text-muted-foreground">
                                Date
                              </label>
                              <input
                                type="date"
                                value={editScoreDate}
                                onChange={(e) => setEditScoreDate(e.target.value)}
                                className="h-10 bg-muted border border-border rounded-lg px-3 text-sm"
                              />
                            </div>
                            <div className="flex items-end h-10 pb-1 gap-2">
                              <Button
                                size="sm"
                                onClick={saveEditScore}
                                className="bg-primary hover:bg-primary/90"
                              >
                                <Save className="w-4 h-4 mr-1" />
                                Save
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => setEditingScoreId(null)}
                              >
                                Cancel
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
                                {score.value}
                              </div>
                              <div>
                                <p className="font-semibold text-foreground">
                                  {score.course || "Golf Round"}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {new Date(score.date).toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric",
                                  })}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-8 w-8 text-muted-foreground hover:text-primary"
                                onClick={() => beginEditScore(score.id)}
                              >
                                <Pencil className="w-4 h-4" />
                              </Button>
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-8 w-8 text-muted-foreground hover:text-destructive"
                                onClick={() =>
                                  setUserScores(userScores.filter((s) => s.id !== score.id))
                                }
                              >
                                <XCircle className="w-4 h-4" />
                              </Button>
                            </div>
                          </>
                        )}
                      </div>
                    ))}

                    {userScores.length === 0 && (
                      <div className="text-center py-8 border-2 border-dashed border-border rounded-2xl">
                        <AlertCircle className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground">
                          No scores added yet. Start by adding your first round.
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="p-5 bg-muted/50 rounded-2xl border border-border">
                    <h3 className="text-sm font-bold text-foreground mb-4">
                      Add New Round
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] uppercase font-bold text-muted-foreground ml-1">
                          Stableford Score
                        </label>
                        <input
                          type="number"
                          placeholder="1-45"
                          value={newScoreValue}
                          onChange={(e) => setNewScoreValue(e.target.value)}
                          className="w-full h-11 bg-background border border-border rounded-xl px-4 font-bold focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] uppercase font-bold text-muted-foreground ml-1">
                          Date Played
                        </label>
                        <input
                          type="date"
                          value={newScoreDate}
                          onChange={(e) => setNewScoreDate(e.target.value)}
                          className="w-full h-11 bg-background border border-border rounded-xl px-4 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                        />
                      </div>
                      <div className="flex items-end">
                        <Button
                          onClick={addScore}
                          className="w-full h-11 bg-primary hover:bg-primary/90 text-white rounded-xl shadow-lg shadow-primary/20"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Add Score
                        </Button>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Win History */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35 }}
                  className="bg-card border border-border rounded-2xl p-6"
                >
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                      <Trophy className="w-5 h-5 text-accent" />
                      Win History
                    </h2>
                    <Button variant="link" size="sm" className="text-primary p-0">
                      View All
                    </Button>
                  </div>

                  <div className="space-y-3">
                    {totalWon > 0 ? (
                      <>
                        <div className="flex items-center justify-between p-4 bg-background border border-border rounded-xl">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                              <Trophy className="w-5 h-5 text-accent" />
                            </div>
                            <div>
                              <p className="font-semibold text-foreground">
                                4-Number Match
                              </p>
                              <p className="text-xs text-muted-foreground">
                                April 2026 Draw
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-accent">+$75.00</p>
                            <p className="text-[10px] text-yellow-500 font-medium">
                              Pending verification
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between p-4 bg-background border border-border rounded-xl">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                              <CheckCircle2 className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                              <p className="font-semibold text-foreground">
                                3-Number Match
                              </p>
                              <p className="text-xs text-muted-foreground">
                                March 2026 Draw
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-foreground">+$175.00</p>
                            <p className="text-[10px] text-primary font-medium">
                              Paid to Wallet
                            </p>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="text-center py-6 text-muted-foreground">
                        No winnings yet. Keep playing!
                      </div>
                    )}
                  </div>
                </motion.div>
              </div>

              {/* Right Column - Secondary Info */}
              <div className="space-y-6">
                {/* Active Charity */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  className="bg-card border border-border rounded-2xl p-6"
                >
                  <h3 className="text-lg font-bold text-foreground mb-4">
                    Your Charity
                  </h3>
                  {selectedCharity ? (
                    <div className="space-y-4">
                      <div className="relative aspect-video rounded-xl overflow-hidden mb-3">
                        <Image
                          src={selectedCharity.imageUrl}
                          alt={selectedCharity.name}
                          fill
                          className="object-cover"
                        />
                        <div className="absolute top-2 right-2">
                          <span className="bg-primary/90 text-white text-[10px] font-bold px-2 py-1 rounded-full backdrop-blur-sm">
                            Active
                          </span>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-bold text-foreground">
                          {selectedCharity.name}
                        </h4>
                        <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                          {selectedCharity.description}
                        </p>
                      </div>
                      <div className="pt-2">
                        <div className="flex justify-between text-xs mb-1.5">
                          <span className="text-muted-foreground">Impact Level</span>
                          <span className="text-primary font-bold">
                            {contributionPercentage}%
                          </span>
                        </div>
                        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary rounded-full"
                            style={{ width: `${contributionPercentage}%` }}
                          />
                        </div>
                      </div>
                      <Button asChild variant="outline" size="sm" className="w-full mt-2">
                        <Link href={`/charities/${selectedCharity.id}`}>
                          View Details
                        </Link>
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <p className="text-sm text-muted-foreground mb-4">
                        Select a charity to start making an impact.
                      </p>
                      <Button asChild size="sm">
                        <Link href="/charities">Browse Charities</Link>
                      </Button>
                    </div>
                  )}
                </motion.div>

                {/* Verification Actions */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.45 }}
                  className="bg-accent/5 border border-accent/20 rounded-2xl p-6"
                >
                  <h3 className="text-lg font-bold text-foreground mb-2 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-accent" />
                    Verify Wins
                  </h3>
                  <p className="text-xs text-muted-foreground mb-4">
                    Got a winning match? Upload your official score card to claim your
                    prize.
                  </p>
                  <UploadScoreCardDialog />
                </motion.div>

                {/* Promotional Card */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                  className="bg-gradient-to-br from-primary to-primary-dark rounded-2xl p-6 text-white overflow-hidden relative"
                >
                  <div className="relative z-10">
                    <h3 className="text-xl font-bold mb-2">Upgrade to Pro</h3>
                    <p className="text-white/80 text-xs mb-4">
                      Get 3x more draw entries and support your charity at 20% impact
                      level.
                    </p>
                    <Button
                      asChild
                      className="bg-white text-primary hover:bg-white/90 font-bold"
                    >
                      <Link href="/subscription">Upgrade Now</Link>
                    </Button>
                  </div>
                  <Trophy className="absolute -bottom-4 -right-4 w-24 h-24 text-white/10 rotate-12" />
                </motion.div>
              </div>
            </div>
          </SubscriptionGuard>
        </div>
      </main>
    </div>
  );
}
