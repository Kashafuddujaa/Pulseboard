import { useEffect, useState } from 'react'
import { UserPlus } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Modal } from '@/components/ui/Modal'
import { MembersTable } from '@/components/team/MembersTable'
import { InviteMemberModal } from '@/components/team/InviteMemberModal'
import { apiFetch } from '@/lib/api'
import type { Role, TeamMember } from '@/types/team'

export function TeamPage() {
  const [members, setMembers] = useState<TeamMember[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [isInviteOpen, setIsInviteOpen] = useState(false)
  const [memberToRemove, setMemberToRemove] = useState<TeamMember | null>(null)

  useEffect(() => {
    apiFetch<TeamMember[]>('/team/members')
      .then(setMembers)
      .catch((err) =>
        setLoadError(err instanceof Error ? err.message : 'Failed to load team'),
      )
      .finally(() => setIsLoading(false))
  }, [])

  const handleInvite = async (email: string, role: Role) => {
    const member = await apiFetch<TeamMember>('/team/members', {
      method: 'POST',
      body: JSON.stringify({ email, role }),
    })
    setMembers((prev) => [...prev, member])
  }

  const handleRoleChange = async (member: TeamMember, role: Role) => {
    const updated = await apiFetch<TeamMember>(`/team/members/${member.id}`, {
      method: 'PATCH',
      body: JSON.stringify({ role }),
    })
    setMembers((prev) => prev.map((m) => (m.id === member.id ? updated : m)))
  }

  const handleConfirmRemove = async () => {
    if (!memberToRemove) return
    await apiFetch(`/team/members/${memberToRemove.id}`, { method: 'DELETE' })
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
        {isLoading ? (
          <p className="p-6 text-sm text-text-secondary">Loading team...</p>
        ) : loadError ? (
          <p className="p-6 text-sm text-danger">{loadError}</p>
        ) : (
          <MembersTable
            members={members}
            onRoleChange={handleRoleChange}
            onRemove={setMemberToRemove}
          />
        )}
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
