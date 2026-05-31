'use client'

import { motion } from 'framer-motion'
import { HeartHandshake, Stethoscope, Users, ClipboardCheck } from 'lucide-react'
import { useLocale } from '@/lib/locale-context'

export function TrustBlock() {
  const { t } = useLocale()
  const items = [
    { icon: Users, title: t('trust.pacientes_titulo'), desc: t('trust.pacientes_desc') },
    { icon: Stethoscope, title: t('trust.especialidad_titulo'), desc: t('trust.especialidad_desc') },
    { icon: ClipboardCheck, title: t('trust.valoracion_titulo'), desc: t('trust.valoracion_desc') },
    { icon: HeartHandshake, title: t('trust.acompañamiento_titulo'), desc: t('trust.acompañamiento_desc') },
  ]

  return (
    <section className="py-20 bg-surface/80 backdrop-blur-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-card/80 rounded-2xl p-6 border border-card-border/5 hover:border-secondary/30 transition-all duration-300 hover:shadow-lg hover:shadow-[#AA8D57]/5 group"
            >
              <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center mb-4 group-hover:bg-secondary/20 transition-colors">
                <item.icon className="w-6 h-6 text-secondary" />
              </div>
              <h3 className="text-sm font-semibold text-white mb-2">{item.title}</h3>
              <p className="text-sm text-neutral leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
