import type { Role } from '@/types/team'

export interface AuthUser {
  id: string
  name: string
  email: string
  workspaceId: string
  workspaceName: string
  role: Role
}
