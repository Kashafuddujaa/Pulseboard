import { Router } from 'express'
import { prisma } from '../lib/prisma.js'
import { requireAuth } from '../middleware/auth.js'
import { getCallerMembership } from '../lib/workspace.js'

export const meRouter = Router()

function nameFromEmail(email: string) {
  const local = email.split('@')[0] ?? 'User'
  return local
    .replace(/[._]/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase())
}

meRouter.get('/me', requireAuth, async (req, res, next) => {
  try {
    const user = req.user!

    const profile = await prisma.profile.upsert({
      where: { id: user.id },
      update: {},
      create: {
        id: user.id,
        email: user.email,
        name: nameFromEmail(user.email),
      },
    })

    let membership = await getCallerMembership(profile.id)

    if (!membership) {
      const workspace = await prisma.workspace.create({
        data: {
          name: `${profile.name}'s Workspace`,
          ownerId: profile.id,
          members: {
            create: {
              profileId: profile.id,
              role: 'owner',
              status: 'active',
            },
          },
        },
      })

      membership = await prisma.workspaceMember.findFirstOrThrow({
        where: { workspaceId: workspace.id, profileId: profile.id },
        include: { workspace: true },
      })
    }

    res.json({
      profile,
      workspace: membership.workspace,
      role: membership.role,
    })
  } catch (err) {
    next(err)
  }
})
