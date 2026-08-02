import { Menu } from 'lucide-react'
import { ThemeToggle } from '@/components/layout/ThemeToggle'
import { UserMenu } from '@/components/layout/UserMenu'

export function Topbar({
  title,
  onOpenMobileMenu,
}: {
  title: string
  onOpenMobileMenu: () => void
}) {
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-border bg-bg/80 px-4 backdrop-blur md:px-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onOpenMobileMenu}
          aria-label="Open menu"
          className="rounded-md p-1.5 text-text-secondary hover:bg-surface-hover md:hidden"
        >
          <Menu className="size-5" />
        </button>
        <h1 className="text-sm font-semibold text-text-primary">{title}</h1>
      </div>
      <div className="flex items-center gap-1">
        <ThemeToggle />
        <UserMenu />
      </div>
    </header>
  )
}
