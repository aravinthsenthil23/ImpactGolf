'use client'

import { useCallback, useState, useEffect } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout,
} from '@stripe/react-stripe-js'
import { createSubscriptionCheckout } from '@/app/actions/stripe'
import { Button } from '@/components/ui/button'
import { ArrowLeft, CheckCircle2, Loader2, CreditCard, ShieldCheck } from 'lucide-react'
import { useRouter } from 'next/navigation'

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || 'pk_test_placeholder'
)

interface SubscriptionCheckoutProps {
  planId: string
  planName: string
  billingCycle: 'monthly' | 'yearly'
  charityPercentage: number
  price: number
  onBack: () => void
}

export function SubscriptionCheckout({
  planId,
  planName,
  billingCycle,
  charityPercentage,
  price,
  onBack,
}: SubscriptionCheckoutProps) {
  const [error, setError] = useState<string | null>(null)
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [isSimulating, setIsSimulating] = useState(false)
  const [isMock, setIsMock] = useState(false)
  const router = useRouter()

  const fetchClientSecret = useCallback(async () => {
    const result = await createSubscriptionCheckout(
      planId,
      billingCycle,
      charityPercentage
    )

    if (result.error) {
      setError(result.error)
      throw new Error(result.error)
    }

    setSessionId(result.sessionId!)
    setIsMock(!!result.isMock)
    return result.clientSecret!
  }, [planId, billingCycle, charityPercentage])

  const simulateSuccess = async () => {
    if (!sessionId) return
    setIsSimulating(true)

    try {
      await fetch('/api/webhooks/stripe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'stripe-signature': 'simulated_signature'
        },
        body: JSON.stringify({
          type: 'checkout.session.completed',
          data: {
            object: {
              id: sessionId,
              customer: 'cus_demo_123',
              metadata: {
                plan_id: planId,
                billing_cycle: billingCycle,
                charity_percentage: charityPercentage.toString(),
              }
            }
          }
        })
      })

      // Redirect to success page
      router.push(`/subscription/success?session_id=${sessionId}`)
    } catch (e) {
      console.error('Simulation failed:', e)
      setIsSimulating(false)
    }
  }

  const formatPrice = (cents: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(cents / 100)
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto p-8 text-center">
        <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-destructive mb-2">
            Checkout Error
          </h3>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={onBack} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8 flex items-center justify-between">
        <Button
          onClick={onBack}
          variant="ghost"
          className="text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Plans
        </Button>
        
        {sessionId && (
          <Button 
            onClick={simulateSuccess} 
            disabled={isSimulating}
            variant="outline" 
            className="border-primary/50 text-primary hover:bg-primary/5 hover:text-primary"
          >
            {isSimulating ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <CheckCircle2 className="w-4 h-4 mr-2" />
            )}
            Simulate Payment Success (Demo Only)
          </Button>
        )}
      </div>

      <div className="bg-card border border-border rounded-2xl overflow-hidden mb-8">
        <div className="p-8 bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5 border-b border-border">
          <h2 className="text-3xl font-bold text-foreground mb-2">
            Complete Your Subscription
          </h2>
          <div className="flex items-center gap-4 text-muted-foreground">
            <span className="font-semibold text-foreground">{planName} Plan</span>
            <span className="w-1.5 h-1.5 rounded-full bg-border" />
            <span className="bg-primary/10 text-primary px-3 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider">
              {billingCycle} Billing
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-border" />
            <span className="font-bold text-foreground">
              {formatPrice(price)}/{billingCycle === 'monthly' ? 'month' : 'year'}
            </span>
          </div>
          <p className="text-sm text-muted-foreground mt-4 italic">
            {charityPercentage}% of your subscription supports your chosen charity
          </p>
        </div>

        <div className="p-0 min-h-[600px] bg-white relative">
          {isMock ? (
            <div className="p-12 text-center h-full flex flex-col items-center justify-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                <CreditCard className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-4">
                Mock Checkout Mode
              </h3>
              <p className="text-muted-foreground max-w-md mx-auto mb-8">
                Stripe is not configured with a valid API key. You can still test the full 
                end-to-end flow by clicking the button below to simulate a successful payment.
              </p>
              
              <div className="bg-muted/30 border border-border rounded-xl p-6 w-full max-w-sm mb-8 text-left">
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Order Total</span>
                  <span className="text-sm font-bold">{formatPrice(price)}</span>
                </div>
                <div className="flex justify-between mb-4">
                  <span className="text-sm text-muted-foreground">Billing</span>
                  <span className="text-sm font-medium capitalize">{billingCycle}</span>
                </div>
                <div className="pt-4 border-t border-border flex items-center gap-2 text-xs text-muted-foreground">
                  <ShieldCheck className="w-4 h-4 text-green-500" />
                  Secure simulated transaction
                </div>
              </div>

              <Button 
                onClick={simulateSuccess} 
                disabled={isSimulating}
                size="lg"
                className="w-full max-w-sm bg-primary hover:bg-primary/90 text-white py-6"
              >
                {isSimulating ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-5 h-5 mr-2" />
                    Complete Mock Payment
                  </>
                )}
              </Button>
            </div>
          ) : (
            <div id="checkout">
              <EmbeddedCheckoutProvider
                stripe={stripePromise}
                options={{ fetchClientSecret }}
              >
                <EmbeddedCheckout />
              </EmbeddedCheckoutProvider>
            </div>
          )}
          
          {isSimulating && (
            <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50">
              <div className="text-center">
                <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
                <p className="text-xl font-bold text-foreground">Processing Payment...</p>
                <p className="text-muted-foreground">Please do not refresh the page</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
