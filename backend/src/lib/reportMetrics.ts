import type { ReportType } from '@prisma/client'
import { prisma } from './prisma.js'

function mulberry32(seed: number) {
  let a = seed
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function seedFromString(str: string) {
  let h = 0
  for (let i = 0; i < str.length; i++) {
    h = (Math.imul(31, h) + str.charCodeAt(i)) | 0
  }
  return h
}

interface MetricLine {
  label: string
  value: string
}

/// team_activity pulls real counts from the workspace's actual data.
/// sales/traffic/custom are synthetic-but-deterministic (seeded by
/// workspace + type + range) — there's no real analytics pipeline
/// (Stripe/GA/etc.) connected to generate genuine business numbers.
export async function computeReportMetrics(
  type: ReportType,
  range: '7' | '30' | '90',
  workspaceId: string,
): Promise<MetricLine[]> {
  if (type === 'team_activity') {
    const [activeMembers, pendingInvites, totalReports] = await Promise.all([
      prisma.workspaceMember.count({ where: { workspaceId, status: 'active' } }),
      prisma.workspaceMember.count({ where: { workspaceId, status: 'pending' } }),
      prisma.report.count({ where: { workspaceId } }),
    ])
    return [
      { label: 'Active members', value: String(activeMembers) },
      { label: 'Pending invites', value: String(pendingInvites) },
      { label: 'Reports generated', value: String(totalReports) },
    ]
  }

  const random = mulberry32(seedFromString(`${workspaceId}:${type}:${range}`))
  const days = Number(range)

  if (type === 'sales') {
    const revenue = Math.round((5000 + random() * 3000) * days)
    const customers = Math.round(days * (2 + random() * 4))
    const avgDeal = Math.round(revenue / Math.max(customers, 1))
    return [
      { label: 'Total revenue', value: `$${revenue.toLocaleString('en-US')}` },
      { label: 'New customers', value: customers.toLocaleString('en-US') },
      { label: 'Avg. deal size', value: `$${avgDeal.toLocaleString('en-US')}` },
    ]
  }

  if (type === 'traffic') {
    const sessions = Math.round(days * (300 + random() * 200))
    const bounceRate = Math.round(30 + random() * 25)
    const avgSessionSeconds = Math.round(90 + random() * 150)
    return [
      { label: 'Sessions', value: sessions.toLocaleString('en-US') },
      { label: 'Bounce rate', value: `${bounceRate}%` },
      {
        label: 'Avg. session',
        value: `${Math.floor(avgSessionSeconds / 60)}m ${avgSessionSeconds % 60}s`,
      },
    ]
  }

  const records = Math.round(days * (20 + random() * 40))
  return [
    { label: 'Total records', value: records.toLocaleString('en-US') },
    { label: 'Date range', value: `Last ${range} days` },
  ]
}
