import 'server-only'

import Stripe from 'stripe'

let stripeClient: Stripe | null = null

export const isStripeConfigured = !!process.env.STRIPE_SECRET_KEY && process.env.STRIPE_SECRET_KEY !== 'sk_test_placeholder'

export function getStripe(): Stripe {
  const secretKey = process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder'

  if (!stripeClient) {
    stripeClient = new Stripe(secretKey)
  }

  return stripeClient
}
