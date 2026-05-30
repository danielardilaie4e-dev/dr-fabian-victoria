'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { formatWhatsApp } from '@/lib/utils'
import { TestimonialCarousel } from '@/components/ui/TestimonialCarousel'

const TESTIMONIALS = [
  {
    id: 1,
    name: 'María C.',
    text: 'Me sentí acompañada durante todo el proceso. La valoración fue clara y pude resolver mis dudas antes de decidir.',
    procedure: 'Mamoplastia',
  },
  {
    id: 2,
    name: 'Andrea L.',
    text: 'El trato fue profesional y humano. Me explicaron los cuidados y el seguimiento de forma muy clara.',
    procedure: 'Liposucción',
  },
  {
    id: 3,
    name: 'Carolina M.',
    text: 'Lo que más valoré fue la honestidad sobre lo que era posible en mi caso y el acompañamiento después del procedimiento.',
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

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="pb-8"
        >
          <TestimonialCarousel testimonials={TESTIMONIALS} />
        </motion.div>

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
