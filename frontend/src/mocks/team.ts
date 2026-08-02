import type { TeamMember } from '@/types/team'

export const initialTeamMembers: TeamMember[] = [
  {
    id: 't-1',
    name: 'You',
    email: 'hajra.ashrafqadri@gmail.com',
    role: 'owner',
    status: 'active',
    joinedAt: '2025-11-03T00:00:00Z',
  },
  {
    id: 't-2',
    name: 'Jordan Lee',
    email: 'jordan.lee@pulseboard.io',
    role: 'admin',
    status: 'active',
    joinedAt: '2025-12-14T00:00:00Z',
  },
  {
    id: 't-3',
    name: 'Priya Nandan',
    email: 'priya.nandan@pulseboard.io',
    role: 'editor',
    status: 'active',
    joinedAt: '2026-01-22T00:00:00Z',
  },
  {
    id: 't-4',
    name: 'Marcus Webb',
    email: 'marcus.webb@pulseboard.io',
    role: 'editor',
    status: 'active',
    joinedAt: '2026-02-18T00:00:00Z',
  },
  {
    id: 't-5',
    name: 'Sofia Alvarez',
    email: 'sofia.alvarez@pulseboard.io',
    role: 'viewer',
    status: 'active',
    joinedAt: '2026-03-09T00:00:00Z',
  },
  {
    id: 't-6',
    name: 'Daniel Osei',
    email: 'daniel.osei@pulseboard.io',
    role: 'viewer',
    status: 'pending',
    joinedAt: '2026-07-25T00:00:00Z',
  },
]
