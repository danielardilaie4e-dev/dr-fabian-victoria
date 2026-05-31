'use client'

import { ThemeProvider } from 'next-themes'
import { BgProvider } from '@/lib/bg-context'
import { LocaleProvider } from '@/lib/locale-context'
import { Models3DProvider } from '@/lib/models3d-context'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <BgProvider>
        <LocaleProvider>
          <Models3DProvider>
            {children}
          </Models3DProvider>
        </LocaleProvider>
      </BgProvider>
    </ThemeProvider>
  )
}
