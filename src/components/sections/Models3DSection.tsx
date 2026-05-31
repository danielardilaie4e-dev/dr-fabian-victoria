'use client'

import { motion } from 'framer-motion'
import { BodyContourViewer, BreastHarmonyViewer, FacialProfileViewer } from '@/components/three'

const VIEWERS = [
  {
    id: 'body',
    label: 'Contorno corporal',
    description: 'Explora proporción, cintura y transición corporal en procedimientos de remodelación.',
    component: BodyContourViewer,
  },
  {
    id: 'breast',
    label: 'Armonía mamaria',
    description: 'Visualiza volumen, soporte, surco y posición mamaria con enfoque anatómico.',
    component: BreastHarmonyViewer,
  },
  {
    id: 'face',
    label: 'Perfil facial',
    description: 'Comprende la relación entre nariz, labios, mentón y cuello en el perfil.',
    component: FacialProfileViewer,
  },
]

export function Models3DSection() {
  return (
    <section id="modelos-3d" className="py-24 bg-transparent">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto mb-12 max-w-3xl text-center"
        >
          <p className="text-secondary font-medium text-sm mb-4 uppercase tracking-wider">Modelos Educativos 3D</p>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white mb-4">
            Aprende la anatomía antes de hablar de cirugía
          </h2>
          <p className="text-neutral">
            Una guía visual para entender planos, proporciones y decisiones quirúrgicas antes de la valoración médica.
            Las simulaciones son orientativas y no representan resultados garantizados.
          </p>
        </motion.div>

        <div className="mx-auto grid max-w-6xl gap-8">
          {VIEWERS.map((viewer, index) => {
            const Component = viewer.component
            return (
              <motion.div
                key={viewer.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ delay: index * 0.08 }}
              >
                <div className="mb-3 flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-secondary">Módulo {index + 1}</p>
                    <h3 className="mt-1 font-serif text-2xl font-bold text-white">{viewer.label}</h3>
                  </div>
                  <p className="max-w-xl text-sm text-neutral sm:text-right">{viewer.description}</p>
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
