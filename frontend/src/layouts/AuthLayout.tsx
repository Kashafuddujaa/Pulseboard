import { Outlet } from 'react-router-dom'
import { Activity } from 'lucide-react'
import { ThemeToggle } from '@/components/layout/ThemeToggle'

export function AuthLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-bg">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-2">
          <div className="flex size-7 items-center justify-center rounded-md bg-accent text-accent-foreground">
            <Activity className="size-4" />
          </div>
          <span className="font-semibold text-text-primary">PulseBoard</span>
        </div>
        <ThemeToggle />
      </div>
      <div className="flex flex-1 items-center justify-center p-4">
        <div className="w-full max-w-sm">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
