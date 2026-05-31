'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { formatWhatsApp } from '@/lib/utils'
import { Star } from 'lucide-react'

const TESTIMONIALS = [
  {
    id: 1,
    name: 'María C.',
    text: 'Llegué con muchas dudas sobre la mamoplastia. En la valoración me explicaron tamaños, tipos de implantes, cicatrices y límites reales. Me sentí acompañada durante todo el proceso y los controles postoperatorios fueron puntuales.',
    procedure: 'Mamoplastia',
  },
  {
    id: 2,
    name: 'Andrea L.',
    text: 'Lo que más me gustó fue la honestidad: me dijeron claramente qué podía esperar y qué no. La lipoescultura fue exactamente lo que acordamos, la recuperación fue más llevadera de lo que imaginaba y el seguimiento fue constante.',
    procedure: 'Liposucción',
  },
  {
    id: 3,
    name: 'Carolina M.',
    text: 'Después de dos embarazos, la abdominoplastia era algo que quería desde hace años. Me explicaron la recuperación real, los tiempos, las cicatrices y los cuidados. El resultado no fue milagroso, fue médico: mejoría real con expectativas claras.',
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
          <p className="text-secondary font-medium text-sm mb-4 uppercase tracking-wider">Testimonios</p>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-foreground mb-4">
            Lo que dicen nuestros pacientes
          </h2>
          <p className="text-neutral">
            La experiencia de quienes han confiado en nuestro acompañamiento médico.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t, i) => {
            const initials = t.name
              .split(' ')
              .map((n) => n[0])
              .join('')
              .slice(0, 2)
            return (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-card rounded-2xl p-6 border border-card-border/10 flex flex-col items-center gap-4 text-center"
              >
                <div className="flex gap-1">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} className="w-4 h-4 text-secondary fill-secondary" />
                  ))}
                </div>
                <div className="w-14 h-14 rounded-full bg-secondary/20 flex items-center justify-center text-secondary font-semibold text-lg">
                  {initials}
                </div>
                <p className="text-sm text-neutral leading-relaxed">&ldquo;{t.text}&rdquo;</p>
                <div>
                  <p className="font-semibold text-sm text-foreground">{t.name}</p>
                  {t.procedure && (
                    <p className="text-xs text-secondary mt-0.5">{t.procedure}</p>
                  )}
                </div>
              </motion.div>
            )
          })}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <p className="text-sm text-neutral mb-4">
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
