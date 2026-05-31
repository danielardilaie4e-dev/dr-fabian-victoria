import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'
import { DottedSurface } from '@/components/three/DottedSurface'
import { WhatsAppButton } from '@/components/WhatsAppButton'
import { AIChat } from '@/components/AIChat'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Dr. Fabian Victoria | Cirujano Plástico en Cali',
  description:
    'Cirugía plástica, estética y reconstructiva en Cali. Agenda una valoración médica personalizada con el Dr. Fabian Victoria.',
  keywords: [
    'cirujano plástico Cali',
    'Dr Fabian Victoria',
    'cirugía plástica Cali',
    'cirugía estética Cali',
    'liposucción Cali',
    'mamoplastia Cali',
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" className={`${inter.variable} ${playfair.variable}`} suppressHydrationWarning>
      <body className="font-sans antialiased">
        <Providers>
          <DottedSurface />
          <div className="relative z-10">{children}</div>
          <WhatsAppButton />
          <AIChat />
        </Providers>
      </body>
    </html>
  )
}
