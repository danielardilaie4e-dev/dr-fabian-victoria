'use client'

import { motion } from 'framer-motion'
import { Shield, MapPin, HeartHandshake, Stethoscope } from 'lucide-react'

const TRUST_ITEMS = [
  {
    icon: Stethoscope,
    title: 'Cirugía Plástica, Estética y Reconstructiva',
    desc: 'Especialidad completa con enfoque en seguridad y resultados naturales.',
  },
  {
    icon: MapPin,
    title: 'Ubicado en Cali',
    desc: 'Atención presencial en Cali, Colombia, con valoración médica personalizada.',
  },
  {
    icon: Shield,
    title: 'Valoración Médica Obligatoria',
    desc: 'Cada caso se evalúa individualmente antes de definir cualquier procedimiento.',
  },
  {
    icon: HeartHandshake,
    title: 'Acompañamiento Continuo',
    desc: 'Seguimiento postoperatorio para garantizar tu tranquilidad y recuperación.',
  },
]

export function TrustBlock() {
  return (
    <section className="py-20 bg-[#F7F3EA]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {TRUST_ITEMS.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-white rounded-2xl p-6 border border-[#E4D5A5]/20 hover:border-[#AA8D57]/30 transition-all duration-300 hover:shadow-lg group"
            >
              <div className="w-12 h-12 rounded-xl bg-[#AA8D57]/10 flex items-center justify-center mb-4 group-hover:bg-[#AA8D57]/20 transition-colors">
                <item.icon className="w-6 h-6 text-[#AA8D57]" />
              </div>
              <h3 className="text-sm font-semibold text-[#221E1F] mb-2">{item.title}</h3>
              <p className="text-sm text-[#A59F90] leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
