import { cn } from '@/lib/utils'

export function Badge({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full bg-[#AA8D57]/10 text-[#AA8D57] text-xs font-medium px-3 py-1',
        className,
      )}
    >
      {children}
    </span>
  )
}
