'use client'

import { motion } from 'framer-motion'
import { ClipboardCheck, FileText, Stethoscope, Syringe, HeartPulse, CalendarCheck } from 'lucide-react'
import { useLocale } from '@/lib/locale-context'

const ICONS = [ClipboardCheck, FileText, Stethoscope, Syringe, HeartPulse, CalendarCheck]

export function SafetySection() {
  const { t } = useLocale()

  const steps = Array.from({ length: 6 }, (_, i) => ({
    icon: ICONS[i],
    title: t(`safety.paso${i + 1}_titulo`),
    desc: t(`safety.paso${i + 1}_desc`),
  }))

  return (
    <section id="seguridad" className="py-24 bg-primary">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <p className="text-secondary font-medium text-sm mb-4 uppercase tracking-wider">{t('safety.badge')}</p>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white mb-4">
            {t('safety.titulo')}
          </h2>
          <p className="text-neutral">
            {t('safety.desc')}
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-card/50 rounded-2xl p-6 border border-card-border/5 hover:border-secondary/30 transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center mb-4">
                <step.icon className="w-6 h-6 text-secondary" />
              </div>
              <h3 className="text-sm font-semibold text-white mb-2">{step.title}</h3>
              <p className="text-sm text-neutral leading-relaxed">{step.desc}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <p className="text-xs text-neutral/60 max-w-xl mx-auto">
            {t('safety.disclaimer')}
          </p>
        </motion.div>
      </div>
    </section>
  )
}
