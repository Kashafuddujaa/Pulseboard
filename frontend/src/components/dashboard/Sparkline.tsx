import { AreaChart, Area, ResponsiveContainer } from 'recharts'
import type { MetricPoint } from '@/types/metrics'

export function Sparkline({ data, positive }: { data: MetricPoint[]; positive: boolean }) {
  const color = positive ? 'var(--color-success)' : 'var(--color-danger)'
  return (
    <ResponsiveContainer width="100%" height={40}>
      <AreaChart data={data} margin={{ top: 2, right: 0, bottom: 0, left: 0 }}>
        <defs>
          <linearGradient id={`spark-${positive ? 'up' : 'down'}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.3} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <Area
          type="monotone"
          dataKey="value"
          stroke={color}
          strokeWidth={1.5}
          fill={`url(#spark-${positive ? 'up' : 'down'})`}
          isAnimationActive={false}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}
