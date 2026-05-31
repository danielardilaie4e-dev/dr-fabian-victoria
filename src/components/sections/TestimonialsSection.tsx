'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { formatWhatsApp } from '@/lib/utils'
import { Star } from 'lucide-react'
import { useLocale } from '@/lib/locale-context'

export function TestimonialsSection() {
  const { t } = useLocale()
  const whatsappUrl = formatWhatsApp('3209115240')

  const items = [
    { id: 1, name: t('testimonials.t1_nombre'), text: t('testimonials.t1_texto'), procedure: t('testimonials.t1_proc') },
    { id: 2, name: t('testimonials.t2_nombre'), text: t('testimonials.t2_texto'), procedure: t('testimonials.t2_proc') },
    { id: 3, name: t('testimonials.t3_nombre'), text: t('testimonials.t3_texto'), procedure: t('testimonials.t3_proc') },
  ]

  return (
    <section id="testimonios" className="py-24 bg-transparent">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <p className="text-secondary font-medium text-sm mb-4 uppercase tracking-wider">{t('testimonials.badge')}</p>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-foreground mb-4">
            {t('testimonials.titulo')}
          </h2>
          <p className="text-neutral">
            {t('testimonials.desc')}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {items.map((item, i) => {
            const initials = item.name
              .split(' ')
              .map((n) => n[0])
              .join('')
              .slice(0, 2)
            return (
              <motion.div
                key={item.id}
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
                <p className="text-sm text-neutral leading-relaxed">&ldquo;{item.text}&rdquo;</p>
                <div>
                  <p className="font-semibold text-sm text-foreground">{item.name}</p>
                  {item.procedure && (
                    <p className="text-xs text-secondary mt-0.5">{item.procedure}</p>
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
            {t('testimonials.disclaimer')}
          </p>
          <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
            <Button variant="outline">{t('testimonials.cta')}</Button>
          </a>
        </motion.div>
      </div>
    </section>
  )
}
