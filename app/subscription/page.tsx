'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, Sparkles, Heart, Trophy, Target, Shield, CreditCard } from 'lucide-react'
import { Navigation } from '@/components/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import { SUBSCRIPTION_PLANS, formatPrice, getYearlySavingsPercentage } from '@/lib/products'
import { SubscriptionCheckout } from '@/components/subscription-checkout'

export default function SubscriptionPage() {
  const [isYearly, setIsYearly] = useState(false)
  const [charityImpact, setCharityImpact] = useState([50])
  const [selectedPlan, setSelectedPlan] = useState('pro')
  const [showCheckout, setShowCheckout] = useState(false)

  const selectedPlanData = SUBSCRIPTION_PLANS.find(p => p.id === selectedPlan)
  const currentPrice = selectedPlanData 
    ? (isYearly ? selectedPlanData.priceYearly : selectedPlanData.priceMonthly) 
    : 0
  const charityAmount = (currentPrice * (charityImpact[0] / 100)) / 100

  const handleSubscribe = () => {
    setShowCheckout(true)
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-12">
        <AnimatePresence mode="wait">
          {showCheckout && selectedPlanData ? (
            <motion.div
              key="checkout"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <SubscriptionCheckout
                planId={selectedPlanData.id}
                planName={selectedPlanData.name}
                billingCycle={isYearly ? 'yearly' : 'monthly'}
                charityPercentage={charityImpact[0]}
                price={currentPrice}
                onBack={() => setShowCheckout(false)}
              />
            </motion.div>
          ) : (
            <motion.div
              key="plans"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {/* Header */}
              <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
                  <span className="text-gradient">Play with Purpose</span>
                </h1>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Every subscription fuels your game and drives charitable impact. 
                  Choose how much of your fee goes directly to causes you care about.
                </p>
              </div>

              {/* Billing Toggle */}
              <div className="flex items-center justify-center gap-4 mb-10">
                <Label htmlFor="billing" className={cn(
                  'text-sm font-medium transition-colors',
                  !isYearly ? 'text-foreground' : 'text-muted-foreground'
                )}>
                  Monthly
                </Label>
                <Switch 
                  id="billing" 
                  checked={isYearly} 
                  onCheckedChange={setIsYearly}
                  className="data-[state=checked]:bg-primary"
                />
                <Label htmlFor="billing" className={cn(
                  'text-sm font-medium transition-colors flex items-center gap-2',
                  isYearly ? 'text-foreground' : 'text-muted-foreground'
                )}>
                  Yearly
                  <span className="text-xs bg-accent/20 text-accent px-2 py-0.5 rounded-full">
                    Save up to 20%
                  </span>
                </Label>
              </div>

              {/* Pricing Cards */}
              <div className="grid md:grid-cols-3 gap-6 mb-16">
                {SUBSCRIPTION_PLANS.map((plan, index) => (
                  <motion.div
                    key={plan.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + index * 0.1 }}
                  >
                    <Card 
                      className={cn(
                        'relative h-full cursor-pointer transition-all duration-300 border-2',
                        selectedPlan === plan.id 
                          ? 'border-primary glow-purple bg-card' 
                          : 'border-border hover:border-primary/50 bg-card/50',
                        plan.highlighted && 'md:-mt-4 md:mb-4'
                      )}
                      onClick={() => setSelectedPlan(plan.id)}
                    >
                      {plan.highlighted && (
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                          <span className="bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1">
                            <Sparkles className="h-3 w-3" />
                            Most Popular
                          </span>
                        </div>
                      )}
                      
                      <CardHeader className="pb-4">
                        <CardTitle className="text-2xl">{plan.name}</CardTitle>
                        <CardDescription className="text-muted-foreground">
                          {plan.description}
                        </CardDescription>
                      </CardHeader>
                      
                      <CardContent className="pb-6">
                        <div className="mb-6">
                          <span className="text-4xl font-bold">
                            {formatPrice(isYearly ? plan.priceYearly : plan.priceMonthly)}
                          </span>
                          <span className="text-muted-foreground">
                            /{isYearly ? 'year' : 'month'}
                          </span>
                          {isYearly && (
                            <div className="text-sm text-accent mt-1">
                              Save {getYearlySavingsPercentage(plan)}% vs monthly
                            </div>
                          )}
                        </div>

                        <div className="flex items-center gap-4 mb-4 p-3 rounded-lg bg-secondary/50">
                          <div className="text-center">
                            <p className="text-lg font-bold text-primary">{plan.drawEntries}</p>
                            <p className="text-xs text-muted-foreground">Draw Entries</p>
                          </div>
                          <div className="h-8 w-px bg-border" />
                          <div className="text-center">
                            <p className="text-lg font-bold text-accent">{plan.charityPercentage}%</p>
                            <p className="text-xs text-muted-foreground">Base Charity</p>
                          </div>
                        </div>
                        
                        <ul className="space-y-3">
                          {plan.features.map((feature) => (
                            <li key={feature} className="flex items-start gap-2">
                              <Check className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                              <span className="text-sm text-foreground/80">{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                      
                      <CardFooter>
                        <Button 
                          className={cn(
                            'w-full',
                            selectedPlan === plan.id 
                              ? 'bg-primary text-primary-foreground hover:bg-primary/90' 
                              : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                          )}
                        >
                          {selectedPlan === plan.id ? 'Selected' : 'Select Plan'}
                        </Button>
                      </CardFooter>
                    </Card>
                  </motion.div>
                ))}
              </div>

              {/* Charity Impact Slider */}
              <Card className="max-w-2xl mx-auto border-2 border-accent/30 bg-card/80 backdrop-blur">
                <CardHeader className="text-center pb-2">
                  <div className="mx-auto w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center mb-4">
                    <Heart className="h-6 w-6 text-accent" />
                  </div>
                  <CardTitle className="text-2xl">Charity Impact Slider</CardTitle>
                  <CardDescription>
                    Decide how much of your subscription directly supports your chosen cause
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="pt-4">
                  <div className="space-y-8">
                    <div className="space-y-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Min (25%)</span>
                        <span className="font-semibold text-accent">{charityImpact[0]}% to Charity</span>
                        <span className="text-muted-foreground">Max (75%)</span>
                      </div>
                      <Slider
                        value={charityImpact}
                        onValueChange={setCharityImpact}
                        min={25}
                        max={75}
                        step={5}
                        className="[&_[role=slider]]:bg-accent [&_[role=slider]]:border-accent [&_.relative]:bg-muted [&_[data-orientation=horizontal]>[data-orientation=horizontal]]:bg-accent"
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div className="p-4 rounded-xl bg-secondary/50">
                        <Target className="h-5 w-5 mx-auto mb-2 text-primary" />
                        <p className="text-2xl font-bold text-primary">${charityAmount.toFixed(2)}</p>
                        <p className="text-xs text-muted-foreground">To Charity</p>
                      </div>
                      <div className="p-4 rounded-xl bg-secondary/50">
                        <Trophy className="h-5 w-5 mx-auto mb-2 text-accent" />
                        <p className="text-2xl font-bold text-accent">
                          ${((currentPrice / 100) - charityAmount).toFixed(2)}
                        </p>
                        <p className="text-xs text-muted-foreground">Prize Pool</p>
                      </div>
                      <div className="p-4 rounded-xl bg-secondary/50">
                        <Sparkles className="h-5 w-5 mx-auto mb-2 text-foreground" />
                        <p className="text-2xl font-bold">{formatPrice(currentPrice)}</p>
                        <p className="text-xs text-muted-foreground">Total/{isYearly ? 'yr' : 'mo'}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
                
                <CardFooter className="flex-col gap-4 pt-2">
                  <Button 
                    onClick={handleSubscribe}
                    className="w-full bg-accent text-accent-foreground hover:bg-accent/90 text-lg h-12 gap-2"
                  >
                    <CreditCard className="h-5 w-5" />
                    Subscribe Now
                  </Button>
                  <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Shield className="h-3 w-3" />
                      Secure payment via Stripe
                    </span>
                    <span>Cancel anytime</span>
                  </div>
                </CardFooter>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  )
}
