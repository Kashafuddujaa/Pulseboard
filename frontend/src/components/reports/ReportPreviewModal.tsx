import { Modal } from '@/components/ui/Modal'
import { formatDate } from '@/lib/utils'
import type { Report } from '@/types/report'

export function ReportPreviewModal({
  report,
  onClose,
}: {
  report: Report | null
  onClose: () => void
}) {
  return (
    <Modal open={report !== null} onClose={onClose} title={report?.name ?? ''}>
      {report && (
        <div className="flex flex-col gap-4">
          <p className="text-sm text-text-secondary">
            Generated {formatDate(report.createdAt)} by {report.createdBy}
          </p>
          <dl className="divide-y divide-border rounded-lg border border-border">
            {report.metrics.map((metric) => (
              <div
                key={metric.label}
                className="flex items-center justify-between px-3 py-2.5 text-sm"
              >
                <dt className="text-text-secondary">{metric.label}</dt>
                <dd className="font-medium text-text-primary">{metric.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      )}
    </Modal>
  )
}
