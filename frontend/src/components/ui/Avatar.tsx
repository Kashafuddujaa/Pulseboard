import { initials, cn } from '@/lib/utils'

export function Avatar({ name, className }: { name: string; className?: string }) {
  return (
    <div
      className={cn(
        'flex size-8 shrink-0 items-center justify-center rounded-full bg-accent-soft text-xs font-semibold text-accent',
        className,
      )}
      aria-hidden="true"
    >
      {initials(name)}
    </div>
  )
}
