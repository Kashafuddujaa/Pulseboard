import { useState, type FormEvent } from 'react'
import { Modal } from '@/components/ui/Modal'
import { Select } from '@/components/ui/Select'
import { Button } from '@/components/ui/Button'
import type { ReportType } from '@/types/report'

const TYPE_OPTIONS: { value: ReportType; label: string }[] = [
  { value: 'sales', label: 'Sales' },
  { value: 'traffic', label: 'Traffic' },
  { value: 'team_activity', label: 'Team Activity' },
  { value: 'custom', label: 'Custom' },
]

export interface GenerateReportFormValues {
  type: ReportType
  range: '7' | '30' | '90'
}

export function GenerateReportModal({
  open,
  onClose,
  onGenerate,
}: {
  open: boolean
  onClose: () => void
  onGenerate: (values: GenerateReportFormValues) => void
}) {
  const [type, setType] = useState<ReportType>('sales')
  const [range, setRange] = useState<'7' | '30' | '90'>('30')

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    onGenerate({ type, range })
    onClose()
  }

  return (
    <Modal open={open} onClose={onClose} title="Generate report">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Select
          label="Report type"
          value={type}
          onChange={(e) => setType(e.target.value as ReportType)}
        >
          {TYPE_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>

        <Select
          label="Date range"
          value={range}
          onChange={(e) => setRange(e.target.value as '7' | '30' | '90')}
        >
          <option value="7">Last 7 days</option>
          <option value="30">Last 30 days</option>
          <option value="90">Last 90 days</option>
        </Select>

        <div className="mt-2 flex justify-end gap-2">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">Generate</Button>
        </div>
      </form>
    </Modal>
  )
}
