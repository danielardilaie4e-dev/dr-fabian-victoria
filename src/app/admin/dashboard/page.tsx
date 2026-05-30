'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ClipboardList, MessageSquare, HelpCircle, Inbox } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

interface Stats {
  procedures: number
  testimonials: number
  faqs: number
  inquiries: number
}

export default function Dashboard() {
  const [stats, setStats] = useState<Stats>({
    procedures: 0,
    testimonials: 0,
    faqs: 0,
    inquiries: 0,
  })

  useEffect(() => {
    const load = async () => {
      const [proc, test, faqs, inq] = await Promise.all([
        fetch('/api/procedures').then((r) => r.json()),
        fetch('/api/testimonials').then((r) => r.json()),
        fetch('/api/faqs').then((r) => r.json()),
        fetch('/api/contact').then((r) => r.json()),
      ])
      setStats({
        procedures: Array.isArray(proc) ? proc.length : 0,
        testimonials: Array.isArray(test) ? test.length : 0,
        faqs: Array.isArray(faqs) ? faqs.length : 0,
        inquiries: Array.isArray(inq) ? inq.length : 0,
      })
    }
    load()
  }, [])

  const cards = [
    { label: 'Procedimientos', value: stats.procedures, icon: ClipboardList, href: '/admin/procedures', color: 'text-blue-600 bg-blue-100' },
    { label: 'Testimonios', value: stats.testimonials, icon: MessageSquare, href: '/admin/testimonials', color: 'text-green-600 bg-green-100' },
    { label: 'Preguntas Frecuentes', value: stats.faqs, icon: HelpCircle, href: '/admin/faqs', color: 'text-purple-600 bg-purple-100' },
    { label: 'Contactos', value: stats.inquiries, icon: Inbox, href: '/admin/inquiries', color: 'text-orange-600 bg-orange-100' },
  ]

  return (
    <div>
      <h1 className="text-2xl font-serif font-bold text-[#221E1F] mb-6">Dashboard</h1>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {cards.map((card) => {
          const Icon = card.icon
          return (
            <Link key={card.href} href={card.href}>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-3xl font-bold text-[#221E1F]">{card.value}</p>
                      <p className="text-sm text-neutral mt-1">{card.label}</p>
                    </div>
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${card.color}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>

      <Card>
        <CardContent className="p-6">
          <h2 className="font-semibold text-[#221E1F] mb-2">Bienvenido al panel de administración</h2>
          <p className="text-sm text-neutral">
            Desde aquí puedes gestionar todo el contenido del sitio web del Dr. Fabian Victoria.
            Usa el menú lateral para navegar entre las secciones.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
