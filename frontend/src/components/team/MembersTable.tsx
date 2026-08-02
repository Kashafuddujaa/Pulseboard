import { Trash2 } from 'lucide-react'
import { Table, Thead, Tbody, Tr, Th, Td } from '@/components/ui/Table'
import { Avatar } from '@/components/ui/Avatar'
import { Badge } from '@/components/ui/Badge'
import { RoleBadge } from '@/components/team/RoleBadge'
import { RoleSelect } from '@/components/team/RoleSelect'
import { formatDate } from '@/lib/utils'
import type { Role, TeamMember } from '@/types/team'

export function MembersTable({
  members,
  onRoleChange,
  onRemove,
}: {
  members: TeamMember[]
  onRoleChange: (member: TeamMember, role: Role) => void
  onRemove: (member: TeamMember) => void
}) {
  return (
    <Table>
      <Thead>
        <Tr>
          <Th>Member</Th>
          <Th>Role</Th>
          <Th>Status</Th>
          <Th>Joined</Th>
          <Th className="text-right">Actions</Th>
        </Tr>
      </Thead>
      <Tbody>
        {members.map((member) => (
          <Tr key={member.id}>
            <Td>
              <div className="flex items-center gap-3">
                <Avatar name={member.name} />
                <div className="min-w-0">
                  <p className="truncate font-medium text-text-primary">{member.name}</p>
                  <p className="truncate text-xs text-text-secondary">{member.email}</p>
                </div>
              </div>
            </Td>
            <Td>
              {member.role === 'owner' ? (
                <RoleBadge role={member.role} />
              ) : (
                <RoleSelect
                  value={member.role}
                  onChange={(role) => onRoleChange(member, role)}
                />
              )}
            </Td>
            <Td>
              <Badge tone={member.status === 'active' ? 'success' : 'warning'}>
                {member.status === 'active' ? 'Active' : 'Pending'}
              </Badge>
            </Td>
            <Td className="text-text-secondary">{formatDate(member.joinedAt)}</Td>
            <Td className="text-right">
              {member.role !== 'owner' && (
                <button
                  type="button"
                  onClick={() => onRemove(member)}
                  aria-label={`Remove ${member.name}`}
                  className="rounded-md p-1.5 text-text-secondary hover:bg-danger-soft hover:text-danger"
                >
                  <Trash2 className="size-4" />
                </button>
              )}
            </Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  )
}
