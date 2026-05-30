'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { formatWhatsApp } from '@/lib/utils'
import { AnimatedSocialLinks } from '@/components/ui/AnimatedSocialLinks'
import { Phone, MapPin, Shield } from 'lucide-react'
import { useState } from 'react'

export function ContactSection() {
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
            <p className="text-secondary font-medium text-sm mb-4 uppercase tracking-wider">Contacto</p>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white mb-6">
              Da el primer paso con una valoración médica personalizada
            </h2>
            <p className="text-neutral leading-relaxed mb-8">
              Recibe orientación profesional y resuelve tus dudas antes de tomar una decisión.
            </p>

            <div className="space-y-4 mb-8">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-neutral hover:text-secondary transition-colors"
              >
                <Phone className="w-5 h-5 text-secondary" />
                <span>+57 320 911 5240</span>
              </a>
              <div className="flex items-center gap-3 text-neutral">
                <MapPin className="w-5 h-5 text-secondary" />
                <span>Cali, Colombia</span>
              </div>
            </div>

            <AnimatedSocialLinks />

            <div className="flex items-start gap-3 mt-8 pt-6 border-t border-card-border/10">
              <Shield className="w-5 h-5 text-secondary mt-0.5 shrink-0" />
              <p className="text-xs text-neutral leading-relaxed">
                La información de esta página es orientativa y no reemplaza una valoración médica.
                Cada paciente requiere evaluación individual. Los resultados pueden variar según anatomía,
                condiciones de salud, técnica, recuperación y cuidados postoperatorios.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            {sent ? (
              <div className="bg-white/5 rounded-2xl p-8 text-center border border-card-border/10">
                <div className="w-16 h-16 rounded-full bg-secondary/20 flex items-center justify-center mx-auto mb-4">
                  <Phone className="w-8 h-8 text-secondary" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">¡Mensaje enviado!</h3>
                <p className="text-neutral text-sm mb-6">
                  Te contactaremos pronto para agendar tu valoración.
                </p>
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                  <Button variant="secondary" className="gap-2">
                    <Phone className="w-4 h-4" />
                    Hablar por WhatsApp
                  </Button>
                </a>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="bg-white/5 rounded-2xl p-8 border border-card-border/10">
                <h3 className="text-lg font-semibold text-white mb-6">Solicita tu valoración</h3>
                <div className="space-y-4">
                  <Input
                    placeholder="Nombre completo"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                    className="bg-white/10 border-card-border/20 text-white placeholder:text-neutral"
                  />
                  <Input
                    type="tel"
                    placeholder="WhatsApp"
                    value={form.whatsapp}
                    onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
                    required
                    className="bg-white/10 border-card-border/20 text-white placeholder:text-neutral"
                  />
                  <Input
                    placeholder="Procedimiento de interés"
                    value={form.procedure}
                    onChange={(e) => setForm({ ...form, procedure: e.target.value })}
                    className="bg-white/10 border-card-border/20 text-white placeholder:text-neutral"
                  />
                  <Input
                    placeholder="Ciudad"
                    value={form.city}
                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                    className="bg-white/10 border-card-border/20 text-white placeholder:text-neutral"
                  />
                  <Textarea
                    placeholder="Mensaje o consulta (opcional)"
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    rows={3}
                    className="bg-white/10 border-card-border/20 text-white placeholder:text-neutral"
                  />
                  <Button type="submit" size="lg" className="w-full" disabled={loading}>
                    {loading ? 'Enviando...' : 'Enviar solicitud'}
                  </Button>
                  <p className="text-xs text-neutral text-center">
                    Al enviar, aceptas el tratamiento de tus datos para fines de contacto médico.
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
