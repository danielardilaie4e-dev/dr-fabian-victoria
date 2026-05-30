'use client'

import { motion } from 'framer-motion'
import { ProcessTimeline3D } from '@/components/three'

export function ProcessSection() {
  return (
    <section id="proceso" className="py-24 bg-[#F7F3EA]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto mb-12"
        >
          <p className="text-[#AA8D57] font-medium text-sm mb-4 uppercase tracking-wider">Tu Proceso</p>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#221E1F] mb-4">
            Tu seguridad es parte central del proceso
          </h2>
          <p className="text-[#A59F90]">
            La valoración, la planeación quirúrgica y el seguimiento permiten tomar decisiones informadas,
            resolver dudas y definir si un procedimiento es adecuado para tu caso.
          </p>
        </motion.div>

        <ProcessTimeline3D />
      </div>
    </section>
  )
}
