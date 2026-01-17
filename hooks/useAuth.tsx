// hooks/useAuth.tsx
'use client'

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react'

interface User {
  id: string
  email: string
  name: string
  phone?: string
  avatar?: string
  role: 'customer' | 'admin' | 'staff'
  referralCode?: string
  preferences?: {
    notifications: { email: boolean; push: boolean; sms: boolean }
    marketing: boolean
  }
}

interface AuthContextType {
  user: User | null
  loading: boolean
  error: string | null
  isAuthenticated: boolean
  isAdmin: boolean
  isStaff: boolean
  login: (email: string, password: string) => Promise<boolean>
  register: (data: { email: string; password: string; name: string; phone?: string; referralCode?: string }) => Promise<boolean>
  logout: () => Promise<void>
  updateProfile: (data: Partial<User>) => Promise<boolean>
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchUser = useCallback(async () => {
    try {
      const res = await fetch('/api/auth/me', { credentials: 'include' })
      if (res.ok) {
        const data = await res.json()
        setUser(data.data.user)
      } else {
        setUser(null)
      }
    } catch {
      setUser(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchUser()
  }, [fetchUser])

  const login = async (email: string, password: string): Promise<boolean> => {
    setError(null)
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'include',
      })
      const data = await res.json()
      if (data.success) {
        setUser(data.data.user)
        return true
      }
      setError(data.error || 'Login failed')
      return false
    } catch (e: any) {
      setError(e.message)
      return false
    }
  }

  const register = async (regData: { email: string; password: string; name: string; phone?: string; referralCode?: string }): Promise<boolean> => {
    setError(null)
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(regData),
        credentials: 'include',
      })
      const data = await res.json()
      if (data.success) {
        setUser(data.data.user)
        return true
      }
      setError(data.error || 'Registration failed')
      return false
    } catch (e: any) {
      setError(e.message)
      return false
    }
  }

  const logout = async () => {
    await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' })
    setUser(null)
  }

  const updateProfile = async (data: Partial<User>): Promise<boolean> => {
    try {
      const res = await fetch('/api/auth/me', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        credentials: 'include',
      })
      const result = await res.json()
      if (result.success) {
        setUser(result.data.user)
        return true
      }
      return false
    } catch {
      return false
    }
  }

  const refreshUser = async () => {
    await fetchUser()
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
        isStaff: user?.role === 'admin' || user?.role === 'staff',
        login,
        register,
        logout,
        updateProfile,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export default useAuth
