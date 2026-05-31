'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { formatWhatsApp } from '@/lib/utils'
import { Menu, X, Phone, Sparkles, Globe } from 'lucide-react'
import Image from 'next/image'
import { useBg } from '@/lib/bg-context'
import { useLocale } from '@/lib/locale-context'

const NAV_KEYS = [
  { key: 'inicio', href: '#' },
  { key: 'sobre_el_doctor', href: '#sobre-el-doctor' },
  { key: 'procedimientos', href: '#procedimientos' },
  { key: 'seguridad', href: '#seguridad' },
  { key: 'testimonios', href: '#testimonios' },
  { key: 'faq', href: '#faq' },
  { key: 'contacto', href: '#contacto' },
]

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const { animated, toggle } = useBg()
  const { t, locale, setLocale } = useLocale()
  const whatsappUrl = formatWhatsApp('3209115240')

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-card/80 backdrop-blur-xl border-b border-card-border/10 shadow-lg shadow-black/10'
          : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          <a href="#" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-lg overflow-hidden ring-1 ring-secondary/30">
              <Image
                src="/logo.jpg"
                alt="Dr. Fabián Victoria"
                width={36}
                height={36}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-semibold text-foreground leading-tight">{t('nav.titulo')}</p>
              <p className="text-[10px] text-muted leading-tight">{t('nav.subtitulo')}</p>
            </div>
          </a>

          <div className="hidden lg:flex items-center gap-1">
            {NAV_KEYS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="px-3 py-2 text-sm text-neutral hover:text-foreground hover:bg-white/5 rounded-lg transition-colors"
              >
                {t(`nav.${link.key}`)}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setLocale(locale === 'es' ? 'en' : 'es')}
              className="hidden sm:flex w-9 h-9 rounded-xl items-center justify-center gap-1 text-xs font-semibold text-muted hover:text-secondary hover:bg-white/5 transition-colors"
              aria-label={locale === 'es' ? 'Switch to English' : 'Cambiar a Español'}
              title={locale === 'es' ? 'English' : 'Español'}
            >
              <Globe className="w-3.5 h-3.5" />
              {locale === 'es' ? 'EN' : 'ES'}
            </button>

            <button
              onClick={toggle}
              className="hidden sm:flex w-9 h-9 rounded-xl items-center justify-center text-muted hover:text-secondary hover:bg-white/5 transition-colors"
              aria-label={animated ? t('nav.bg_aria_on') : t('nav.bg_aria_off')}
              title={animated ? t('nav.bg_tooltip_on') : t('nav.bg_tooltip_off')}
            >
              <Sparkles className={`w-4 h-4 transition-opacity ${animated ? 'opacity-100' : 'opacity-40'}`} />
            </button>

            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="hidden sm:block">
              <Button size="sm" className="gap-2">
                <Phone className="w-4 h-4" />
                {t('nav.agendar')}
              </Button>
            </a>

            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="lg:hidden w-10 h-10 rounded-xl flex items-center justify-center text-foreground hover:bg-white/5 transition-colors"
              aria-label={locale === 'es' ? 'Menú' : 'Menu'}
            >
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden border-t border-card-border/10 bg-card/95 backdrop-blur-xl lg:hidden"
          >
            <div className="container mx-auto px-4 py-4 space-y-1">
              {NAV_KEYS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="block px-4 py-3 text-sm text-neutral hover:text-foreground hover:bg-white/5 rounded-xl transition-colors"
                >
                  {t(`nav.${link.key}`)}
                </a>
              ))}
              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => { setLocale(locale === 'es' ? 'en' : 'es'); setMenuOpen(false) }}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm text-neutral hover:text-foreground hover:bg-white/5 rounded-xl transition-colors"
                >
                  <Globe className="w-4 h-4" />
                  {locale === 'es' ? 'EN' : 'ES'}
                </button>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setMenuOpen(false)}
                  className="block sm:hidden flex-1"
                >
                  <Button size="sm" className="w-full gap-2">
                    <Phone className="w-4 h-4" />
                    {t('nav.agendar')}
                  </Button>
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
