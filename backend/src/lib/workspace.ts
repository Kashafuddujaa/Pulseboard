import { prisma } from './prisma.js'

/// Resolves the calling profile's workspace membership (and role), used to
/// scope every team-API query to "my workspace" and to permission-check
/// mutations. Unlike /api/me, this does NOT bootstrap a workspace if one is
/// missing — by the time a client calls the team API it should already have
/// called /api/me once (on login) to bootstrap.
export function getCallerMembership(profileId: string) {
  return prisma.workspaceMember.findFirst({
    where: { profileId },
    include: { workspace: true },
  })
}
