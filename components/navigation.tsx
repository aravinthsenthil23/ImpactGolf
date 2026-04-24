'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Target, 
  LayoutDashboard, 
  Trophy, 
  Heart, 
  CreditCard,
  Menu,
  X,
  Shield
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/theme-toggle'
import { resetSubscription } from '@/app/actions/stripe'
import { useRouter } from 'next/navigation'
import { useAdmin } from '@/lib/admin-context'

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/scores', label: 'Scores', icon: Target },
  { href: '/draw', label: 'Draw', icon: Trophy },
  { href: '/charities', label: 'Charities', icon: Heart },
  { href: '/subscription', label: 'Subscribe', icon: CreditCard },
]

const adminItems = [
  { href: '/admin', label: 'Admin', icon: Shield },
]

export function Navigation() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const router = useRouter()
  const { isAdmin, adminName } = useAdmin()

  const handleReset = async () => {
    await resetSubscription()
    router.refresh()
    window.location.href = '/'
  }

  const currentAdminItems = adminItems.map(item => ({
    ...item,
    label: isAdmin && adminName ? adminName : item.label
  }))

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl">
      <nav className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-primary glow-purple">
            <Target className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold tracking-tight">
            <span className="text-gradient">Impact</span>
            <span className="text-foreground"> Golf</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link key={item.href} href={item.href}>
                <Button
                  variant="ghost"
                  className={cn(
                    'relative gap-2 px-4 text-muted-foreground hover:text-foreground hover:bg-secondary/50',
                    isActive && 'text-foreground'
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                  {isActive && (
                    <motion.div
                      layoutId="activeNav"
                      className="absolute inset-0 rounded-md bg-secondary/60"
                      style={{ zIndex: -1 }}
                      transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                </Button>
              </Link>
            )
          })}
          <div className="mx-2 h-6 w-px bg-border" />
          {currentAdminItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link key={item.href} href={item.href}>
                <Button
                  variant="ghost"
                  className={cn(
                    'relative gap-2 px-4 text-muted-foreground hover:text-foreground hover:bg-secondary/50',
                    isActive && 'text-foreground'
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                  {isActive && (
                    <motion.div
                      layoutId="activeNavAdmin"
                      className="absolute inset-0 rounded-md bg-secondary/60"
                      style={{ zIndex: -1 }}
                      transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                </Button>
              </Link>
            )
          })}
          <div className="mx-1" />
          <ThemeToggle />
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleReset}
            className="text-[10px] text-muted-foreground uppercase tracking-widest hover:text-destructive"
          >
            Reset Demo
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </nav>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-border/40 bg-background/95 backdrop-blur-xl"
          >
            <div className="container mx-auto px-4 py-4 flex flex-col gap-2">
              <div className="flex justify-end pb-2">
                <ThemeToggle />
              </div>
              {[...navItems, ...currentAdminItems].map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link key={item.href} href={item.href} onClick={() => setMobileMenuOpen(false)}>
                    <Button
                      variant="ghost"
                      className={cn(
                        'w-full justify-start gap-3 text-muted-foreground hover:text-foreground',
                        isActive && 'text-foreground bg-secondary/60'
                      )}
                    >
                      <item.icon className="h-4 w-4" />
                      {item.label}
                    </Button>
                  </Link>
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
