'use client'

import { motion } from 'framer-motion'
import { Shield, MapPin, HeartHandshake, Stethoscope, Users, ClipboardCheck } from 'lucide-react'

const TRUST_ITEMS = [
  {
    icon: Users,
    title: '+200 pacientes valorados',
    desc: 'Atención personalizada en Cali con evaluación médica individual y seguimiento continuo.',
  },
  {
    icon: Stethoscope,
    title: 'Cirugía Plástica, Estética y Reconstructiva',
    desc: 'Especialidad completa con enfoque en seguridad, resultados naturales y criterio médico responsable.',
  },
  {
    icon: ClipboardCheck,
    title: 'Valoración Médica Obligatoria',
    desc: 'Cada caso se evalúa individualmente antes de definir cualquier procedimiento. No se opera sin evaluación previa.',
  },
  {
    icon: HeartHandshake,
    title: 'Acompañamiento Continuo',
    desc: 'Planeación responsable, procedimiento en entorno clínico y seguimiento postoperatorio personalizado.',
  },
]

export function TrustBlock() {
  return (
    <section className="py-20 bg-surface/80 backdrop-blur-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {TRUST_ITEMS.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-card/80 rounded-2xl p-6 border border-card-border/5 hover:border-secondary/30 transition-all duration-300 hover:shadow-lg hover:shadow-[#AA8D57]/5 group"
            >
              <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center mb-4 group-hover:bg-secondary/20 transition-colors">
                <item.icon className="w-6 h-6 text-secondary" />
              </div>
              <h3 className="text-sm font-semibold text-white mb-2">{item.title}</h3>
              <p className="text-sm text-neutral leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
