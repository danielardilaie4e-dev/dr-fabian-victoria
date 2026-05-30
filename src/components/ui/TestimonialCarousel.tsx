'use client'

import { useState } from 'react'
import { motion, PanInfo } from 'framer-motion'
import { cn } from '@/lib/utils'
import { Star } from 'lucide-react'

interface Testimonial {
  id: number | string
  name: string
  text: string
  procedure?: string
}

interface TestimonialCarouselProps {
  testimonials: Testimonial[]
  showDots?: boolean
}

const TestimonialCarousel = ({ testimonials, showDots = true }: TestimonialCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [exitX, setExitX] = useState(0)

  const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (Math.abs(info.offset.x) > 80) {
      setExitX(info.offset.x)
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % testimonials.length)
        setExitX(0)
      }, 200)
    }
  }

  const goTo = (index: number) => {
    setExitX(index > currentIndex ? 200 : -200)
    setTimeout(() => {
      setCurrentIndex(index)
      setExitX(0)
    }, 200)
  }

  return (
    <div className="flex items-center justify-center">
      <div className="relative w-80 h-72 sm:w-96 sm:h-80">
        {testimonials.map((testimonial, index) => {
          const isCurrent = index === currentIndex
          const isPrev = index === (currentIndex + 1) % testimonials.length
          const isNext = index === (currentIndex + 2) % testimonials.length

          if (!isCurrent && !isPrev && !isNext) return null

          const initials = testimonial.name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .slice(0, 2)

          return (
            <motion.div
              key={testimonial.id}
              className={cn(
                'absolute w-full h-full rounded-2xl cursor-grab active:cursor-grabbing',
                'bg-card border border-card-border shadow-xl',
              )}
              style={{ zIndex: isCurrent ? 3 : isPrev ? 2 : 1 }}
              drag={isCurrent ? 'x' : false}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.7}
              onDragEnd={isCurrent ? handleDragEnd : undefined}
              initial={{
                scale: 0.95,
                opacity: 0,
                y: isCurrent ? 0 : isPrev ? 8 : 16,
                rotate: isCurrent ? 0 : isPrev ? -2 : -4,
              }}
              animate={{
                scale: isCurrent ? 1 : 0.95,
                opacity: isCurrent ? 1 : isPrev ? 0.6 : 0.3,
                x: isCurrent ? exitX : 0,
                y: isCurrent ? 0 : isPrev ? 8 : 16,
                rotate: isCurrent ? exitX / 20 : isPrev ? -2 : -4,
              }}
              transition={{
                type: 'spring',
                stiffness: 300,
                damping: 20,
              }}
            >
              <div className="p-6 sm:p-8 flex flex-col items-center gap-4 h-full">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} className="w-4 h-4 text-secondary fill-secondary" />
                  ))}
                </div>

                <div className="w-14 h-14 rounded-full bg-secondary/20 flex items-center justify-center text-secondary font-semibold text-lg shrink-0">
                  {initials}
                </div>

                <p className="text-center text-sm text-neutral leading-relaxed flex-1 flex items-center">
                  &ldquo;{testimonial.text}&rdquo;
                </p>

                <div className="text-center">
                  <p className="font-semibold text-sm text-foreground">{testimonial.name}</p>
                  {testimonial.procedure && (
                    <p className="text-xs text-secondary mt-0.5">{testimonial.procedure}</p>
                  )}
                </div>
              </div>
            </motion.div>
          )
        })}

        {showDots && (
          <div className="absolute -bottom-8 left-0 right-0 flex justify-center gap-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => goTo(index)}
                className={cn(
                  'w-2 h-2 rounded-full transition-all',
                  index === currentIndex
                    ? 'bg-secondary w-5'
                    : 'bg-muted hover:bg-muted/60',
                )}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

TestimonialCarousel.displayName = 'TestimonialCarousel'

export { TestimonialCarousel, type Testimonial }
