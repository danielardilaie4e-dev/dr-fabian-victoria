'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { GraduationCap, Award, Heart } from 'lucide-react'
import { formatWhatsApp } from '@/lib/utils'
import Image from 'next/image'
import { useLocale } from '@/lib/locale-context'

export function AboutDoctor() {
  const { t } = useLocale()
  const whatsappUrl = formatWhatsApp('3209115240')

  return (
    <section id="sobre-el-doctor" className="py-24 bg-transparent">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="relative w-full aspect-[3/4] max-w-md mx-auto">
              <div className="absolute inset-0 bg-gradient-to-br from-secondary/20 to-secondary/5 rounded-3xl" />
              <div className="absolute inset-3 rounded-2xl overflow-hidden border border-card-border">
                <Image
                  src="/fp.jpeg"
                  alt="Dr. Fabián Victoria"
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent p-5 pt-12">
                  <p className="text-white font-serif text-lg font-bold leading-tight">Dr. Fabián Efrén</p>
                  <p className="text-white font-serif text-lg font-bold leading-tight">Victoria Ardila</p>
                  <p className="text-secondary text-sm mt-1 font-medium">Cirujano Plástico</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 bg-secondary/10 text-secondary text-sm font-medium px-4 py-1.5 rounded-full mb-4">
              <GraduationCap className="w-4 h-4" />
              {t('about.badge')}
            </div>

            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-foreground mb-6">
              {t('about.titulo')}
            </h2>

            <p className="text-neutral leading-relaxed mb-6">
              {t('about.desc')}
            </p>

            <div className="space-y-4 mb-8">
              <div className="flex items-start gap-3">
                <Award className="w-5 h-5 text-secondary mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-medium text-foreground">Universidad del Valle</p>
                  <p className="text-sm text-neutral">{t('about.formacion')}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Heart className="w-5 h-5 text-secondary mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-medium text-foreground">Miembro SCCP</p>
                  <p className="text-sm text-neutral">{t('about.sociedad')}</p>
                </div>
              </div>
            </div>

            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
              <Button size="lg">{t('about.cta')}</Button>
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
