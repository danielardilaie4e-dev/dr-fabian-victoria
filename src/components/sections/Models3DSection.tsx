'use client'

import { motion } from 'framer-motion'
import { BodyContourViewer, BreastHarmonyViewer, FacialProfileViewer } from '@/components/three'
import { useLocale } from '@/lib/locale-context'

const VIEWER_CONFIG = [
  { id: 'body', key: 'cuerpo', component: BodyContourViewer },
  { id: 'breast', key: 'mama', component: BreastHarmonyViewer },
  { id: 'face', key: 'facial', component: FacialProfileViewer },
]

export function Models3DSection() {
  const { t } = useLocale()

  return (
    <section id="modelos-3d" className="py-24 bg-transparent">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto mb-12 max-w-3xl text-center"
        >
          <p className="text-secondary font-medium text-sm mb-4 uppercase tracking-wider">{t('models3d.badge')}</p>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white mb-4">
            {t('models3d.titulo')}
          </h2>
          <p className="text-neutral">
            {t('models3d.desc')}
          </p>
        </motion.div>

        <div className="mx-auto grid max-w-6xl gap-8">
          {VIEWER_CONFIG.map((v, index) => {
            const Component = v.component
            return (
              <motion.div
                key={v.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ delay: index * 0.08 }}
              >
                <div className="mb-3 flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-secondary">
                      {t('models3d.etiqueta')}
                    </p>
                    <h3 className="mt-1 font-serif text-2xl font-bold text-white">{t(`models3d.${v.key}`)}</h3>
                  </div>
                  <p className="max-w-xl text-sm text-neutral sm:text-right">{t(`models3d.${v.key}_desc`)}</p>
                </div>
                <Component />
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
