import { cn } from '@/lib/utils'

export function Badge({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full bg-secondary/10 text-secondary text-xs font-medium px-3 py-1',
        className,
      )}
    >
      {children}
    </span>
  )
}
