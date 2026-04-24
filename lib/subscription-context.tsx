'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export type SubscriptionStatus = 
  | 'active' 
  | 'trialing' 
  | 'past_due' 
  | 'canceled' 
  | 'unpaid' 
  | 'incomplete' 
  | 'incomplete_expired'
  | 'paused'
  | 'none'

export interface SubscriptionState {
  status: SubscriptionStatus
  userName: string | null
  planId: string | null
  tier: 'starter' | 'pro' | 'elite' | null
  billingCycle: 'monthly' | 'yearly' | null
  currentPeriodEnd: Date | null
  cancelAtPeriodEnd: boolean
  charityPercentage: number
  drawEntries: number
  isLoading: boolean
}

interface SubscriptionContextType extends SubscriptionState {
  isSubscribed: boolean
  isActive: boolean
  hasAccess: (requiredTier?: 'starter' | 'pro' | 'elite') => boolean
  refreshSubscription: () => Promise<void>
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined)

const TIER_HIERARCHY: Record<string, number> = {
  starter: 1,
  pro: 2,
  elite: 3,
}

export function SubscriptionProvider({ children }: { children: ReactNode }) {
  const [subscription, setSubscription] = useState<SubscriptionState>({
    status: 'none',
    userName: null,
    planId: null,
    tier: null,
    billingCycle: null,
    currentPeriodEnd: null,
    cancelAtPeriodEnd: false,
    charityPercentage: 0,
    drawEntries: 0,
    isLoading: true,
  })

  const refreshSubscription = async () => {
    try {
      const response = await fetch('/api/subscription/status')
      if (response.ok) {
        const data = await response.json()
        setSubscription({
          status: data.status || 'none',
          userName: data.userName || null,
          planId: data.planId || null,
          tier: data.tier || null,
          billingCycle: data.billingCycle || null,
          currentPeriodEnd: data.currentPeriodEnd ? new Date(data.currentPeriodEnd * 1000) : null,
          cancelAtPeriodEnd: data.cancelAtPeriodEnd || false,
          charityPercentage: data.charityPercentage || 0,
          drawEntries: data.drawEntries || 0,
          isLoading: false,
        })
      } else {
        setSubscription(prev => ({ ...prev, isLoading: false }))
      }
    } catch (error) {
      console.error('Failed to fetch subscription status:', error)
      setSubscription(prev => ({ ...prev, isLoading: false }))
    }
  }

  useEffect(() => {
    refreshSubscription()
    
    // Poll subscription status every 5 minutes for real-time updates
    const interval = setInterval(refreshSubscription, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  const isSubscribed = subscription.status !== 'none' && subscription.planId !== null
  const isActive = ['active', 'trialing'].includes(subscription.status)

  const hasAccess = (requiredTier?: 'starter' | 'pro' | 'elite'): boolean => {
    if (!isActive) return false
    if (!requiredTier || !subscription.tier) return isActive
    
    const userTierLevel = TIER_HIERARCHY[subscription.tier] || 0
    const requiredTierLevel = TIER_HIERARCHY[requiredTier] || 0
    
    return userTierLevel >= requiredTierLevel
  }

  return (
    <SubscriptionContext.Provider
      value={{
        ...subscription,
        isSubscribed,
        isActive,
        hasAccess,
        refreshSubscription,
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  )
}

export function useSubscription() {
  const context = useContext(SubscriptionContext)
  if (context === undefined) {
    throw new Error('useSubscription must be used within a SubscriptionProvider')
  }
  return context
}

// Hook for checking feature access
export function useFeatureAccess(requiredTier?: 'starter' | 'pro' | 'elite') {
  const { hasAccess, isLoading, status } = useSubscription()
  
  return {
    hasAccess: hasAccess(requiredTier),
    isLoading,
    isRestricted: !isLoading && !hasAccess(requiredTier),
    status,
  }
}
