import { useState, type FormEvent } from 'react'
import { Modal } from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Button } from '@/components/ui/Button'
import type { Role } from '@/types/team'

export function InviteMemberModal({
  open,
  onClose,
  onInvite,
}: {
  open: boolean
  onClose: () => void
  onInvite: (email: string, role: Role) => Promise<void>
}) {
  const [email, setEmail] = useState('')
  const [role, setRole] = useState<Role>('editor')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Enter a valid email address')
      return
    }

    setIsSubmitting(true)
    try {
      await onInvite(email, role)
      setEmail('')
      setRole('editor')
      setError('')
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send invite')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="Invite member">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          label="Email address"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={error}
          placeholder="teammate@company.com"
        />
        <Select label="Role" value={role} onChange={(e) => setRole(e.target.value as Role)}>
          <option value="admin">Admin</option>
          <option value="editor">Editor</option>
          <option value="viewer">Viewer</option>
        </Select>
        <div className="mt-2 flex justify-end gap-2">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isSubmitting}>
            Send invite
          </Button>
        </div>
      </form>
    </Modal>
  )
}
