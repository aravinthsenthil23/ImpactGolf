import { NextRequest, NextResponse } from 'next/server'
import { getStripe } from '@/lib/stripe'
import Stripe from 'stripe'
import { cookies } from 'next/headers'
import { setActiveSubscription, clearActiveSubscription } from '@/lib/auth'

// Webhook secret should be set in environment variables
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(request: NextRequest) {
  const stripe = getStripe()
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')

  if (!signature) {
    return NextResponse.json(
      { error: 'Missing stripe-signature header' },
      { status: 400 }
    )
  }

  let event: Stripe.Event

  // For demo/development purposes, allow simulated signatures
  if (signature === 'simulated_signature' && process.env.NODE_ENV !== 'production') {
    event = JSON.parse(body)
  } else {
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (err) {
      console.error('Webhook signature verification failed:', err)
      return NextResponse.json(
        { error: 'Webhook signature verification failed' },
        { status: 400 }
      )
    }
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session
      
      if (session.customer) {
        // For demo purposes, we'll store the customer ID in a cookie
        // In a real app, you would save this to your database
        const cookieStore = await cookies()
        cookieStore.set('stripe_customer_id', session.customer as string, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          path: '/',
          maxAge: 60 * 60 * 24 * 30, // 30 days
        })
      }
      
      // If the checkout session includes a subscription, set the active subscription cookie
      if (session.mode === 'subscription') {
        await setActiveSubscription()
      }

      console.log('Checkout completed:', session.id)
      break
    }

    case 'customer.subscription.created': {
      const subscription = event.data.object as Stripe.Subscription
      console.log('Subscription created:', subscription.id)
      await setActiveSubscription()
      break
    }

    case 'customer.subscription.updated': {
      const subscription = event.data.object as Stripe.Subscription
      console.log('Subscription updated:', subscription.id)
      if (subscription.status === 'active') {
        await setActiveSubscription()
      } else {
        await clearActiveSubscription()
      }
      break
    }

    case 'customer.subscription.deleted': {
      const subscription = event.data.object as Stripe.Subscription
      console.log('Subscription canceled:', subscription.id)
      await clearActiveSubscription()
      break
    }

    case 'invoice.payment_succeeded': {
      const invoice = event.data.object as Stripe.Invoice
      console.log('Payment succeeded:', invoice.id)
      // If the payment is for a subscription, ensure the subscription is marked active
      // @ts-ignore
      if (invoice.subscription) {
        await setActiveSubscription()
      }
      break
    }

    case 'invoice.payment_failed': {
      const invoice = event.data.object as Stripe.Invoice
      console.log('Payment failed:', invoice.id)
      // If the payment fails, the subscription might be canceled or past due.
      // The customer.subscription.updated event will handle the status change.
      break
    }

    case 'customer.subscription.trial_will_end': {
      const subscription = event.data.object as Stripe.Subscription
      console.log('Trial ending soon:', subscription.id)
      // Send reminder email about trial ending
      break
    }

    default:
      console.log(`Unhandled event type: ${event.type}`)
  }

  return NextResponse.json({ received: true })
}
