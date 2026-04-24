'use client'

import { useAdmin } from '@/lib/admin-context'
import { useRouter, usePathname } from 'next/navigation'
import { useEffect, ReactNode } from 'react'
import { Loader2 } from 'lucide-react'

export function AdminGuard({ children }: { children: ReactNode }) {
  const { isAdmin, isLoading } = useAdmin()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!isLoading && !isAdmin && pathname !== '/admin/login') {
      router.push('/admin/login')
    }
  }, [isAdmin, isLoading, router, pathname])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
      </div>
    )
  }

  if (!isAdmin && pathname !== '/admin/login') {
    return null // Will redirect in useEffect
  }

  return <>{children}</>
}
