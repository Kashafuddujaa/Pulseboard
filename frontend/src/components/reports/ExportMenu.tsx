import { Download, Eye, MoreHorizontal, Trash2 } from 'lucide-react'
import { Dropdown, DropdownItem } from '@/components/ui/Dropdown'
import type { Report } from '@/types/report'

function toCsv(report: Report) {
  const header = 'Metric,Value'
  const rows = report.metrics.map((m) => `"${m.label}","${m.value}"`)
  return [header, ...rows].join('\n')
}

export function ExportMenu({
  report,
  onView,
  onDelete,
}: {
  report: Report
  onView: () => void
  onDelete: () => void
}) {
  const handleExport = () => {
    const csv = toCsv(report)
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${report.name.replace(/\s+/g, '-').toLowerCase()}.csv`
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <Dropdown
      trigger={
        <span className="flex size-8 items-center justify-center rounded-md text-text-secondary hover:bg-surface-hover hover:text-text-primary">
          <MoreHorizontal className="size-4" />
        </span>
      }
    >
      <DropdownItem onClick={onView}>
        <Eye className="size-4" />
        View
      </DropdownItem>
      <DropdownItem onClick={handleExport} disabled={report.status !== 'ready'}>
        <Download className="size-4" />
        Export CSV
      </DropdownItem>
      <DropdownItem onClick={onDelete} className="text-danger hover:bg-danger-soft">
        <Trash2 className="size-4" />
        Delete
      </DropdownItem>
    </Dropdown>
  )
}
