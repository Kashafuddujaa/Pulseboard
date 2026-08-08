// Deterministic demo-data generator, ported from the frontend's original
// mock generator. There's no real analytics pipeline (Stripe/GA/etc.)
// connected to PulseBoard, so these numbers are honest demo data — but now
// genuinely served from the backend and seeded per-workspace, so different
// workspaces see different-but-stable numbers instead of a hardcoded bundle.

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

function isoDateDaysAgo(days: number) {
  const d = new Date()
  d.setUTCHours(0, 0, 0, 0)
  d.setUTCDate(d.getUTCDate() - days)
  return d.toISOString().slice(0, 10)
}

export function seedFromWorkspaceId(workspaceId: string) {
  let h = 0
  for (let i = 0; i < workspaceId.length; i++) {
    h = (Math.imul(31, h) + workspaceId.charCodeAt(i)) | 0
  }
  return h
}

interface SeriesOptions {
  days: number
  base: number
  volatility: number
  growth: number
  seed: number
}

function rawSeries({ days, base, volatility, growth, seed }: SeriesOptions) {
  const random = mulberry32(seed)
  const values: number[] = []
  for (let i = 0; i < days; i++) {
    const trend = base + base * growth * (i / days)
    const wave = Math.sin(i / 5) * volatility * 0.4
    const noise = (random() - 0.5) * volatility
    values.push(Math.max(0, trend + wave + noise))
  }
  return values
}

export interface MetricPoint {
  date: string
  value: number
}

export interface TrendSeriesPoint {
  date: string
  current: number
  previous: number
}

export function generateTrend(options: SeriesOptions): MetricPoint[] {
  const values = rawSeries(options)
  return values.map((value, i) => ({
    date: isoDateDaysAgo(options.days - 1 - i),
    value: Math.round(value),
  }))
}

export function generateComparisonSeries(options: SeriesOptions): TrendSeriesPoint[] {
  const current = rawSeries(options)
  const previous = rawSeries({
    ...options,
    seed: options.seed + 1000,
    growth: options.growth * 0.4,
  })
  return current.map((value, i) => ({
    date: isoDateDaysAgo(options.days - 1 - i),
    current: Math.round(value),
    previous: Math.round(previous[i]),
  }))
}
