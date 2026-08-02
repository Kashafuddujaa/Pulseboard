import { useState } from 'react'
import { UserPlus } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Modal } from '@/components/ui/Modal'
import { MembersTable } from '@/components/team/MembersTable'
import { InviteMemberModal } from '@/components/team/InviteMemberModal'
import { initialTeamMembers } from '@/mocks/team'
import type { Role, TeamMember } from '@/types/team'

let memberCounter = 0

export function TeamPage() {
  const [members, setMembers] = useState<TeamMember[]>(initialTeamMembers)
  const [isInviteOpen, setIsInviteOpen] = useState(false)
  const [memberToRemove, setMemberToRemove] = useState<TeamMember | null>(null)

  const handleInvite = (email: string, role: Role) => {
    memberCounter += 1
    setMembers((prev) => [
      ...prev,
      {
        id: `t-new-${memberCounter}`,
        name: email.split('@')[0],
        email,
        role,
        status: 'pending',
        joinedAt: new Date().toISOString(),
      },
    ])
  }

  const handleRoleChange = (member: TeamMember, role: Role) => {
    setMembers((prev) => prev.map((m) => (m.id === member.id ? { ...m, role } : m)))
  }

  const handleConfirmRemove = () => {
    if (!memberToRemove) return
    setMembers((prev) => prev.filter((m) => m.id !== memberToRemove.id))
    setMemberToRemove(null)
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-text-primary">Team</h2>
          <p className="text-sm text-text-secondary">
            Manage who has access to your workspace
          </p>
        </div>
        <Button onClick={() => setIsInviteOpen(true)}>
          <UserPlus className="size-4" />
          Invite member
        </Button>
      </div>

      <Card>
        <MembersTable
          members={members}
          onRoleChange={handleRoleChange}
          onRemove={setMemberToRemove}
        />
      </Card>

      <InviteMemberModal
        open={isInviteOpen}
        onClose={() => setIsInviteOpen(false)}
        onInvite={handleInvite}
      />

      <Modal
        open={memberToRemove !== null}
        onClose={() => setMemberToRemove(null)}
        title="Remove member"
      >
        <p className="text-sm text-text-secondary">
          Are you sure you want to remove <strong className="text-text-primary">{memberToRemove?.name}</strong> from
          this workspace? They will lose access immediately.
        </p>
        <div className="mt-4 flex justify-end gap-2">
          <Button variant="secondary" onClick={() => setMemberToRemove(null)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleConfirmRemove}>
            Remove
          </Button>
        </div>
      </Modal>
    </div>
  )
}
