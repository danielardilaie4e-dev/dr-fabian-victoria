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
              <div className="absolute inset-0 bg-gradient-to-br from-[#AA8D57]/20 to-[#AA8D57]/5 rounded-3xl" />
              <div className="absolute inset-3 bg-card rounded-2xl flex items-center justify-center border border-card-border/5">
                <div className="text-center p-8">
                  <Image
                    src="/logo.jpg"
                    alt="Dr. Fabián Victoria"
                    width={200}
                    height={200}
                    className="rounded-full mx-auto mb-4 border-2 border-secondary/30"
                  />
                  <h3 className="text-white text-xl font-serif">Dr. Fabián Efrén</h3>
                  <h3 className="text-white text-xl font-serif">Victoria Ardila</h3>
                  <p className="text-secondary text-sm mt-2">Cirujano Plástico</p>
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

            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white mb-6">
              {t('about.titulo')}
            </h2>

            <p className="text-neutral leading-relaxed mb-6">
              {t('about.desc')}
            </p>

            <div className="space-y-4 mb-8">
              <div className="flex items-start gap-3">
                <Award className="w-5 h-5 text-secondary mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-medium text-white">Universidad del Valle</p>
                  <p className="text-sm text-neutral">{t('about.formacion')}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Heart className="w-5 h-5 text-secondary mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-medium text-white">Miembro SCCP</p>
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
