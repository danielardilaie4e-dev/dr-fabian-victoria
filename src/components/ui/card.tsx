import { cn } from '@/lib/utils'

interface CardProps {
  className?: string
  children: React.ReactNode
}

export function Card({ className, children }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-2xl bg-white border border-[#E4D5A5]/30 shadow-sm hover:shadow-md transition-all duration-300',
        className,
      )}
    >
      {children}
    </div>
  )
}

export function CardHeader({ className, children }: CardProps) {
  return <div className={cn('px-6 pt-6 pb-3', className)}>{children}</div>
}

export function CardContent({ className, children }: CardProps) {
  return <div className={cn('px-6 py-3', className)}>{children}</div>
}

export function CardFooter({ className, children }: CardProps) {
  return <div className={cn('px-6 pt-3 pb-6', className)}>{children}</div>
}
