import { cn } from '@/lib/utils'
import { forwardRef, ButtonHTMLAttributes } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center rounded-xl font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#AA8D57]/50 disabled:opacity-50 disabled:pointer-events-none',
          {
            'bg-[#221E1F] text-white hover:bg-[#1A1718] border border-[#AA8D57]/30':
              variant === 'primary',
            'bg-[#AA8D57] text-white hover:bg-[#8f7546]': variant === 'secondary',
            'border-2 border-[#AA8D57]/40 text-white hover:bg-[#AA8D57]/10':
              variant === 'outline',
            'text-white hover:bg-[#AA8D57]/10': variant === 'ghost',
            'bg-red-600 text-white hover:bg-red-700': variant === 'danger',
          },
          {
            'h-9 px-4 text-sm': size === 'sm',
            'h-11 px-6 text-base': size === 'md',
            'h-13 px-8 text-lg': size === 'lg',
          },
          className,
        )}
        {...props}
      />
    )
  },
)
Button.displayName = 'Button'

export { Button }
