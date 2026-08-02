import { ArrowDownRight, ArrowUpRight } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Sparkline } from '@/components/dashboard/Sparkline'
import { formatCurrency, formatNumber, formatPercent } from '@/lib/utils'
import type { StatMetric } from '@/types/metrics'

function formatValue(metric: StatMetric) {
  switch (metric.unit) {
    case 'currency':
      return formatCurrency(metric.value)
    case 'percent':
      return formatPercent(metric.value)
    default:
      return formatNumber(metric.value)
  }
}

export function StatCard({ metric }: { metric: StatMetric }) {
  const positive = metric.changePercent >= 0

  return (
    <Card className="p-4">
      <p className="text-sm font-medium text-text-secondary">{metric.label}</p>
      <div className="mt-1.5 flex items-baseline justify-between gap-2">
        <span className="text-2xl font-semibold text-text-primary">
          {formatValue(metric)}
        </span>
        <Badge tone={positive ? 'success' : 'danger'}>
          {positive ? (
            <ArrowUpRight className="size-3" />
          ) : (
            <ArrowDownRight className="size-3" />
          )}
          {formatPercent(Math.abs(metric.changePercent))}
        </Badge>
      </div>
      <div className="mt-3">
        <Sparkline data={metric.trend} positive={positive} />
      </div>
    </Card>
  )
}
