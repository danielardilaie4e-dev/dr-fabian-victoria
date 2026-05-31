'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { formatWhatsApp } from '@/lib/utils'
import { SpecialText } from '@/components/ui/SpecialText'
import { Phone, ArrowDown, GraduationCap, Award, Shield, MapPin } from 'lucide-react'
import Image from 'next/image'

export function Hero() {
  const whatsappUrl = formatWhatsApp('3209115240')

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden pt-20">
      <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a0a] via-transparent to-[#0a0a0a]/50" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-xl"
          >
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-neutral/80 mb-6">
              <span className="flex items-center gap-1">
                <GraduationCap className="w-3.5 h-3.5 text-secondary" />
                Universidad del Valle
              </span>
              <span className="w-1 h-1 rounded-full bg-neutral/30" />
              <span className="flex items-center gap-1">
                <Award className="w-3.5 h-3.5 text-secondary" />
                Miembro SCCP
              </span>
              <span className="w-1 h-1 rounded-full bg-neutral/30" />
              <span className="flex items-center gap-1">
                <Shield className="w-3.5 h-3.5 text-secondary" />
                Cirugía Estética y Reconstructiva
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-white leading-tight mb-6">
              Cirugía plástica con{' '}
              <span className="text-secondary">precisión médica</span>,
              <SpecialText speed={30} delay={0.5}>
                estética natural
              </SpecialText>{' '}
              y acompañamiento personalizado
            </h1>

            <p className="text-lg text-neutral leading-relaxed mb-8">
              El Dr. Fabián Victoria brinda atención en cirugía plástica, estética y reconstructiva en Cali,
              con valoración detallada, planeación responsable y seguimiento postoperatorio.
            </p>

            <div className="flex flex-wrap gap-4">
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                <Button size="lg" className="gap-2">
                  <Phone className="w-5 h-5" />
                  Agendar valoración
                </Button>
              </a>
              <a href="#procedimientos">
                <Button variant="outline" size="lg">
                  Ver procedimientos
                </Button>
              </a>
              <a
                href="https://maps.google.com/?q=Cali+Colombia"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="outline" size="lg" className="gap-2">
                  <MapPin className="w-5 h-5" />
                  Ubicación
                </Button>
              </a>
            </div>

            <div className="flex items-center gap-6 mt-10 pt-8 border-t border-card-border/10">
              <div className="flex -space-x-2">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="w-10 h-10 rounded-full bg-secondary/20 border-2 border-[#1a1a1a] flex items-center justify-center text-xs text-secondary font-semibold"
                  >
                    {['FV', 'DV', 'MV'][i - 1]}
                  </div>
                ))}
              </div>
              <p className="text-sm text-neutral">
                <span className="text-white font-semibold">+200 pacientes</span> han confiado en su valoración
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="hidden lg:flex items-center justify-center"
          >
            <div className="relative">
              <div className="w-[28rem] h-[28rem] rounded-full bg-gradient-to-br from-[#AA8D57]/20 to-[#AA8D57]/5" />
              <div className="absolute inset-4 rounded-full border border-secondary/10" />
              <div className="absolute inset-6 rounded-full border border-[#E4D5A5]/20 flex items-center justify-center">
                <div className="w-72 h-72 rounded-full bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] flex items-center justify-center border border-secondary/20 overflow-hidden">
                  <Image
                    src="/logo.jpg"
                    alt="Dr. Fabián Victoria"
                    width={280}
                    height={280}
                    className="w-full h-full object-cover opacity-90"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <ArrowDown className="w-5 h-5 text-secondary animate-bounce" />
      </motion.div>
    </section>
  )
}
