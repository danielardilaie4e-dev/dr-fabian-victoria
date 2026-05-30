'use client'

import { useState, useEffect, useCallback } from 'react'
import { Input } from '@/components/ui/input'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Send, Stethoscope, Activity, Eye, User, Heart, Baby, MessageCircle, ChevronRight } from 'lucide-react'
import { formatWhatsApp } from '@/lib/utils'

const CATEGORY_ICONS: Record<string, typeof Stethoscope> = {
  'consulta médica': Stethoscope,
  corporal: Activity,
  mamaria: Heart,
  facial: Eye,
  'cirugía íntima': User,
  reconstructiva: Baby,
}

const PROCEDURES = [
  { name: 'Valoración médica personalizada', category: 'consulta médica', desc: 'Consulta inicial para conocer tu caso, revisar expectativas y definir si existe indicación médica.' },
  { name: 'Liposucción y lipoescultura', category: 'corporal', desc: 'Remodelación del contorno corporal mediante evaluación personalizada de zonas específicas.' },
  { name: 'Mamoplastia', category: 'mamaria', desc: 'Aumento, reducción, levantamiento o remodelación mamaria según tu anatomía y necesidades.' },
  { name: 'Abdominoplastia', category: 'corporal', desc: 'Corrección de exceso de piel y flacidez abdominal post-embarazo o pérdida de peso.' },
  { name: 'Blefaroplastia', category: 'facial', desc: 'Mejora el aspecto de los párpados y la mirada, eliminando exceso de piel y bolsas.' },
  { name: 'Rinoplastia', category: 'facial', desc: 'Armonización nasal con valoración anatómica y funcional para un resultado natural.' },
  { name: 'Labioplastia', category: 'cirugía íntima', desc: 'Cirugía íntima femenina con enfoque en comodidad, privacidad y seguridad médica.' },
  { name: 'Mommy Makeover', category: 'corporal', desc: 'Plan integral post-embarazo que combina procedimientos corporales y mamarios.' },
  { name: 'Cirugía reconstructiva', category: 'reconstructiva', desc: 'Restauración de forma y función en casos de trauma, secuelas o reconstrucción anatómica.' },
]

const FAQS = [
  { q: '¿La valoración médica es obligatoria?', r: 'Sí. La valoración permite revisar tu caso, antecedentes, expectativas, riesgos y opciones.' },
  { q: '¿Precios por WhatsApp?', r: 'Se puede recibir orientación inicial, pero el valor final depende de la valoración médica.' },
  { q: '¿Resultados iguales para todos?', r: 'No. Varían según anatomía, salud, técnica, recuperación y cuidados.' },
  { q: '¿Tiempo de recuperación?', r: 'Depende del procedimiento y del paciente. Se explican en la valoración.' },
  { q: '¿Liposucción para bajar de peso?', r: 'No. Es un procedimiento de contorno corporal, no un tratamiento para bajar de peso.' },
]

function useDebounce<T>(value: T, delay = 500): T {
  const [debouncedValue, setDebouncedValue] = useState(value)
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])
  return debouncedValue
}

type SearchItem = {
  id: string
  label: string
  icon: React.ReactNode
  description: string
  type: 'procedimiento' | 'pregunta' | 'contacto'
}

