import { NavLink } from 'react-router-dom'
import { LayoutDashboard, FileText, Users, Activity, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuth } from '@/hooks/useAuth'

const NAV_ITEMS = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/reports', label: 'Reports', icon: FileText },
  { to: '/team', label: 'Team', icon: Users },
]

export function Sidebar({
  mobileOpen,
  onCloseMobile,
}: {
  mobileOpen: boolean
  onCloseMobile: () => void
}) {
  const { user } = useAuth()

  const content = (
    <>
      <div className="flex items-center justify-between px-4 py-4">
        <div className="flex items-center gap-2">
          <div className="flex size-7 items-center justify-center rounded-md bg-accent text-accent-foreground">
            <Activity className="size-4" />
          </div>
          <span className="font-semibold text-text-primary">PulseBoard</span>
        </div>
        <button
          type="button"
          onClick={onCloseMobile}
          aria-label="Close menu"
          className="rounded-md p-1 text-text-secondary hover:bg-surface-hover md:hidden"
        >
          <X className="size-5" />
        </button>
      </div>

      <nav className="flex flex-1 flex-col gap-1 px-3">
        {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            onClick={onCloseMobile}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-text-secondary hover:bg-surface-hover hover:text-text-primary',
                isActive && 'bg-accent-soft text-accent hover:bg-accent-soft hover:text-accent',
              )
            }
          >
            <Icon className="size-4" aria-hidden="true" />
            {label}
          </NavLink>
        ))}
      </nav>

      {user && (
        <div className="border-t border-border px-4 py-3">
          <p className="truncate text-sm font-medium text-text-primary">
            {user.workspaceName}
          </p>
          <p className="truncate text-xs text-text-secondary">{user.email}</p>
        </div>
      )}
    </>
  )

  return (
    <>
      <aside className="hidden w-60 flex-col border-r border-border bg-surface md:flex">
        {content}
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={onCloseMobile}
            aria-hidden="true"
          />
          <aside className="relative flex h-full w-64 flex-col bg-surface">
            {content}
          </aside>
        </div>
      )}
    </>
  )
}
