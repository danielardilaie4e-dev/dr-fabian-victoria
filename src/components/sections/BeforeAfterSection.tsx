'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion } from 'framer-motion'
import { useLocale } from '@/lib/locale-context'

interface BeforeAfterItem {
  id: string
  title: string
  beforeUrl: string
  afterUrl: string
  procedure: string | null
  description: string | null
}

function SliderCard({ item }: { item: BeforeAfterItem }) {
  const [sliderPos, setSliderPos] = useState(50)
  const [isDragging, setIsDragging] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const updatePosition = useCallback((clientX: number) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const x = clientX - rect.left
    const pos = Math.max(0, Math.min(100, (x / rect.width) * 100))
    setSliderPos(pos)
  }, [])

  const onMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsDragging(true)
    updatePosition(e.clientX)
  }

  const onTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true)
    updatePosition(e.touches[0].clientX)
  }

  useEffect(() => {
    if (!isDragging) return

    const onMouseMove = (e: MouseEvent) => updatePosition(e.clientX)
    const onMouseUp = () => setIsDragging(false)
    const onTouchMove = (e: TouchEvent) => updatePosition(e.touches[0].clientX)
    const onTouchEnd = () => setIsDragging(false)

    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)
    window.addEventListener('touchmove', onTouchMove, { passive: true })
    window.addEventListener('touchend', onTouchEnd)

    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUp)
      window.removeEventListener('touchmove', onTouchMove)
      window.removeEventListener('touchend', onTouchEnd)
    }
  }, [isDragging, updatePosition])

  return (
    <div className="bg-card rounded-2xl overflow-hidden border border-card-border shadow-sm hover:shadow-md hover:shadow-secondary/5 transition-all duration-300">
      <div
        ref={containerRef}
        className="relative w-full aspect-[4/3] overflow-hidden cursor-ew-resize select-none"
        onMouseDown={onMouseDown}
        onTouchStart={onTouchStart}
      >
        <img
          src={item.afterUrl}
          alt="After"
          className="absolute inset-0 w-full h-full object-cover"
          draggable={false}
        />
        <div
          className="absolute inset-0 w-full h-full"
          style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}
        >
          <img
            src={item.beforeUrl}
            alt="Before"
            className="w-full h-full object-cover"
            draggable={false}
          />
        </div>
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-secondary z-10 pointer-events-none"
          style={{ left: `${sliderPos}%` }}
        >
          <div className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-secondary shadow-lg flex items-center justify-center">
            <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
              <path d="M8 7h8M8 12h8M8 17h8" />
            </svg>
          </div>
        </div>
        <span className="absolute left-3 top-3 text-xs font-semibold text-white bg-black/50 px-2 py-1 rounded z-10 pointer-events-none">
          Antes
        </span>
        <span className="absolute right-3 top-3 text-xs font-semibold text-white bg-black/50 px-2 py-1 rounded z-10 pointer-events-none">
          Despu&eacute;s
        </span>
      </div>
      <div className="p-5">
        {item.procedure && (
          <p className="text-xs text-secondary font-medium uppercase tracking-wider mb-1">{item.procedure}</p>
        )}
        <h3 className="text-lg font-serif font-semibold text-foreground">{item.title}</h3>
        {item.description && (
          <p className="mt-1 text-sm text-neutral">{item.description}</p>
        )}
      </div>
    </div>
  )
}

const PLACEHOLDER_ITEMS: BeforeAfterItem[] = [
  { id: 'demo-1', title: 'Mamoplastia de aumento', beforeUrl: 'https://picsum.photos/seed/antes1/400/300', afterUrl: 'https://picsum.photos/seed/despues1/400/300', procedure: 'Mamoplastia', description: 'Aumento mamario con implantes anatómicos, resultado natural y simétrico.' },
  { id: 'demo-2', title: 'Liposucción abdominal', beforeUrl: 'https://picsum.photos/seed/antes2/400/300', afterUrl: 'https://picsum.photos/seed/despues2/400/300', procedure: 'Liposucción', description: 'Remodelación del contorno abdominal con recuperación sin complicaciones.' },
  { id: 'demo-3', title: 'Rinoplastia estética', beforeUrl: 'https://picsum.photos/seed/antes3/400/300', afterUrl: 'https://picsum.photos/seed/despues3/400/300', procedure: 'Rinoplastia', description: 'Armonización del perfil nasal con mejoría funcional y estética.' },
  { id: 'demo-4', title: 'Abdominoplastia + lipo', beforeUrl: 'https://picsum.photos/seed/antes4/400/300', afterUrl: 'https://picsum.photos/seed/despues4/400/300', procedure: 'Abdominoplastia', description: 'Corrección de diástasis y exceso de piel post-embarazo.' },
  { id: 'demo-5', title: 'Blefaroplastia superior', beforeUrl: 'https://picsum.photos/seed/antes5/400/300', afterUrl: 'https://picsum.photos/seed/despues5/400/300', procedure: 'Blefaroplastia', description: 'Rejuvenecimiento de la mirada con resultados naturales.' },
  { id: 'demo-6', title: 'Mommy Makeover', beforeUrl: 'https://picsum.photos/seed/antes6/400/300', afterUrl: 'https://picsum.photos/seed/despues6/400/300', procedure: 'Mommy Makeover', description: 'Plan integral post-embarazo combinando varios procedimientos.' },
]

export function BeforeAfterSection() {
  const { t } = useLocale()
  const [items, setItems] = useState<BeforeAfterItem[]>(PLACEHOLDER_ITEMS)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    fetch('/api/before-after')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) setItems(data)
        setLoaded(true)
      })
      .catch(() => setLoaded(true))
  }, [])

  return (
    <section id="antes-despues" className="py-24 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <p className="text-secondary font-medium text-sm mb-4 uppercase tracking-wider">
            {t('beforeafter.badge')}
          </p>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-foreground mb-4">
            {t('beforeafter.titulo')}
          </h2>
          <p className="text-neutral">
            {t('beforeafter.desc')}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {items.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <SliderCard item={item} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
