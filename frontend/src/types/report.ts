export type ReportStatus = 'ready' | 'generating' | 'failed'
export type ReportType = 'sales' | 'traffic' | 'team_activity' | 'custom'

export interface ReportMetricLine {
  label: string
  value: string
}

export interface Report {
  id: string
  name: string
  type: ReportType
  status: ReportStatus
  createdAt: string
  createdBy: string
  metrics: ReportMetricLine[]
}
