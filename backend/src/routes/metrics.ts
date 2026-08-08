import { Router } from 'express'
import { requireAuth } from '../middleware/auth.js'
import { requireMembership } from '../middleware/requireManager.js'
import {
  generateComparisonSeries,
  generateTrend,
  seedFromWorkspaceId,
} from '../lib/metricsGenerator.js'

export const metricsRouter = Router()

const VALID_RANGES = new Set(['7', '30', '90'])

const CHANNEL_BREAKDOWN = [
  { channel: 'Organic Search', value: 38 },
  { channel: 'Direct', value: 22 },
  { channel: 'Paid Ads', value: 18 },
  { channel: 'Social', value: 12 },
  { channel: 'Referral', value: 7 },
  { channel: 'Email', value: 3 },
]

const DEVICE_BREAKDOWN = [
  { device: 'Desktop', value: 54 },
  { device: 'Mobile', value: 38 },
  { device: 'Tablet', value: 8 },
]

const AI_INSIGHTS = [
  'Revenue growth is accelerating — up 8.2% this period, driven mainly by Organic Search traffic.',
  'Mobile sessions are converting 1.3x better than last month; consider shifting more ad spend to mobile.',
  'Session count dipped slightly — check for tracking gaps on the pricing page, which saw a drop in views.',
]

metricsRouter.get(
  '/metrics',
  requireAuth,
  requireMembership(),
  (req, res) => {
    const range = String(req.query.range ?? '30')
    if (!VALID_RANGES.has(range)) {
      res.status(400).json({ error: 'range must be 7, 30, or 90' })
      return
    }

    const days = Number(range) as 7 | 30 | 90
    const workspaceSeed = seedFromWorkspaceId(req.membership!.workspaceId)

    const stats = [
      {
        id: 'revenue',
        label: 'Revenue',
        value: days === 7 ? 18240 : days === 30 ? 74500 : 219800,
        unit: 'currency' as const,
        changePercent: 8.2,
        trend: generateTrend({
          days,
          base: days === 7 ? 2600 : days === 30 ? 2480 : 2440,
          volatility: 400,
          growth: 0.35,
          seed: workspaceSeed + 1,
        }),
      },
      {
        id: 'active-users',
        label: 'Active Users',
        value: days === 7 ? 4120 : days === 30 ? 15680 : 41200,
        unit: 'number' as const,
        changePercent: 4.6,
        trend: generateTrend({
          days,
          base: days === 7 ? 590 : days === 30 ? 520 : 460,
          volatility: 90,
          growth: 0.2,
          seed: workspaceSeed + 2,
        }),
      },
      {
        id: 'sessions',
        label: 'Sessions',
        value: days === 7 ? 9840 : days === 30 ? 38200 : 108400,
        unit: 'number' as const,
        changePercent: -2.1,
        trend: generateTrend({
          days,
          base: days === 7 ? 1400 : days === 30 ? 1270 : 1200,
          volatility: 220,
          growth: -0.05,
          seed: workspaceSeed + 3,
        }),
      },
      {
        id: 'conversion-rate',
        label: 'Conversion Rate',
        value: 3.8,
        unit: 'percent' as const,
        changePercent: 1.4,
        trend: generateTrend({
          days,
          base: 3.6,
          volatility: 0.6,
          growth: 0.1,
          seed: workspaceSeed + 4,
        }),
      },
    ]

    const revenueTrend = generateTrend({
      days,
      base: days === 7 ? 2600 : days === 30 ? 2480 : 2440,
      volatility: 500,
      growth: 0.35,
      seed: workspaceSeed + 1,
    })

    const trafficTrend = generateComparisonSeries({
      days,
      base: days === 7 ? 1400 : days === 30 ? 1270 : 1200,
      volatility: 220,
      growth: 0.15,
      seed: workspaceSeed + 5,
    })

    res.json({
      stats,
      revenueTrend,
      trafficTrend,
      channelBreakdown: CHANNEL_BREAKDOWN,
      deviceBreakdown: DEVICE_BREAKDOWN,
      aiInsights: AI_INSIGHTS,
    })
  },
)
