import { cn } from '@/lib/utils'
import { TextareaHTMLAttributes, forwardRef } from 'react'

const Textarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={cn(
          'w-full rounded-xl border border-[#AA8D57]/20 bg-white px-4 py-3 text-sm text-[#221E1F] placeholder:text-[#A59F90] focus:outline-none focus:ring-2 focus:ring-[#AA8D57]/30 focus:border-[#AA8D57]/50 transition-all resize-none',
          className,
        )}
        {...props}
      />
    )
  },
)
Textarea.displayName = 'Textarea'

export { Textarea }
