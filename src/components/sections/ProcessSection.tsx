'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, Search, ClipboardList, Stethoscope, Heart } from 'lucide-react'
import { useLocale } from '@/lib/locale-context'

const STEP_ICONS = [MessageCircle, Search, ClipboardList, Stethoscope, Heart]

export function ProcessSection() {
  const { t } = useLocale()

  const steps = Array.from({ length: 5 }, (_, i) => ({
    icon: STEP_ICONS[i],
    label: t(`process.paso${i + 1}_titulo`),
    desc: t(`process.paso${i + 1}_desc`),
  }))

  const [activeStep, setActiveStep] = useState(0)

  return (
    <section id="proceso" className="py-24 bg-gradient-to-b from-background via-surface to-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <p className="text-secondary font-medium text-sm mb-4 uppercase tracking-wider">{t('process.badge')}</p>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-foreground mb-4">
            {t('process.titulo')}
          </h2>
          <p className="text-neutral">
            {t('process.desc')}
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          <div className="relative flex justify-between items-start mb-12">
            {steps.map((step, i) => {
              const Icon = step.icon
              const isActive = i <= activeStep
              const isCurrent = i === activeStep

              return (
                <button
                  key={step.label}
                  onClick={() => setActiveStep(i)}
                  className="flex flex-col items-center gap-2 group z-10"
                >
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 ${
                      isCurrent
                        ? 'bg-secondary text-white shadow-lg shadow-secondary/30 scale-110'
                        : isActive
                          ? 'bg-secondary/20 text-secondary'
                          : 'bg-card border border-card-border text-muted'
                    }`}
                  >
                    <Icon className="w-6 h-6" />
                  </motion.div>
                  <span className={`text-xs font-medium transition-colors ${
                    isCurrent ? 'text-secondary' : isActive ? 'text-foreground' : 'text-muted'
                  }`}>
                    {step.label}
                  </span>
                </button>
              )
            })}

            <div className="absolute top-7 left-0 right-0 h-px bg-card-border -z-0">
              <motion.div
                className="h-full bg-secondary"
                initial={{ width: '0%' }}
                animate={{ width: `${(activeStep / (steps.length - 1)) * 100}%` }}
                transition={{ duration: 0.5, ease: 'easeInOut' }}
              />
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeStep}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="bg-card/60 border border-card-border rounded-2xl p-6 sm:p-8 text-center max-w-2xl mx-auto"
            >
              <div className="w-14 h-14 rounded-full bg-secondary/10 flex items-center justify-center mx-auto mb-4">
                {(() => {
                  const Icon = steps[activeStep].icon
                  return <Icon className="w-7 h-7 text-secondary" />
                })()}
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">{steps[activeStep].label}</h3>
              <p className="text-neutral leading-relaxed">{steps[activeStep].desc}</p>
            </motion.div>
          </AnimatePresence>

          <div className="flex justify-center gap-2 mt-6">
            {steps.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveStep(i)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  i === activeStep ? 'bg-secondary w-5' : 'bg-muted/50 hover:bg-muted'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
