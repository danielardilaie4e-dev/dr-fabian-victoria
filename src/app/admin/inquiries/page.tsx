'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatWhatsApp } from '@/lib/utils'
import { Phone, MapPin, Calendar } from 'lucide-react'

interface Inquiry {
  id: string
  name: string
  whatsapp: string
  procedure: string | null
  city: string | null
  message: string | null
  createdAt: string
}

export default function AdminInquiries() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([])

  useEffect(() => {
    fetch('/api/contact')
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setInquiries(data)
      })
  }, [])

  return (
    <div>
      <h1 className="text-2xl font-serif font-bold text-[#221E1F] mb-6">Contactos Recibidos</h1>

      {inquiries.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center text-neutral">
            No hay solicitudes de contacto aún.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {inquiries.map((inq) => (
            <Card key={inq.id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-[#221E1F]">{inq.name}</h3>
                      {inq.procedure && <Badge>{inq.procedure}</Badge>}
                    </div>
                    <div className="flex flex-wrap gap-3 text-sm text-neutral">
                      <a
                        href={formatWhatsApp(inq.whatsapp)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-[#25D366] hover:underline"
                      >
                        <Phone className="w-3 h-3" />
                        {inq.whatsapp}
                      </a>
                      {inq.city && (
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {inq.city}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(inq.createdAt).toLocaleDateString('es-CO')}
                      </span>
                    </div>
                    {inq.message && (
                      <p className="text-sm text-[#221E1F] mt-2 bg-[#F7F3EA] rounded-lg p-3">
                        {inq.message}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
