import { NextResponse } from 'next/server'
import { getStripe, isStripeConfigured } from '@/lib/stripe'
import { cookies } from 'next/headers'

export async function GET() {
  try {
    // Check for a debug flag to simulate "none" status
    const cookieStore = await cookies()
    const simulateNoSubscription = cookieStore.get('debug_no_subscription')?.value === 'true'
    const customerId = cookieStore.get('stripe_customer_id')?.value
    const isAdmin = cookieStore.get('admin_session')?.value === 'active'
    const adminName = cookieStore.get('admin_name')?.value || 'Admin'

    if (simulateNoSubscription) {
      return NextResponse.json({
        status: 'none',
        userName: null,
        planId: null,
        tier: null,
        billingCycle: null,
        currentPeriodEnd: null,
        cancelAtPeriodEnd: false,
        charityPercentage: 0,
        drawEntries: 0,
      })
    }

    // Handle mock customer IDs for demo purposes
    if (customerId === 'cus_demo_123' || !isStripeConfigured) {
      if (customerId === 'cus_demo_123') {
        return NextResponse.json({
          status: 'active',
          userName: isAdmin ? adminName : 'User',
          planId: 'pro',
          tier: 'pro',
          billingCycle: 'monthly',
          currentPeriodEnd: Math.floor(Date.now() / 1000) + (30 * 24 * 60 * 60),
          cancelAtPeriodEnd: false,
          charityPercentage: 50,
          drawEntries: 10,
        })
      }
      
      return NextResponse.json({
        status: 'none',
        userName: null,
        planId: null,
        tier: null,
        billingCycle: null,
        currentPeriodEnd: null,
        cancelAtPeriodEnd: false,
        charityPercentage: 0,
        drawEntries: 0,
      })
    }

    const stripe = getStripe()

    if (!customerId) {
      return NextResponse.json({
        status: 'none',
        userName: null,
        planId: null,
        tier: null,
        billingCycle: null,
        currentPeriodEnd: null,
        cancelAtPeriodEnd: false,
        charityPercentage: 0,
        drawEntries: 0,
      })
    }

    // Fetch the customer's active subscriptions
    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      status: 'all',
      limit: 1,
      expand: ['data.default_payment_method'],
    })

    if (subscriptions.data.length === 0) {
      return NextResponse.json({
        status: 'none',
        userName: null,
        planId: null,
        tier: null,
        billingCycle: null,
        currentPeriodEnd: null,
        cancelAtPeriodEnd: false,
        charityPercentage: 0,
        drawEntries: 0,
      })
    }

    const subscription = subscriptions.data[0]
    const metadata = subscription.metadata

    return NextResponse.json({
      status: subscription.status,
      userName: isAdmin ? adminName : 'Alex',
      planId: metadata.plan_id || null,
      tier: metadata.tier || null,
      billingCycle: metadata.billing_cycle || null,
      // @ts-ignore
      currentPeriodEnd: subscription.current_period_end,
      // @ts-ignore
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
      charityPercentage: parseInt(metadata.charity_percentage || '0', 10),
      drawEntries: parseInt(metadata.draw_entries || '0', 10),
    })
  } catch (error) {
    console.error('Error fetching subscription status:', error)
    return NextResponse.json(
      { error: 'Failed to fetch subscription status' },
      { status: 500 }
    )
  }
}
