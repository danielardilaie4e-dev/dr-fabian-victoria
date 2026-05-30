'use client'

import { motion } from 'framer-motion'
import { BodyContourViewer, BreastHarmonyViewer, FacialProfileViewer } from '@/components/three'

const VIEWERS = [
  { id: 'body', label: 'Contorno Corporal', component: BodyContourViewer },
  { id: 'breast', label: 'Armonía Mamaria', component: BreastHarmonyViewer },
  { id: 'face', label: 'Perfil Facial', component: FacialProfileViewer },
]

export function Models3DSection() {
  return (
    <section id="modelos-3d" className="py-24 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto mb-12"
        >
          <p className="text-[#AA8D57] font-medium text-sm mb-4 uppercase tracking-wider">Modelos Educativos 3D</p>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#221E1F] mb-4">
            Visualiza y entiende cada procedimiento
          </h2>
          <p className="text-[#A59F90]">
            Explora modelos anatómicos interactivos para comprender mejor cada procedimiento.
            Estos modelos son educativos y no representan resultados garantizados.
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          {VIEWERS.map((viewer) => {
            const Component = viewer.component
            return (
              <div key={viewer.id} className="mb-8">
                <Component />
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
