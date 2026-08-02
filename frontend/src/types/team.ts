export type Role = 'owner' | 'admin' | 'editor' | 'viewer'
export type MemberStatus = 'active' | 'pending'

export interface TeamMember {
  id: string
  name: string
  email: string
  role: Role
  status: MemberStatus
  joinedAt: string
}
