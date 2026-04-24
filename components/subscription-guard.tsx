'use client'

import { ReactNode } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Lock, Crown, ArrowRight, Loader2 } from 'lucide-react'
import { useFeatureAccess } from '@/lib/subscription-context'
import { Button } from '@/components/ui/button'

interface SubscriptionGuardProps {
  children: ReactNode
  requiredTier?: 'starter' | 'pro' | 'elite'
  fallback?: ReactNode
  showUpgradePrompt?: boolean
}

export function SubscriptionGuard({
  children,
  requiredTier,
  fallback,
  showUpgradePrompt = true,
}: SubscriptionGuardProps) {
  const { hasAccess, isLoading, isRestricted, status } = useFeatureAccess(requiredTier)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    )
  }

  if (isRestricted) {
    if (fallback) return <>{fallback}</>

    if (showUpgradePrompt) {
      return (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center p-12 text-center"
        >
          <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mb-6">
            <Lock className="w-8 h-8 text-primary" />
          </div>
          
          <h3 className="text-2xl font-bold text-foreground mb-2">
            {status === 'none' ? 'Subscription Required' : 'Upgrade Required'}
          </h3>
          
          <p className="text-muted-foreground mb-6 max-w-md">
            {status === 'none' 
              ? 'Subscribe to Impact Golf to access this feature and start making an impact.'
              : `This feature requires a ${requiredTier || 'higher'} tier subscription.`
            }
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button asChild className="bg-primary hover:bg-primary/90">
              <Link href="/subscription">
                <Crown className="w-4 h-4 mr-2" />
                {status === 'none' ? 'Subscribe Now' : 'Upgrade Plan'}
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/">
                Learn More
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
        </motion.div>
      )
    }

    return null
  }

  return <>{children}</>
}

// Inline restriction badge for partially restricted content
interface RestrictionBadgeProps {
  requiredTier: 'starter' | 'pro' | 'elite'
  className?: string
}

export function RestrictionBadge({ requiredTier, className }: RestrictionBadgeProps) {
  const tierLabels = {
    starter: 'Starter+',
    pro: 'Pro+',
    elite: 'Elite',
  }

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-primary/20 text-primary rounded-full ${className}`}>
      <Crown className="w-3 h-3" />
      {tierLabels[requiredTier]}
    </span>
  )
}

// Hook-based access check for conditional rendering
export function useRequireSubscription(requiredTier?: 'starter' | 'pro' | 'elite') {
  const { hasAccess, isLoading, status } = useFeatureAccess(requiredTier)
  
  return {
    canAccess: hasAccess,
    isLoading,
    shouldShowUpgrade: !isLoading && !hasAccess,
    subscriptionStatus: status,
  }
}
