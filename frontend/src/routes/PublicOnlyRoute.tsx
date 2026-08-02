import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'

export function PublicOnlyRoute() {
  const { isAuthenticated, isInitializing } = useAuth()

  if (isInitializing) return null

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }

  return <Outlet />
}
