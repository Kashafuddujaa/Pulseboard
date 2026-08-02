import { Badge } from '@/components/ui/Badge'
import type { Role } from '@/types/team'

const ROLE_LABELS: Record<Role, string> = {
  owner: 'Owner',
  admin: 'Admin',
  editor: 'Editor',
  viewer: 'Viewer',
}

const ROLE_TONE: Record<Role, 'accent' | 'neutral'> = {
  owner: 'accent',
  admin: 'accent',
  editor: 'neutral',
  viewer: 'neutral',
}

export function RoleBadge({ role }: { role: Role }) {
  return <Badge tone={ROLE_TONE[role]}>{ROLE_LABELS[role]}</Badge>
}