export function MedicalSearch() {
  const [query, setQuery] = useState('')
  const [isFocused, setIsFocused] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const debouncedQuery = useDebounce(query, 200)
  const whatsappUrl = formatWhatsApp('3209115240')

  const allItems: SearchItem[] = [
    ...PROCEDURES.map((p, i) => {
      const Icon = CATEGORY_ICONS[p.category] || Stethoscope
      return {
        id: `proc-${i}`,
        label: p.name,
        icon: <Icon className="h-4 w-4 text-secondary" />,
        description: p.desc,
        type: 'procedimiento' as const,
      }
    }),
    ...FAQS.map((f, i) => ({
      id: `faq-${i}`,
      label: f.q,
      icon: <Search className="h-4 w-4 text-secondary" />,
      description: f.r,
      type: 'pregunta' as const,
    })),
    {
      id: 'contacto',
      label: 'Agendar valoración',
      icon: <MessageCircle className="h-4 w-4 text-secondary" />,
      description: 'Habla directamente con el consultorio por WhatsApp',
      type: 'contacto' as const,
    },
  ]

  const results = !debouncedQuery
    ? allItems
    : allItems.filter(
        (item) =>
          item.label.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
          item.description.toLowerCase().includes(debouncedQuery.toLowerCase()),
      )

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!isFocused) return
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setSelectedIndex((i) => Math.min(i + 1, results.length - 1))
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setSelectedIndex((i) => Math.max(i - 1, 0))
      } else if (e.key === 'Enter' && results[selectedIndex]) {
        e.preventDefault()
        if (results[selectedIndex].type === 'contacto') {
          window.open(whatsappUrl, '_blank')
        } else {
          const section = results[selectedIndex].type === 'procedimiento' ? 'procedimientos' : 'faq'
          document.getElementById(section)?.scrollIntoView({ behavior: 'smooth' })
        }
        setIsFocused(false)
        setQuery('')
      }
    },
    [isFocused, results, selectedIndex, whatsappUrl],
  )

  useEffect(() => {
    setSelectedIndex(0)
  }, [debouncedQuery])

  return (
    <section className="py-24 bg-surface/80 backdrop-blur-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <p className="text-secondary font-medium text-sm mb-4 uppercase tracking-wider">Buscador médico</p>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-foreground mb-4">
            ¿Qué procedimiento te interesa?
          </h2>
          <p className="text-neutral">
            Encuentra información sobre procedimientos, resuelve dudas o agenda tu valoración.
          </p>
        </motion.div>

        <div className="relative" onKeyDown={handleKeyDown}>
          <div className="relative">
            <Input
              type="text"
              placeholder="Busca por procedimiento, palabra clave..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setTimeout(() => setIsFocused(false), 200)}
              className="pl-4 pr-12 py-4 h-13 text-base rounded-xl border-card-border bg-card text-foreground placeholder:text-muted focus:ring-2 focus:ring-secondary/30"
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5">
              <AnimatePresence mode="popLayout">
                {query.length > 0 ? (
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
            {isFocused && (
              <motion.div
                initial={{ opacity: 0, y: -8, scaleY: 0.95 }}
                animate={{ opacity: 1, y: 0, scaleY: 1 }}
                exit={{ opacity: 0, y: -8, scaleY: 0.95 }}
                transition={{ duration: 0.2 }}
                className="absolute top-full left-0 right-0 mt-2 rounded-xl border border-card-border bg-card shadow-2xl overflow-hidden z-50"
              >
                <motion.ul className="py-2 max-h-96 overflow-y-auto">
                  {results.length === 0 ? (
                    <li className="px-4 py-8 text-center">
                      <p className="text-muted text-sm">No se encontraron resultados</p>
                      <a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-secondary text-sm mt-2 hover:underline"
                      >
                        Consulta directamente con el doctor
                        <ChevronRight className="w-3 h-3" />
                      </a>
                    </li>
                  ) : (
                    results.map((item, i) => (
                      <motion.li
                        key={item.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.02, duration: 0.15 }}
                      >
                        <button
                          onMouseDown={() => {
                            if (item.type === 'contacto') {
                              window.open(whatsappUrl, '_blank')
                            } else {
                              const section = item.type === 'procedimiento' ? 'procedimientos' : 'faq'
                              document.getElementById(section)?.scrollIntoView({ behavior: 'smooth' })
                            }
                            setIsFocused(false)
                            setQuery('')
                          }}
                          className={`w-full flex items-start gap-3 px-4 py-3 text-left transition-colors ${
                            i === selectedIndex ? 'bg-secondary/10' : 'hover:bg-surface'
                          }`}
                        >
                          <span className="mt-0.5 shrink-0">{item.icon}</span>
                          <div className="min-w-0 flex-1">
                            <span className="block text-sm font-medium text-foreground truncate">{item.label}</span>
                            <span className="block text-xs text-muted mt-0.5 line-clamp-1">{item.description}</span>
                          </div>
                          <span className="text-[10px] uppercase tracking-wider text-muted shrink-0 mt-0.5">
                            {item.type === 'contacto' ? 'Contacto' : item.type}
                          </span>
                        </button>
                      </motion.li>
                    ))
                  )}
                </motion.ul>

                <div className="px-4 py-2 border-t border-card-border bg-surface">
                  <div className="flex items-center justify-between text-xs text-muted">
                    <span>Usa las flechas ↑ ↓ para navegar, Enter para seleccionar</span>
                    <span>ESC para cerrar</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}
