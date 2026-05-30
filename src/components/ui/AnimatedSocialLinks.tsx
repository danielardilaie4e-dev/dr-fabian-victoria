'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Globe, ExternalLink } from 'lucide-react'

interface Social {
  name: string
  url: string
  icon: React.ReactNode
  color: string
}

const ICONS: Record<string, React.ReactNode> = {
  Instagram: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  ),
  Facebook: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  ),
  LinkedIn: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  ),
}

const SOCIALS: Social[] = [
  {
    name: 'Instagram',
    url: 'https://www.instagram.com/drfabianvictoria/',
    icon: ICONS['Instagram'],
    color: '#E1306C',
  },
  {
    name: 'Facebook',
    url: 'https://www.facebook.com/DrFabianVictoria/',
    icon: ICONS['Facebook'],
    color: '#1877F2',
  },
  {
    name: 'LinkedIn',
    url: 'https://www.linkedin.com/in/fabian-victoria-ardila-15b77a125/',
    icon: ICONS['LinkedIn'],
    color: '#0A66C2',
  },
]

export function AnimatedSocialLinks() {
  const [hovered, setHovered] = useState<string | null>(null)
  const [clicked, setClicked] = useState(false)

  return (
    <div className="flex items-center justify-center gap-2 sm:gap-4">
      {SOCIALS.map((social) => {
        const isHovered = hovered === social.name
        const rotation = Math.random() * 16 - 8

        return (
          <a
            key={social.name}
            href={social.url}
            target="_blank"
            rel="noopener noreferrer"
            onMouseEnter={() => setHovered(social.name)}
            onMouseLeave={() => setHovered(null)}
            onClick={() => {
              setClicked(true)
              setTimeout(() => setClicked(false), 200)
            }}
            className={`relative flex items-center gap-2 px-4 py-2 rounded-xl border transition-all duration-200 ${
              hovered && !isHovered
                ? 'border-card-border/30 opacity-50'
                : isHovered
                  ? 'border-secondary/50 bg-secondary/10'
                  : 'border-card-border hover:border-secondary/30'
            }`}
          >
            <span className="text-secondary">{social.icon}</span>
            <span className={`text-sm font-medium transition-colors ${
              isHovered ? 'text-secondary' : 'text-muted'
            }`}>
              {social.name}
            </span>

            <AnimatePresence>
              {isHovered && (
                <motion.div
                  className="absolute -top-10 left-1/2 -translate-x-1/2"
                  initial={{ y: 10, opacity: 0, scale: 0.8 }}
                  animate={{
                    y: 0,
                    opacity: 1,
                    scale: 1,
                    rotate: rotation,
                  }}
                  exit={{ y: 10, opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.2 }}
                >
                  <div
                    className="px-3 py-1 rounded-lg text-xs font-semibold text-white shadow-lg"
                    style={{ backgroundColor: social.color }}
                  >
                    Seguir
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </a>
        )
      })}
    </div>
  )
}
