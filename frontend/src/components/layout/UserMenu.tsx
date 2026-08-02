import { LogOut } from 'lucide-react'
import { Dropdown, DropdownItem } from '@/components/ui/Dropdown'
import { Avatar } from '@/components/ui/Avatar'
import { useAuth } from '@/hooks/useAuth'

export function UserMenu() {
  const { user, logout } = useAuth()

  if (!user) return null

  return (
    <Dropdown
      trigger={
        <span className="flex items-center gap-2 rounded-lg p-1 hover:bg-surface-hover">
          <Avatar name={user.name} />
        </span>
      }
    >
      <div className="px-2.5 py-1.5">
        <p className="truncate text-sm font-medium text-text-primary">{user.name}</p>
        <p className="truncate text-xs text-text-secondary">{user.email}</p>
      </div>
      <div className="my-1 h-px bg-border" />
      <DropdownItem onClick={logout}>
        <LogOut className="size-4" aria-hidden="true" />
        Log out
      </DropdownItem>
    </Dropdown>
  )
}
