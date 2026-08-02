export interface MetricPoint {
  date: string
  value: number
}

export type MetricUnit = 'currency' | 'number' | 'percent'

export interface StatMetric {
  id: string
  label: string
  value: number
  unit: MetricUnit
  changePercent: number
  trend: MetricPoint[]
}

export interface ChannelDatum {
  channel: string
  value: number
}

export interface DeviceDatum {
  device: string
  value: number
}

export interface TrendSeriesPoint {
  date: string
  current: number
  previous: number
}

export type DateRangeOption = 7 | 30 | 90
