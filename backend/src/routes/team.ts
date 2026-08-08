import { Router } from 'express'
import type { Role } from '@prisma/client'
import { prisma } from '../lib/prisma.js'
import { requireAuth } from '../middleware/auth.js'
import { requireMembership } from '../middleware/requireManager.js'
import { env } from '../config/env.js'

export const teamRouter = Router()

const INVITABLE_ROLES = new Set<Role>(['admin', 'editor', 'viewer'])

function serializeMember(member: {
  id: string
  role: Role
  status: string
  joinedAt: Date
  profile: { name: string; email: string }
}) {
  return {
    id: member.id,
    name: member.profile.name,
    email: member.profile.email,
    role: member.role,
    status: member.status,
    joinedAt: member.joinedAt,
  }
}

teamRouter.get(
  '/team/members',
  requireAuth,
  requireMembership(),
  async (req, res, next) => {
    try {
      const members = await prisma.workspaceMember.findMany({
        where: { workspaceId: req.membership!.workspaceId },
        include: { profile: true },
        orderBy: { joinedAt: 'asc' },
      })
      res.json(members.map(serializeMember))
    } catch (err) {
      next(err)
    }
  },
)

teamRouter.post(
  '/team/members',
  requireAuth,
  requireMembership({ managersOnly: true }),
  async (req, res, next) => {
    try {
      const { email, role } = req.body as { email?: string; role?: Role }
      if (!email || !role || !INVITABLE_ROLES.has(role)) {
        res.status(400).json({ error: 'email and a valid role are required' })
        return
      }

      const inviteRes = await fetch(`${env.supabaseUrl}/auth/v1/invite`, {
        method: 'POST',
        headers: {
          apikey: env.supabaseServiceRoleKey,
          Authorization: `Bearer ${env.supabaseServiceRoleKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      if (!inviteRes.ok) {
        const body = (await inviteRes.json().catch(() => ({}))) as {
          msg?: string
        }
        res
          .status(inviteRes.status === 422 ? 409 : 502)
          .json({ error: body.msg ?? 'Failed to send invite' })
        return
      }

      const invited = (await inviteRes.json()) as { id: string; email: string }

      const profile = await prisma.profile.upsert({
        where: { id: invited.id },
        update: {},
        create: {
          id: invited.id,
          email: invited.email,
          name: invited.email.split('@')[0] ?? 'User',
        },
      })

      const member = await prisma.workspaceMember.create({
        data: {
          workspaceId: req.membership!.workspaceId,
          profileId: profile.id,
          role,
          status: 'pending',
        },
        include: { profile: true },
      })

      res.status(201).json(serializeMember(member))
    } catch (err) {
      if (
        typeof err === 'object' &&
        err !== null &&
        'code' in err &&
        err.code === 'P2002'
      ) {
        res.status(409).json({ error: 'This person is already a member' })
        return
      }
      next(err)
    }
  },
)

teamRouter.patch(
  '/team/members/:id',
  requireAuth,
  requireMembership({ managersOnly: true }),
  async (req, res, next) => {
    try {
      const { role } = req.body as { role?: Role }
      if (!role || !INVITABLE_ROLES.has(role)) {
        res.status(400).json({ error: 'A valid role is required' })
        return
      }

      const target = await prisma.workspaceMember.findFirst({
        where: {
          id: String(req.params.id),
          workspaceId: req.membership!.workspaceId,
        },
      })
      if (!target) {
        res.status(404).json({ error: 'Member not found' })
        return
      }
      if (target.role === 'owner') {
        res.status(400).json({ error: "Can't change the owner's role" })
        return
      }

      const updated = await prisma.workspaceMember.update({
        where: { id: target.id },
        data: { role },
        include: { profile: true },
      })
      res.json(serializeMember(updated))
    } catch (err) {
      next(err)
    }
  },
)

teamRouter.delete(
  '/team/members/:id',
  requireAuth,
  requireMembership({ managersOnly: true }),
  async (req, res, next) => {
    try {
      const target = await prisma.workspaceMember.findFirst({
        where: {
          id: String(req.params.id),
          workspaceId: req.membership!.workspaceId,
        },
      })
      if (!target) {
        res.status(404).json({ error: 'Member not found' })
        return
      }
      if (target.role === 'owner') {
        res.status(400).json({ error: "Can't remove the workspace owner" })
        return
      }

      await prisma.workspaceMember.delete({ where: { id: target.id } })
      res.status(204).send()
    } catch (err) {
      next(err)
    }
  },
)
