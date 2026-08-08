import type { NextFunction, Request, Response } from 'express'
import type { Prisma } from '@prisma/client'
import { getCallerMembership } from '../lib/workspace.js'

type MembershipWithWorkspace = Prisma.WorkspaceMemberGetPayload<{
  include: { workspace: true }
}>

declare global {
  namespace Express {
    interface Request {
      membership?: MembershipWithWorkspace
    }
  }
}

const MANAGER_ROLES = new Set(['owner', 'admin'])

/// Requires the caller to belong to a workspace (404 otherwise) and attaches
/// it to req.membership. Pass `managersOnly: true` to additionally 403 any
/// caller whose role isn't owner/admin — used by the mutating team routes.
export function requireMembership(
  { managersOnly }: { managersOnly?: boolean } = {},
) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const membership = await getCallerMembership(req.user!.id)
      if (!membership) {
        res.status(404).json({ error: 'No workspace found for this user' })
        return
      }
      if (managersOnly && !MANAGER_ROLES.has(membership.role)) {
        res.status(403).json({ error: 'Only owners and admins can do this' })
        return
      }
      req.membership = membership
      next()
    } catch (err) {
      next(err)
    }
  }
}
