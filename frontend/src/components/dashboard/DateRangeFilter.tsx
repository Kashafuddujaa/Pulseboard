import { cn } from '@/lib/utils'
import type { DateRangeOption } from '@/types/metrics'

const OPTIONS: DateRangeOption[] = [7, 30, 90]

export function DateRangeFilter({
  value,
  onChange,
}: {
  value: DateRangeOption
  onChange: (value: DateRangeOption) => void
}) {
  return (
    <div className="inline-flex rounded-lg border border-border bg-surface p-0.5">
      {OPTIONS.map((option) => (
        <button
          key={option}
          type="button"
          onClick={() => onChange(option)}
          aria-pressed={value === option}
          className={cn(
            'rounded-md px-3 py-1.5 text-sm font-medium text-text-secondary hover:text-text-primary',
            value === option && 'bg-bg text-text-primary shadow-sm',
          )}
        >
          {option}d
        </button>
      ))}
    </div>
  )
}
