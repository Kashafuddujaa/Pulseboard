import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { supabase } from '@/lib/supabase'
import { apiFetch } from '@/lib/api'
import type { AuthUser } from '@/types/auth'
import { AuthContext, type AuthContextValue } from '@/context/auth-context'

interface MeResponse {
  profile: { id: string; email: string; name: string }
  workspace: { id: string; name: string }
  role: AuthUser['role']
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isInitializing, setIsInitializing] = useState(true)

  const bootstrapUser = async () => {
    const me = await apiFetch<MeResponse>('/me')
    setUser({
      id: me.profile.id,
      name: me.profile.name,
      email: me.profile.email,
      workspaceId: me.workspace.id,
      workspaceName: me.workspace.name,
      role: me.role,
    })
  }

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        setUser(null)
        setIsInitializing(false)
        return
      }
      bootstrapUser().finally(() => setIsInitializing(false))
    })

    return () => subscription.unsubscribe()
  }, [])

  const login = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw new Error(error.message)
    await bootstrapUser()
  }

  const signup = async (name: string, email: string, password: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name } },
    })
    if (error) throw new Error(error.message)
    await bootstrapUser()
  }

  const logout = async () => {
    await supabase.auth.signOut()
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
