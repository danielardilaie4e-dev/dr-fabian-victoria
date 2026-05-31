'use client'

import { ThemeProvider } from 'next-themes'
import { BgProvider } from '@/lib/bg-context'
import { LocaleProvider } from '@/lib/locale-context'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <BgProvider>
        <LocaleProvider>
          {children}
        </LocaleProvider>
      </BgProvider>
    </ThemeProvider>
  )
}
