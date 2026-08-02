import {
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import type { ChannelDatum } from '@/types/metrics'

export function ChannelBarChart({ data }: { data: ChannelDatum[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Traffic by channel</CardTitle>
      </CardHeader>
      <CardContent className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
            <CartesianGrid stroke="var(--color-border)" vertical={false} />
            <XAxis
              dataKey="channel"
              tick={{ fill: 'var(--color-text-secondary)', fontSize: 11 }}
              axisLine={{ stroke: 'var(--color-border)' }}
              tickLine={false}
              interval={0}
              angle={-20}
              textAnchor="end"
              height={50}
            />
            <YAxis
              tickFormatter={(v: number) => `${v}%`}
              tick={{ fill: 'var(--color-text-secondary)', fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              width={40}
            />
            <Tooltip
              contentStyle={{
                background: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                borderRadius: 8,
                fontSize: 13,
              }}
              formatter={(value) => [`${value}%`, 'Share']}
            />
            <Bar dataKey="value" fill="var(--color-accent)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
