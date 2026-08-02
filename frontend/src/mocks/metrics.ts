import type { ChannelDatum, DeviceDatum, StatMetric } from '@/types/metrics'
import { generateComparisonSeries, generateTrend } from '@/mocks/generators'

export function getStatMetrics(days: 7 | 30 | 90): StatMetric[] {
  return [
    {
      id: 'revenue',
      label: 'Revenue',
      value: days === 7 ? 18240 : days === 30 ? 74500 : 219800,
      unit: 'currency',
      changePercent: 8.2,
      trend: generateTrend({ days, base: days === 7 ? 2600 : days === 30 ? 2480 : 2440, volatility: 400, growth: 0.35, seed: 1 }),
    },
    {
      id: 'active-users',
      label: 'Active Users',
      value: days === 7 ? 4120 : days === 30 ? 15680 : 41200,
      unit: 'number',
      changePercent: 4.6,
      trend: generateTrend({ days, base: days === 7 ? 590 : days === 30 ? 520 : 460, volatility: 90, growth: 0.2, seed: 2 }),
    },
    {
      id: 'sessions',
      label: 'Sessions',
      value: days === 7 ? 9840 : days === 30 ? 38200 : 108400,
      unit: 'number',
      changePercent: -2.1,
      trend: generateTrend({ days, base: days === 7 ? 1400 : days === 30 ? 1270 : 1200, volatility: 220, growth: -0.05, seed: 3 }),
    },
    {
      id: 'conversion-rate',
      label: 'Conversion Rate',
      value: 3.8,
      unit: 'percent',
      changePercent: 1.4,
      trend: generateTrend({ days, base: 3.6, volatility: 0.6, growth: 0.1, seed: 4 }),
    },
  ]
}

export function getRevenueTrend(days: 7 | 30 | 90) {
  return generateTrend({
    days,
    base: days === 7 ? 2600 : days === 30 ? 2480 : 2440,
    volatility: 500,
    growth: 0.35,
    seed: 1,
  })
}

export function getTrafficTrend(days: 7 | 30 | 90) {
  return generateComparisonSeries({
    days,
    base: days === 7 ? 1400 : days === 30 ? 1270 : 1200,
    volatility: 220,
    growth: 0.15,
    seed: 5,
  })
}

export const channelBreakdown: ChannelDatum[] = [
  { channel: 'Organic Search', value: 38 },
  { channel: 'Direct', value: 22 },
  { channel: 'Paid Ads', value: 18 },
  { channel: 'Social', value: 12 },
  { channel: 'Referral', value: 7 },
  { channel: 'Email', value: 3 },
]

export const deviceBreakdown: DeviceDatum[] = [
  { device: 'Desktop', value: 54 },
  { device: 'Mobile', value: 38 },
  { device: 'Tablet', value: 8 },
]

export const aiInsights = [
  'Revenue growth is accelerating — up 8.2% this period, driven mainly by Organic Search traffic.',
  'Mobile sessions are converting 1.3x better than last month; consider shifting more ad spend to mobile.',
  'Session count dipped slightly — check for tracking gaps on the pricing page, which saw a drop in views.',
]
