'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { createCustomerPortalSession } from '@/app/actions/stripe'
import { Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import Cookies from 'js-cookie'

export function ManageSubscriptionButton() {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleClick = async () => {
    setLoading(true)
    const customerId = Cookies.get('stripe_customer_id')
    
    if (!customerId) {
      // Handle case where customer ID is not found
      console.error('Stripe customer ID not found in cookies.')
      setLoading(false)
      return
    }

    const { url, error } = await createCustomerPortalSession(customerId)

    if (error) {
      console.error(error)
      setLoading(false)
      return
    }

    if (url) {
      router.push(url)
    } else {
      setLoading(false)
    }
  }

  return (
    <Button onClick={handleClick} disabled={loading} size="sm" variant="outline" className="mt-2">
      {loading ? (
        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
      ) : null}
      Manage Subscription
    </Button>
  )
}
