'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { formatWhatsApp } from '@/lib/utils'
import { ChevronRight, Stethoscope, Activity, Eye, User, Heart, Baby } from 'lucide-react'

const CATEGORIES = [
  { value: 'consulta médica', label: 'Valoración', icon: Stethoscope },
  { value: 'corporal', label: 'Corporal', icon: Activity },
  { value: 'mamaria', label: 'Mamaria', icon: Heart },
  { value: 'facial', label: 'Facial', icon: Eye },
  { value: 'cirugía íntima', label: 'Íntima', icon: User },
  { value: 'reconstructiva', label: 'Reconstructiva', icon: Baby },
]

const PROCEDURES = [
  {
    name: 'Valoración médica personalizada',
    category: 'consulta médica',
    desc: 'Consulta inicial para conocer tu caso, revisar expectativas y definir si existe indicación médica.',
    cta: 'Agenda tu valoración',
  },
  {
    name: 'Liposucción y lipoescultura',
    category: 'corporal',
    desc: 'Remodelación del contorno corporal mediante evaluación personalizada de zonas específicas.',
    cta: 'Consulta si eres candidato',
  },
  {
    name: 'Mamoplastia',
    category: 'mamaria',
    desc: 'Aumento, reducción, levantamiento o remodelación mamaria según tu anatomía y necesidades.',
    cta: 'Solicita valoración mamaria',
  },
  {
    name: 'Abdominoplastia',
    category: 'corporal',
    desc: 'Corrección de exceso de piel y flacidez abdominal post-embarazo o pérdida de peso.',
    cta: 'Evalúa tu caso',
  },
  {
    name: 'Blefaroplastia',
    category: 'facial',
    desc: 'Mejora el aspecto de los párpados y la mirada, eliminando exceso de piel y bolsas.',
    cta: 'Consulta por blefaroplastia',
  },
  {
    name: 'Rinoplastia',
    category: 'facial',
    desc: 'Armonización nasal con valoración anatómica y funcional para un resultado natural.',
    cta: 'Agenda valoración facial',
  },
  {
    name: 'Labioplastia',
    category: 'cirugía íntima',
    desc: 'Cirugía íntima femenina con enfoque en comodidad, privacidad y seguridad médica.',
    cta: 'Consulta confidencial',
  },
  {
    name: 'Mommy Makeover',
    category: 'corporal',
    desc: 'Plan integral post-embarazo que combina procedimientos corporales y mamarios.',
    cta: 'Conoce si aplica',
  },
  {
    name: 'Cirugía reconstructiva',
    category: 'reconstructiva',
    desc: 'Restauración de forma y función en casos de trauma, secuelas o reconstrucción anatómica.',
    cta: 'Solicita valoración reconstructiva',
  },
]

export function ProceduresSection() {
  const whatsappUrl = formatWhatsApp('3209115240')

  return (
    <section id="procedimientos" className="py-24 bg-surface/80 backdrop-blur-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <p className="text-secondary font-medium text-sm mb-4 uppercase tracking-wider">Procedimientos</p>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white mb-4">
            Cada procedimiento inicia con una valoración médica
          </h2>
          <p className="text-neutral">
            Antes de hablar de cirugía, se revisa tu caso, tus expectativas, tus antecedentes y las alternativas más adecuadas para ti.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {PROCEDURES.map((proc, i) => {
            const category = CATEGORIES.find((c) => c.value === proc.category)
            const Icon = category?.icon || Stethoscope
            return (
              <motion.div
                key={proc.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
              >
                <Card className="p-6 h-full hover:border-secondary/40 transition-all group cursor-default">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center shrink-0 group-hover:bg-secondary/20 transition-colors">
                      <Icon className="w-5 h-5 text-secondary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <Badge className="mb-2">{category?.label || proc.category}</Badge>
                      <h3 className="font-semibold text-white">{proc.name}</h3>
                    </div>
                  </div>
                  <p className="text-sm text-neutral leading-relaxed mb-4">{proc.desc}</p>
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-sm text-secondary font-medium hover:text-[#8f7546] transition-colors"
                  >
                    {proc.cta}
                    <ChevronRight className="w-4 h-4" />
                  </a>
                </Card>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
