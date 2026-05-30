'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { formatWhatsApp } from '@/lib/utils'
import { Star } from 'lucide-react'

const TESTIMONIALS = [
  {
    text: 'Me sentí acompañada durante todo el proceso. La valoración fue clara y pude resolver mis dudas antes de decidir.',
    author: 'María C.',
    procedure: 'Mamoplastia',
  },
  {
    text: 'El trato fue profesional y humano. Me explicaron los cuidados y el seguimiento de forma muy clara.',
    author: 'Andrea L.',
    procedure: 'Liposucción',
  },
  {
    text: 'Lo que más valoré fue la honestidad sobre lo que era posible en mi caso y el acompañamiento después del procedimiento.',
    author: 'Carolina M.',
    procedure: 'Abdominoplastia',
  },
]

export function TestimonialsSection() {
  const whatsappUrl = formatWhatsApp('3209115240')

  return (
    <section id="testimonios" className="py-24 bg-transparent">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <p className="text-[#AA8D57] font-medium text-sm mb-4 uppercase tracking-wider">Testimonios</p>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white mb-4">
            Lo que dicen nuestros pacientes
          </h2>
          <p className="text-[#A59F90]">
            La experiencia de quienes han confiado en nuestro acompañamiento médico.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {TESTIMONIALS.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-[#1a1a1a]/80 rounded-2xl p-6 border border-white/5"
            >
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, j) => (
                  <Star key={j} className="w-4 h-4 text-[#AA8D57] fill-[#AA8D57]" />
                ))}
              </div>
              <p className="text-[#e0e0e0] text-sm leading-relaxed mb-4">
                &ldquo;{t.text}&rdquo;
              </p>
              <div className="border-t border-white/10 pt-3 mt-auto">
                <p className="font-semibold text-sm text-white">{t.author}</p>
                {t.procedure && (
                  <p className="text-xs text-[#AA8D57]">{t.procedure}</p>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <p className="text-sm text-[#A59F90] mb-4">
            Testimonios reales compartidos con autorización. Los resultados varían según cada paciente.
          </p>
          <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
            <Button variant="outline">Agenda tu primera consulta</Button>
          </a>
        </motion.div>
      </div>
    </section>
  )
}
