import type { Report } from '@/types/report'

export const initialReports: Report[] = [
  {
    id: 'r-1',
    name: 'Q1 Sales Summary',
    type: 'sales',
    status: 'ready',
    createdAt: '2026-04-02T10:00:00Z',
    createdBy: 'Jordan Lee',
    metrics: [
      { label: 'Total revenue', value: '$219,800' },
      { label: 'New customers', value: '312' },
      { label: 'Avg. deal size', value: '$704' },
    ],
  },
  {
    id: 'r-2',
    name: 'Weekly Traffic Report',
    type: 'traffic',
    status: 'ready',
    createdAt: '2026-07-28T09:30:00Z',
    createdBy: 'Priya Nandan',
    metrics: [
      { label: 'Sessions', value: '9,840' },
      { label: 'Bounce rate', value: '41%' },
      { label: 'Avg. session', value: '3m 12s' },
    ],
  },
  {
    id: 'r-3',
    name: 'Team Activity — June',
    type: 'team_activity',
    status: 'ready',
    createdAt: '2026-07-01T14:00:00Z',
    createdBy: 'You',
    metrics: [
      { label: 'Active members', value: '8' },
      { label: 'Reports generated', value: '14' },
      { label: 'Comments left', value: '52' },
    ],
  },
  {
    id: 'r-4',
    name: 'Custom Cohort Analysis',
    type: 'custom',
    status: 'failed',
    createdAt: '2026-07-15T11:20:00Z',
    createdBy: 'Marcus Webb',
    metrics: [],
  },
  {
    id: 'r-5',
    name: 'H1 Sales Performance',
    type: 'sales',
    status: 'ready',
    createdAt: '2026-06-30T17:45:00Z',
    createdBy: 'Jordan Lee',
    metrics: [
      { label: 'Total revenue', value: '$1,204,300' },
      { label: 'New customers', value: '1,840' },
      { label: 'Avg. deal size', value: '$654' },
    ],
  },
  {
    id: 'r-6',
    name: 'Traffic Source Breakdown',
    type: 'traffic',
    status: 'ready',
    createdAt: '2026-07-20T08:15:00Z',
    createdBy: 'You',
    metrics: [
      { label: 'Organic share', value: '38%' },
      { label: 'Paid share', value: '18%' },
      { label: 'Top channel', value: 'Organic Search' },
    ],
  },
]
