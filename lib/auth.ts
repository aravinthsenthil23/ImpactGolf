import { cookies } from 'next/headers'

export async function hasActiveSubscription() {
  const cookieStore = await cookies()
  return cookieStore.has('subscription_status') && cookieStore.get('subscription_status')?.value === 'active'
}

export async function setActiveSubscription() {
  const cookieStore = await cookies()
  cookieStore.set('subscription_status', 'active', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 365, // 1 year
  })
}

export async function clearActiveSubscription() {
  const cookieStore = await cookies()
  cookieStore.delete('subscription_status')
}
