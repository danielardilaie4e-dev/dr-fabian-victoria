'use client'

import { Phone } from 'lucide-react'
import { formatWhatsApp } from '@/lib/utils'

export function WhatsAppButton() {
  const whatsappUrl = formatWhatsApp('3209115240')

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-[#25D366] text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center justify-center"
      aria-label="Contactar por WhatsApp"
    >
      <Phone className="w-6 h-6" />
    </a>
  )
}
