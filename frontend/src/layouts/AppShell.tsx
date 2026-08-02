import { useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Sidebar } from '@/components/layout/Sidebar'
import { Topbar } from '@/components/layout/Topbar'

const PAGE_TITLES: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/reports': 'Reports',
  '/team': 'Team',
}

export function AppShell() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()
  const title = PAGE_TITLES[location.pathname] ?? 'PulseBoard'

  return (
    <div className="flex min-h-screen bg-bg">
      <Sidebar mobileOpen={mobileOpen} onCloseMobile={() => setMobileOpen(false)} />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar title={title} onOpenMobileMenu={() => setMobileOpen(true)} />
        <main className="flex-1 p-4 md:p-6">
          <div className="mx-auto max-w-7xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
