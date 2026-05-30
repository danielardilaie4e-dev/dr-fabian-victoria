'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Search } from 'lucide-react'

const FAQS = [
  {
    q: '¿La valoración médica es obligatoria antes de una cirugía plástica?',
    r: 'Sí. La valoración permite revisar tu caso, antecedentes, expectativas, riesgos y opciones. Ningún procedimiento debería definirse sin evaluación individual.',
  },
  {
    q: '¿Puedo saber el precio de un procedimiento por WhatsApp?',
    r: 'Se puede recibir orientación inicial, pero el valor final depende de la valoración médica, el tipo de procedimiento, complejidad del caso y necesidades específicas.',
  },
  {
    q: '¿Los resultados son iguales para todos los pacientes?',
    r: 'No. Los resultados varían según anatomía, salud, técnica, recuperación, cuidados y características individuales.',
  },
  {
    q: '¿Cuánto tarda la recuperación?',
    r: 'Depende del procedimiento y del paciente. En la valoración se explican tiempos estimados, cuidados, restricciones y controles.',
  },
  {
    q: '¿La liposucción sirve para bajar de peso?',
    r: 'No debe entenderse como tratamiento para bajar de peso. Es un procedimiento de contorno corporal para casos seleccionados.',
  },
  {
    q: '¿Qué incluye el seguimiento postoperatorio?',
    r: 'Incluye controles médicos y orientación durante la recuperación, según el procedimiento realizado y la evolución del paciente.',
  },
  {
    q: '¿Se pueden combinar procedimientos?',
    r: 'En algunos casos sí, pero depende de la valoración médica, seguridad del paciente, tiempo quirúrgico y condiciones individuales.',
  },
  {
    q: '¿Cómo se manejan las fotos antes y después?',
    r: 'Deben manejarse con autorización del paciente, respeto por la privacidad y claridad de que los resultados varían en cada caso.',
  },
]

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const [search, setSearch] = useState('')

  const filtered = FAQS.filter(
    (faq) =>
      faq.q.toLowerCase().includes(search.toLowerCase()) ||
      faq.r.toLowerCase().includes(search.toLowerCase()),
  )

  return (
    <section id="faq" className="py-24 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <p className="text-[#AA8D57] font-medium text-sm mb-4 uppercase tracking-wider">Preguntas Frecuentes</p>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#221E1F] mb-4">
            Resuelve tus dudas antes de decidir
          </h2>
          <p className="text-[#A59F90]">
            Antes de decidir, es normal tener preguntas. Aquí encontrarás respuestas claras.
          </p>
        </motion.div>

        <div className="relative mb-8">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#A59F90]" />
          <input
            type="text"
            placeholder="Buscar pregunta..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-xl border border-[#AA8D57]/20 bg-[#F7F3EA] text-sm text-[#221E1F] placeholder:text-[#A59F90] focus:outline-none focus:ring-2 focus:ring-[#AA8D57]/30"
          />
        </div>

        <div className="space-y-3">
          {filtered.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.03 }}
              className="border border-[#E4D5A5]/20 rounded-xl overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between p-4 text-left bg-white hover:bg-[#F7F3EA] transition-colors"
              >
                <span className="text-sm font-medium text-[#221E1F] pr-4">{faq.q}</span>
                <ChevronDown
                  className={`w-4 h-4 text-[#AA8D57] shrink-0 transition-transform duration-300 ${
                    openIndex === i ? 'rotate-180' : ''
                  }`}
                />
              </button>
              <AnimatePresence>
                {openIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 pb-4 text-sm text-[#A59F90] leading-relaxed border-t border-[#E4D5A5]/10 pt-3">
                      {faq.r}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
