'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { formatWhatsApp } from '@/lib/utils'
import { AnimatedSocialLinks } from '@/components/ui/AnimatedSocialLinks'
import { Phone, MapPin, Shield, Clock, Navigation } from 'lucide-react'
import { useState } from 'react'
import { useLocale } from '@/lib/locale-context'

export function ContactSection() {
  const { t } = useLocale()
  const whatsappUrl = formatWhatsApp('3209115240')
  const [form, setForm] = useState({ name: '', whatsapp: '', procedure: '', city: '', message: '' })
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, consent: true }),
      })
      setSent(true)
      setForm({ name: '', whatsapp: '', procedure: '', city: '', message: '' })
    } catch {
      //
    }
    setLoading(false)
  }

  return (
    <section id="contacto" className="py-24 bg-primary">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-secondary font-medium text-sm mb-4 uppercase tracking-wider">{t('contact.badge')}</p>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white mb-6">
              {t('contact.titulo')}
            </h2>
            <p className="text-white/70 leading-relaxed mb-8">
              {t('contact.desc')}
            </p>

            <div className="space-y-4 mb-8">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-white/70 hover:text-secondary transition-colors"
              >
                <Phone className="w-5 h-5 text-secondary" />
                <span>+57 320 911 5240</span>
              </a>
              <div className="flex items-center gap-3 text-white/70">
                <MapPin className="w-5 h-5 text-secondary shrink-0" />
                <span>{t('contact.ubicacion')}</span>
              </div>
              <div className="flex items-center gap-3 text-white/70">
                <Clock className="w-5 h-5 text-secondary shrink-0" />
                <span>{t('contact.horario')}</span>
              </div>
              <a
                href="https://maps.google.com/?q=Cali+Colombia"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-secondary text-sm hover:underline"
              >
                <Navigation className="w-4 h-4" />
                {t('contact.como_llegar')}
              </a>
            </div>

            <AnimatedSocialLinks />

            <div className="flex items-start gap-3 mt-8 pt-6 border-t border-card-border">
              <Shield className="w-5 h-5 text-secondary mt-0.5 shrink-0" />
              <p className="text-xs text-white/50 leading-relaxed">
                {t('contact.disclaimer')}
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            {sent ? (
                <div className="bg-white/5 rounded-2xl p-8 text-center border border-card-border">
                <div className="w-16 h-16 rounded-full bg-secondary/20 flex items-center justify-center mx-auto mb-4">
                  <Phone className="w-8 h-8 text-secondary" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{t('contact.success_titulo')}</h3>
                <p className="text-white/70 text-sm mb-6">
                  {t('contact.success_desc')}
                </p>
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                  <Button variant="secondary" className="gap-2">
                    <Phone className="w-4 h-4" />
                    {t('contact.success_cta')}
                  </Button>
                </a>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="bg-white/5 rounded-2xl p-8 border border-card-border">
                <h3 className="text-lg font-semibold text-white mb-6">{t('contact.form_titulo')}</h3>
                <div className="space-y-4">
                  <Input
                    placeholder={t('contact.form_nombre')}
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                    className="bg-white/10 border-card-border text-white placeholder:text-white/40"
                  />
                  <Input
                    type="tel"
                    placeholder={t('contact.form_wpp')}
                    value={form.whatsapp}
                    onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
                    required
                    className="bg-white/10 border-card-border text-white placeholder:text-white/40"
                  />
                  <Input
                    placeholder={t('contact.form_proc')}
                    value={form.procedure}
                    onChange={(e) => setForm({ ...form, procedure: e.target.value })}
                    className="bg-white/10 border-card-border text-white placeholder:text-white/40"
                  />
                  <Input
                    placeholder={t('contact.form_ciudad')}
                    value={form.city}
                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                    className="bg-white/10 border-card-border text-white placeholder:text-white/40"
                  />
                  <Textarea
                    placeholder={t('contact.form_mensaje')}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    rows={3}
                    className="bg-white/10 border-card-border text-white placeholder:text-white/40"
                  />
                  <Button type="submit" size="lg" className="w-full" disabled={loading}>
                    {loading ? t('contact.form_enviando') : t('contact.form_enviar')}
                  </Button>
                  <p className="text-xs text-white/50 text-center">
                    {t('contact.form_consent')}
                  </p>
                </div>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
