'use client'

import { ThemeProvider } from 'next-themes'
import { BgProvider } from '@/lib/bg-context'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <BgProvider>
        {children}
      </BgProvider>
    </ThemeProvider>
  )
}
