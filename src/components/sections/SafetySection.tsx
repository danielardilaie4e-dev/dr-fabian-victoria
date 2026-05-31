'use client'

import { motion } from 'framer-motion'
import { ClipboardCheck, FileText, Stethoscope, Syringe, HeartPulse, CalendarCheck } from 'lucide-react'

const SAFETY_STEPS = [
  {
    icon: ClipboardCheck,
    title: 'Valoración médica obligatoria',
    desc: 'Revisión de historia clínica, antecedentes, expectativas y determinación de indicación médica. Ningún procedimiento se realiza sin esta evaluación.',
  },
  {
    icon: FileText,
    title: 'Historia clínica y exámenes',
    desc: 'Evaluación completa de condiciones de salud, exámenes prequirúrgicos y verificación de requisitos para garantizar que el paciente esté en condiciones óptimas.',
  },
  {
    icon: Stethoscope,
    title: 'Planeación quirúrgica individual',
    desc: 'Definición de técnica, abordaje, tiempos y cuidados según la anatomía, salud y expectativas realistas de cada paciente.',
  },
  {
    icon: Syringe,
    title: 'Procedimiento en entorno clínico',
    desc: 'Cirugía realizada bajo anestesia en condiciones controladas, con protocolos de seguridad y personal calificado.',
  },
  {
    icon: HeartPulse,
    title: 'Seguimiento postoperatorio',
    desc: 'Controles médicos programados, manejo de dolor, curación de incisiones y monitoreo de la evolución del paciente.',
  },
  {
    icon: CalendarCheck,
    title: 'Indicaciones claras de recuperación',
    desc: 'Recomendaciones detalladas sobre cuidados, alimentación, actividad física, suspensión de tabaco y señales de alerta.',
  },
]

export function SafetySection() {
  return (
    <section id="seguridad" className="py-24 bg-primary">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <p className="text-secondary font-medium text-sm mb-4 uppercase tracking-wider">Seguridad Quirúrgica</p>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white mb-4">
            Seguridad antes, durante y después de tu cirugía
          </h2>
          <p className="text-neutral">
            Cada etapa está diseñada para minimizar riesgos, maximizar resultados y garantizar tu tranquilidad.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {SAFETY_STEPS.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-card/50 rounded-2xl p-6 border border-card-border/5 hover:border-secondary/30 transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center mb-4">
                <step.icon className="w-6 h-6 text-secondary" />
              </div>
              <h3 className="text-sm font-semibold text-white mb-2">{step.title}</h3>
              <p className="text-sm text-neutral leading-relaxed">{step.desc}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <p className="text-xs text-neutral/60 max-w-xl mx-auto">
            La seguridad del paciente es la prioridad en cada paso. Toda la información es orientativa y no reemplaza
            la valoración médica presencial. Los resultados varían según anatomía, salud, técnica y cuidados.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
