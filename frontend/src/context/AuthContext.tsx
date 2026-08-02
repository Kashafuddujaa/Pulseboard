import { useEffect, useMemo, useState, type ReactNode } from 'react'
import type { MockUser } from '@/types/auth'
import { AuthContext, type AuthContextValue } from '@/context/auth-context'

const STORAGE_KEY = 'pulseboard_auth'

interface StoredAuth {
  user: MockUser
  token: string
}

function readStoredAuth(): StoredAuth | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as StoredAuth) : null
  } catch {
    return null
  }
}

function mockDelay(ms = 500) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<MockUser | null>(null)
  const [isInitializing, setIsInitializing] = useState(true)

  useEffect(() => {
    const stored = readStoredAuth()
    if (stored) setUser(stored.user)
    setIsInitializing(false)
  }, [])

  const persist = (nextUser: MockUser) => {
    const record: StoredAuth = { user: nextUser, token: `mock-token-${nextUser.id}` }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(record))
    setUser(nextUser)
  }

  const login = async (email: string, _password: string) => {
    await mockDelay()
    const name = email.split('@')[0]?.replace(/[._]/g, ' ') || 'User'
    persist({
      id: `user-${email}`,
      name: name.replace(/\b\w/g, (c) => c.toUpperCase()),
      email,
      workspaceName: 'My Workspace',
    })
  }

  const signup = async (name: string, email: string, _password: string) => {
    await mockDelay()
    persist({
      id: `user-${email}`,
      name,
      email,
      workspaceName: `${name.split(' ')[0]}'s Workspace`,
    })
  }

  const logout = () => {
    localStorage.removeItem(STORAGE_KEY)
    setUser(null)
  }

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: user !== null,
      isInitializing,
      login,
      signup,
      logout,
    }),
    [user, isInitializing],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
