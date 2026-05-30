'use client'

import { motion } from 'framer-motion'

interface TypewriterProps {
  texts: string[]
  speed?: number
  className?: string
}

export function Typewriter({ texts, speed = 80, className = '' }: TypewriterProps) {
  return (
    <span className={`inline-flex ${className}`}>
      {texts.map((text, i) => (
        <motion.span
          key={text}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: i * 2.5,
            duration: 0.5,
          }}
          className="after:content-['|'] after:ml-1 after:text-secondary after:animate-pulse"
          onAnimationEnd={(e) => {
            const el = e.currentTarget
            setTimeout(() => {
              el.style.opacity = '0'
              el.style.transition = 'opacity 0.3s'
            }, 2000 + i * 2500)
          }}
        >
          {text}
        </motion.span>
      ))}
    </span>
  )
}
