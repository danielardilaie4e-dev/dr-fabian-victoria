import { cn } from '@/lib/utils'
import { InputHTMLAttributes, forwardRef } from 'react'

const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          'w-full rounded-xl border border-white/10 bg-[#1a1a1a] px-4 py-3 text-sm text-white placeholder:text-[#A59F90] focus:outline-none focus:ring-2 focus:ring-[#AA8D57]/30 focus:border-[#AA8D57]/50 transition-all',
          className,
        )}
        {...props}
      />
    )
  },
)
Input.displayName = 'Input'

export { Input }
