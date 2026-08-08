import { useEffect, useMemo, useState } from 'react'
import { Plus, Search } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Card } from '@/components/ui/Card'
import { ReportsTable } from '@/components/reports/ReportsTable'
import {
  GenerateReportModal,
  type GenerateReportFormValues,
} from '@/components/reports/GenerateReportModal'
import { ReportPreviewModal } from '@/components/reports/ReportPreviewModal'
import { apiFetch } from '@/lib/api'
import type { Report, ReportStatus } from '@/types/report'

export function ReportsPage() {
  const [reports, setReports] = useState<Report[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<ReportStatus | 'all'>('all')
  const [isGenerateOpen, setIsGenerateOpen] = useState(false)
  const [previewReport, setPreviewReport] = useState<Report | null>(null)

  useEffect(() => {
    apiFetch<Report[]>('/reports')
      .then(setReports)
      .catch((err) =>
        setLoadError(err instanceof Error ? err.message : 'Failed to load reports'),
      )
      .finally(() => setIsLoading(false))
  }, [])

  const filteredReports = useMemo(() => {
    return reports.filter((report) => {
      const matchesSearch = report.name.toLowerCase().includes(search.toLowerCase())
      const matchesStatus = statusFilter === 'all' || report.status === statusFilter
      return matchesSearch && matchesStatus
    })
  }, [reports, search, statusFilter])

  const handleGenerate = async (values: GenerateReportFormValues) => {
    const report = await apiFetch<Report>('/reports', {
      method: 'POST',
      body: JSON.stringify(values),
    })
    setReports((prev) => [report, ...prev])
  }

  const handleDelete = async (report: Report) => {
    await apiFetch(`/reports/${report.id}`, { method: 'DELETE' })
    setReports((prev) => prev.filter((r) => r.id !== report.id))
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-text-primary">Reports</h2>
          <p className="text-sm text-text-secondary">
            Generate and export reports on your business metrics
          </p>
        </div>
        <Button onClick={() => setIsGenerateOpen(true)}>
          <Plus className="size-4" />
          Generate report
        </Button>
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-48">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-text-secondary" />
          <Input
            placeholder="Search reports..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as ReportStatus | 'all')}
          className="w-44"
        >
          <option value="all">All statuses</option>
          <option value="ready">Ready</option>
          <option value="generating">Generating</option>
          <option value="failed">Failed</option>
        </Select>
      </div>

      <Card>
        {isLoading ? (
          <p className="p-6 text-sm text-text-secondary">Loading reports...</p>
        ) : loadError ? (
          <p className="p-6 text-sm text-danger">{loadError}</p>
        ) : (
          <ReportsTable
            reports={filteredReports}
            onView={setPreviewReport}
            onDelete={handleDelete}
          />
        )}
      </Card>

      <GenerateReportModal
        open={isGenerateOpen}
        onClose={() => setIsGenerateOpen(false)}
        onGenerate={handleGenerate}
      />
      <ReportPreviewModal report={previewReport} onClose={() => setPreviewReport(null)} />
    </div>
  )
}
