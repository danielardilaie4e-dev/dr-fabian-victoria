'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { formatWhatsApp } from '@/lib/utils'
import { TestimonialCarousel } from '@/components/ui/TestimonialCarousel'

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
