import { createContext } from 'react'
import type { MockUser } from '@/types/auth'

export interface AuthContextValue {
  user: MockUser | null
  isAuthenticated: boolean
  isInitializing: boolean
  login: (email: string, password: string) => Promise<void>
  signup: (name: string, email: string, password: string) => Promise<void>
  logout: () => void
}

export const AuthContext = createContext<AuthContextValue | null>(null)
