'use server'

import { getStripe, isStripeConfigured } from '@/lib/stripe'
import { getPlanById } from '@/lib/products'
import { cookies } from 'next/headers'
import { setActiveSubscription } from '@/lib/auth'

export async function createSubscriptionCheckout(
  planId: string,
  billingCycle: 'monthly' | 'yearly',
  charityPercentage: number
) {
  const plan = getPlanById(planId)
  
  if (!plan) {
    return { error: 'Invalid plan selected' }
  }

  const price = billingCycle === 'yearly' ? plan.priceYearly : plan.priceMonthly
  const interval = billingCycle === 'yearly' ? 'year' : 'month'

  // If Stripe is not configured, return a mock session
  if (!isStripeConfigured) {
    return {
      clientSecret: 'mock_secret_' + Date.now(),
      sessionId: 'mock_session_' + Date.now(),
      isMock: true
    }
  }

  try {
    const stripe = getStripe()
    // Create or retrieve a price for the subscription
    const stripePrice = await stripe.prices.create({
      unit_amount: price,
      currency: 'usd',
      recurring: {
        interval: interval,
      },
      product_data: {
        name: `Impact Golf ${plan.name} - ${billingCycle === 'yearly' ? 'Annual' : 'Monthly'}`,
        metadata: {
          plan_id: plan.id,
          tier: plan.tier,
          charity_percentage: charityPercentage.toString(),
          draw_entries: plan.drawEntries.toString(),
        },
      },
    })

    const session = await stripe.checkout.sessions.create({
      // @ts-ignore
      ui_mode: 'embedded',
      payment_method_types: ['card'],
      line_items: [
        {
          price: stripePrice.id,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      return_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/subscription/success?session_id={CHECKOUT_SESSION_ID}`,
      metadata: {
        plan_id: plan.id,
        billing_cycle: billingCycle,
        charity_percentage: charityPercentage.toString(),
      },
      subscription_data: {
        metadata: {
          plan_id: plan.id,
          tier: plan.tier,
          billing_cycle: billingCycle,
          charity_percentage: charityPercentage.toString(),
          draw_entries: plan.drawEntries.toString(),
        },
      },
    })

    return { 
      clientSecret: session.client_secret,
      sessionId: session.id
    }
  } catch (error) {
    console.error('Error creating checkout session:', error)
    return { error: 'Failed to create checkout session' }
  }
}

export async function getSubscriptionStatus(sessionId: string) {
  // Handle mock sessions
  if (sessionId.startsWith('mock_session_') || !isStripeConfigured) {
    return {
      status: 'active',
      planId: 'pro',
      billingCycle: 'monthly',
      charityPercentage: '50',
      currentPeriodEnd: Math.floor(Date.now() / 1000) + (30 * 24 * 60 * 60),
      cancelAtPeriodEnd: false,
    }
  }

  try {
    const stripe = getStripe()
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['subscription', 'customer'],
    })

    if (session.subscription && typeof session.subscription !== 'string') {
      const status = session.subscription.status
      
      if (status === 'active' || status === 'trialing') {
        const cookieStore = await cookies()
        cookieStore.set('stripe_customer_id', session.customer as string, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          path: '/',
          maxAge: 60 * 60 * 24 * 30, // 30 days
        })
        await setActiveSubscription()
      }

      return {
        status: session.subscription.status,
        planId: session.metadata?.plan_id,
        billingCycle: session.metadata?.billing_cycle,
        charityPercentage: session.metadata?.charity_percentage,
        // @ts-ignore
        currentPeriodEnd: session.subscription.current_period_end,
        // @ts-ignore
        cancelAtPeriodEnd: session.subscription.cancel_at_period_end,
      }
    }

    return { status: 'incomplete' }
  } catch (error) {
    console.error('Error retrieving subscription status:', error)
    return { error: 'Failed to retrieve subscription status' }
  }
}

export async function resetSubscription() {
  const cookieStore = await cookies()
  cookieStore.delete('stripe_customer_id')
  cookieStore.delete('debug_no_subscription')
  cookieStore.delete('admin_session')
  cookieStore.delete('admin_name')
}

export async function setAdminSession(username: string) {
  const cookieStore = await cookies()
  cookieStore.set('admin_session', 'active', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
  })
  cookieStore.set('admin_name', username, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
  })
}

export async function clearAdminSession() {
  const cookieStore = await cookies()
  cookieStore.delete('admin_session')
  cookieStore.delete('admin_name')
}

export async function cancelSubscription(subscriptionId: string) {
  // Handle mock subscriptions
  if (subscriptionId.startsWith('mock_sub_') || !isStripeConfigured) {
    return {
      status: 'active',
      cancelAtPeriodEnd: true,
      currentPeriodEnd: Math.floor(Date.now() / 1000) + (30 * 24 * 60 * 60),
    }
  }

  try {
    const stripe = getStripe()
    const subscription = await stripe.subscriptions.update(subscriptionId, {
      cancel_at_period_end: true,
    })

    return {
      status: subscription.status,
      // @ts-ignore
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
      // @ts-ignore
      currentPeriodEnd: subscription.current_period_end,
    }
  } catch (error) {
    console.error('Error canceling subscription:', error)
    return { error: 'Failed to cancel subscription' }
  }
}

export async function reactivateSubscription(subscriptionId: string) {
  // Handle mock subscriptions
  if (subscriptionId.startsWith('mock_sub_') || !isStripeConfigured) {
    return {
      status: 'active',
      cancelAtPeriodEnd: false,
    }
  }

  try {
    const stripe = getStripe()
    const subscription = await stripe.subscriptions.update(subscriptionId, {
      cancel_at_period_end: false,
    })

    return {
      status: subscription.status,
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
    }
  } catch (error) {
    console.error('Error reactivating subscription:', error)
    return { error: 'Failed to reactivate subscription' }
  }
}

export async function createCustomerPortalSession(customerId: string) {
  // Handle mock customers
  if (customerId === 'cus_demo_123' || !isStripeConfigured) {
    return { url: '/subscription' } // Redirect to plans page for demo
  }

  try {
    const stripe = getStripe()
    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/dashboard`,
    })

    return { url: session.url }
  } catch (error) {
    console.error('Error creating customer portal session:', error)
    return { error: 'Failed to create customer portal session' }
  }
}
