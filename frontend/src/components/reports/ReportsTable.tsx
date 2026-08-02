import { Loader2 } from 'lucide-react'
import { Table, Thead, Tbody, Tr, Th, Td } from '@/components/ui/Table'
import { Badge } from '@/components/ui/Badge'
import { ExportMenu } from '@/components/reports/ExportMenu'
import { formatDate } from '@/lib/utils'
import type { Report, ReportStatus, ReportType } from '@/types/report'

const TYPE_LABELS: Record<ReportType, string> = {
  sales: 'Sales',
  traffic: 'Traffic',
  team_activity: 'Team Activity',
  custom: 'Custom',
}

const STATUS_TONE: Record<ReportStatus, 'success' | 'accent' | 'danger'> = {
  ready: 'success',
  generating: 'accent',
  failed: 'danger',
}

export function ReportsTable({
  reports,
  onView,
  onDelete,
}: {
  reports: Report[]
  onView: (report: Report) => void
  onDelete: (report: Report) => void
}) {
  if (reports.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-1 py-16 text-center">
        <p className="text-sm font-medium text-text-primary">No reports found</p>
        <p className="text-sm text-text-secondary">
          Try adjusting your search or generate a new report.
        </p>
      </div>
    )
  }

  return (
    <Table>
      <Thead>
        <Tr>
          <Th>Name</Th>
          <Th>Type</Th>
          <Th>Status</Th>
          <Th>Created</Th>
          <Th>Created by</Th>
          <Th className="text-right">Actions</Th>
        </Tr>
      </Thead>
      <Tbody>
        {reports.map((report) => (
          <Tr key={report.id}>
            <Td className="font-medium">
              <button
                type="button"
                onClick={() => onView(report)}
                className="text-left hover:text-accent"
                disabled={report.status !== 'ready'}
              >
                {report.name}
              </button>
            </Td>
            <Td className="text-text-secondary">{TYPE_LABELS[report.type]}</Td>
            <Td>
              <Badge tone={STATUS_TONE[report.status]}>
                {report.status === 'generating' && (
                  <Loader2 className="size-3 animate-spin" />
                )}
                {report.status === 'ready'
                  ? 'Ready'
                  : report.status === 'generating'
                    ? 'Generating'
                    : 'Failed'}
              </Badge>
            </Td>
            <Td className="text-text-secondary">{formatDate(report.createdAt)}</Td>
            <Td className="text-text-secondary">{report.createdBy}</Td>
            <Td className="text-right">
              <ExportMenu
                report={report}
                onView={() => onView(report)}
                onDelete={() => onDelete(report)}
              />
            </Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  )
}
