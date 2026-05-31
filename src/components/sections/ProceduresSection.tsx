'use client'

import { motion } from 'framer-motion'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { formatWhatsApp } from '@/lib/utils'
import { ChevronRight, Stethoscope, Activity, Eye, User, Heart, Baby } from 'lucide-react'
import { useLocale } from '@/lib/locale-context'

const CATEGORIES = [
  { value: 'consulta médica', labelKey: 'procedures.valoracion.titulo', icon: Stethoscope },
  { value: 'corporal', labelKey: 'procedures.lipo.titulo', icon: Activity },
  { value: 'mamaria', labelKey: 'procedures.mama.titulo', icon: Heart },
  { value: 'facial', labelKey: 'procedures.blefaro.titulo', icon: Eye },
  { value: 'cirugía íntima', labelKey: 'procedures.labio.titulo', icon: User },
  { value: 'reconstructiva', labelKey: 'procedures.reconstructiva.titulo', icon: Baby },
]

export function ProceduresSection() {
  const { t } = useLocale()
  const whatsappUrl = formatWhatsApp('3209115240')

  const procedures = [
    { name: t('procedures.valoracion.titulo'), cat: 'consulta médica', desc: t('procedures.valoracion.desc') },
    { name: t('procedures.lipo.titulo'), cat: 'corporal', desc: t('procedures.lipo.desc') },
    { name: t('procedures.mama.titulo'), cat: 'mamaria', desc: t('procedures.mama.desc') },
    { name: t('procedures.abdo.titulo'), cat: 'corporal', desc: t('procedures.abdo.desc') },
    { name: t('procedures.blefaro.titulo'), cat: 'facial', desc: t('procedures.blefaro.desc') },
    { name: t('procedures.rino.titulo'), cat: 'facial', desc: t('procedures.rino.desc') },
    { name: t('procedures.labio.titulo'), cat: 'cirugía íntima', desc: t('procedures.labio.desc') },
    { name: t('procedures.mommy.titulo'), cat: 'corporal', desc: t('procedures.mommy.desc') },
    { name: t('procedures.reconstructiva.titulo'), cat: 'reconstructiva', desc: t('procedures.reconstructiva.desc') },
  ]

  return (
    <section id="procedimientos" className="py-24 bg-surface/80 backdrop-blur-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <p className="text-secondary font-medium text-sm mb-4 uppercase tracking-wider">{t('procedures.badge')}</p>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white mb-4">
            {t('procedures.titulo')}
          </h2>
          <p className="text-neutral">
            {t('procedures.desc')}
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {procedures.map((proc, i) => {
            const category = CATEGORIES.find((c) => c.value === proc.cat) || CATEGORIES[0]
            const Icon = category.icon
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
                      <Badge className="mb-2">{t(category.labelKey)}</Badge>
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
                    {t('procedures.cta')}
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
