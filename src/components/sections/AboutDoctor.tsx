'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { GraduationCap, Award, Heart } from 'lucide-react'
import { formatWhatsApp } from '@/lib/utils'
import Image from 'next/image'

export function AboutDoctor() {
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
              <div className="absolute inset-3 bg-[#1a1a1a] rounded-2xl flex items-center justify-center border border-white/5">
                <div className="text-center p-8">
                  <Image
                    src="/logo.jpg"
                    alt="Dr. Fabian Victoria"
                    width={200}
                    height={200}
                    className="rounded-full mx-auto mb-4 border-2 border-[#AA8D57]/30"
                  />
                  <h3 className="text-white text-xl font-serif">Dr. Fabián Efrén</h3>
                  <h3 className="text-white text-xl font-serif">Victoria Ardila</h3>
                  <p className="text-[#AA8D57] text-sm mt-2">Cirujano Plástico</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 bg-[#AA8D57]/10 text-[#AA8D57] text-sm font-medium px-4 py-1.5 rounded-full mb-4">
              <GraduationCap className="w-4 h-4" />
              Sobre el doctor
            </div>

            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white mb-6">
              Especialista en cirugía plástica, estética y reconstructiva
            </h2>

            <p className="text-[#A59F90] leading-relaxed mb-6">
              El Dr. Fabián Efrén Victoria Ardila es cirujano plástico en Cali, enfocado en procedimientos
              estéticos y reconstructivos con una atención basada en valoración individual, seguridad del
              paciente y seguimiento continuo. Su trabajo busca armonizar expectativas, anatomía y criterio
              médico para orientar cada caso de forma responsable.
            </p>

            <div className="space-y-4 mb-8">
              <div className="flex items-start gap-3">
                <Award className="w-5 h-5 text-[#AA8D57] mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-medium text-white">Universidad del Valle</p>
                  <p className="text-sm text-[#A59F90]">Formación en cirugía plástica</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Heart className="w-5 h-5 text-[#AA8D57] mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-medium text-white">Miembro SCCP</p>
                  <p className="text-sm text-[#A59F90]">Sociedad Colombiana de Cirugía Plástica</p>
                </div>
              </div>
            </div>

            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
              <Button size="lg">Habla con el consultorio</Button>
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
