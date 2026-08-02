import { useMemo, useState } from 'react'
import { Sparkles } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { StatCard } from '@/components/dashboard/StatCard'
import { DateRangeFilter } from '@/components/dashboard/DateRangeFilter'
import { RevenueTrendChart } from '@/components/dashboard/RevenueTrendChart'
import { TrafficAreaChart } from '@/components/dashboard/TrafficAreaChart'
import { ChannelBarChart } from '@/components/dashboard/ChannelBarChart'
import { DeviceBreakdownChart } from '@/components/dashboard/DeviceBreakdownChart'
import {
  aiInsights,
  channelBreakdown,
  deviceBreakdown,
  getRevenueTrend,
  getStatMetrics,
  getTrafficTrend,
} from '@/mocks/metrics'
import type { DateRangeOption } from '@/types/metrics'

export function DashboardPage() {
  const [range, setRange] = useState<DateRangeOption>(30)

  const statMetrics = useMemo(() => getStatMetrics(range), [range])
  const revenueTrend = useMemo(() => getRevenueTrend(range), [range])
  const trafficTrend = useMemo(() => getTrafficTrend(range), [range])

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-text-primary">Overview</h2>
          <p className="text-sm text-text-secondary">
            Your business metrics for the last {range} days
          </p>
        </div>
        <DateRangeFilter value={range} onChange={setRange} />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statMetrics.map((metric) => (
          <StatCard key={metric.id} metric={metric} />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <RevenueTrendChart data={revenueTrend} />
        <TrafficAreaChart data={trafficTrend} />
        <ChannelBarChart data={channelBreakdown} />
        <DeviceBreakdownChart data={deviceBreakdown} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-1.5">
            <Sparkles className="size-4 text-accent" />
            AI Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="flex flex-col gap-2.5">
            {aiInsights.map((insight) => (
              <li key={insight} className="flex gap-2 text-sm text-text-primary">
                <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-accent" />
                {insight}
              </li>
            ))}
          </ul>
          <p className="mt-3 text-xs text-text-secondary">
            Illustrative insights — connect an AI provider to generate these live.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
