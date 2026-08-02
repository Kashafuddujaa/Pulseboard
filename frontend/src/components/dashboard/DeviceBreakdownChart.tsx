import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import type { DeviceDatum } from '@/types/metrics'

const COLORS = ['var(--color-accent)', '#22c55e', '#f59e0b']

export function DeviceBreakdownChart({ data }: { data: DeviceDatum[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Sessions by device</CardTitle>
      </CardHeader>
      <CardContent className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="device"
              innerRadius="55%"
              outerRadius="80%"
              paddingAngle={2}
              label={({ name, value }) => `${name} ${value}%`}
              labelLine={false}
            >
              {data.map((entry, i) => (
                <Cell key={entry.device} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                background: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                borderRadius: 8,
                fontSize: 13,
              }}
              formatter={(value) => [`${value}%`, 'Share']}
            />
            <Legend wrapperStyle={{ fontSize: 12 }} />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
