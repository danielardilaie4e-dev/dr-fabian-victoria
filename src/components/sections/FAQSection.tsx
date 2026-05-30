'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Search, Send, MessageCircle, ChevronRight } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { formatWhatsApp } from '@/lib/utils'

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

function useDebounce<T>(value: T, delay = 300): T {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(t)
  }, [value, delay])
  return debounced
}

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const [search, setSearch] = useState('')
  const [isFocused, setIsFocused] = useState(false)
  const debouncedSearch = useDebounce(search, 200)
  const listRef = useRef<HTMLDivElement>(null)

  const filtered = FAQS.filter(
    (faq) =>
      faq.q.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      faq.r.toLowerCase().includes(debouncedSearch.toLowerCase()),
  )

  const whatsappUrl = formatWhatsApp('3209115240')

  return (
    <section id="faq" className="py-24 bg-surface/80 backdrop-blur-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <p className="text-secondary font-medium text-sm mb-4 uppercase tracking-wider">Preguntas Frecuentes</p>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-foreground mb-4">
            Resuelve tus dudas antes de decidir
          </h2>
          <p className="text-neutral">
            Antes de decidir, es normal tener preguntas. Aquí encontrarás respuestas claras.
          </p>
        </motion.div>

        <div className="relative mb-8">
          <div className="relative">
            <Input
              type="text"
              placeholder="Buscar pregunta..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setTimeout(() => setIsFocused(false), 200)}
              className="pl-4 pr-12 py-4 h-13 text-base rounded-xl border-card-border bg-card text-foreground placeholder:text-muted focus:ring-2 focus:ring-secondary/30"
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5">
              <AnimatePresence mode="popLayout">
                {search.length > 0 ? (
                  <motion.div
                    key="send"
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 20, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Send className="w-5 h-5 text-secondary" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="search"
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 20, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Search className="w-5 h-5 text-muted" />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <AnimatePresence>
            {isFocused && search.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -8, scaleY: 0.95 }}
                animate={{ opacity: 1, y: 0, scaleY: 1 }}
                exit={{ opacity: 0, y: -8, scaleY: 0.95 }}
                transition={{ duration: 0.2 }}
                className="absolute top-full left-0 right-0 mt-2 rounded-xl border border-card-border bg-card shadow-2xl overflow-hidden z-50"
              >
                {filtered.length === 0 ? (
                  <div className="px-4 py-8 text-center">
                    <p className="text-muted text-sm">No encontramos esa pregunta</p>
                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-secondary text-sm mt-2 hover:underline"
                    >
                      Pregunta directamente al doctor
                      <ChevronRight className="w-3 h-3" />
                    </a>
                  </div>
                ) : (
                  <ul className="py-2">
                    {filtered.map((faq, i) => (
                      <motion.li
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.02, duration: 0.15 }}
                      >
                        <button
                          onMouseDown={() => {
                            const realIndex = FAQS.findIndex((f) => f.q === faq.q)
                            setOpenIndex(openIndex === realIndex ? null : realIndex)
                            setSearch('')
                            setIsFocused(false)
                          }}
                          className="w-full flex items-start gap-3 px-4 py-3 text-left hover:bg-surface transition-colors"
                        >
                          <MessageCircle className="w-4 h-4 text-secondary mt-0.5 shrink-0" />
                          <span className="text-sm text-foreground line-clamp-1">{faq.q}</span>
                        </button>
                      </motion.li>
                    ))}
                  </ul>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div ref={listRef} className="space-y-3 min-h-[200px]">
          <AnimatePresence mode="popLayout">
            {(debouncedSearch ? filtered : FAQS).map((faq, i) => {
              const realIndex = FAQS.findIndex((f) => f.q === faq.q)
              return (
                <motion.div
                  key={faq.q}
                  layout
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="border border-card-border/10 rounded-xl overflow-hidden"
                >
                  <button
                    onClick={() => setOpenIndex(openIndex === realIndex ? null : realIndex)}
                    className="w-full flex items-center justify-between p-4 text-left bg-card hover:bg-surface transition-colors"
                  >
                    <span className="text-sm font-medium text-foreground pr-4">{faq.q}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-secondary shrink-0 transition-transform duration-300 ${
                        openIndex === realIndex ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  <AnimatePresence>
                    {openIndex === realIndex && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="px-4 pb-4 text-sm text-neutral leading-relaxed border-t border-card-border/5 pt-3 bg-card">
                          {faq.r}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}
