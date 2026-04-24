'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { setAdminSession, clearAdminSession } from '@/app/actions/stripe'

interface AdminContextType {
  isAdmin: boolean
  adminName: string | null
  isLoading: boolean
  login: (username: string, password: string) => Promise<boolean>
  logout: () => Promise<void>
}

const AdminContext = createContext<AdminContextType | undefined>(undefined)

export function AdminProvider({ children }: { children: ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(false)
  const [adminName, setAdminName] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const adminSession = localStorage.getItem('admin_session')
    const storedName = localStorage.getItem('admin_name')
    if (adminSession === 'active') {
      setIsAdmin(true)
      setAdminName(storedName || 'Admin')
    }
    setIsLoading(false)
  }, [])

  const login = async (username: string, password: string) => {
    if (username === 'Admin' && password === '123456') {
      setIsAdmin(true)
      setAdminName(username)
      localStorage.setItem('admin_session', 'active')
      localStorage.setItem('admin_name', username)
      await setAdminSession(username) // Call server action to set cookies
      return true
    }
    return false
  }

  const logout = async () => {
    setIsAdmin(false)
    setAdminName(null)
    localStorage.removeItem('admin_session')
    localStorage.removeItem('admin_name')
    await clearAdminSession() // Call server action to clear cookies
  }

  return (
    <AdminContext.Provider value={{ isAdmin, adminName, isLoading, login, logout }}>
      {children}
    </AdminContext.Provider>
  )
}

export function useAdmin() {
  const context = useContext(AdminContext)
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider')
  }
  return context
}
