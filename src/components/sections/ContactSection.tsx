'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { formatWhatsApp } from '@/lib/utils'
import { Phone, Globe, MapPin, Shield, ExternalLink } from 'lucide-react'
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
    <section id="contacto" className="py-24 bg-[#221E1F]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-[#AA8D57] font-medium text-sm mb-4 uppercase tracking-wider">Contacto</p>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white mb-6">
              Da el primer paso con una valoración médica personalizada
            </h2>
            <p className="text-[#A59F90] leading-relaxed mb-8">
              Recibe orientación profesional y resuelve tus dudas antes de tomar una decisión.
            </p>

            <div className="space-y-4 mb-8">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-[#A59F90] hover:text-[#AA8D57] transition-colors"
              >
                <Phone className="w-5 h-5 text-[#AA8D57]" />
                <span>+57 320 911 5240</span>
              </a>
              <div className="flex items-center gap-3 text-[#A59F90]">
                <MapPin className="w-5 h-5 text-[#AA8D57]" />
                <span>Cali, Colombia</span>
              </div>
            </div>

            <div className="flex gap-4">
              <a
                href="https://www.instagram.com/drfabianvictoria/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full border border-[#AA8D57]/30 flex items-center justify-center text-[#AA8D57] hover:bg-[#AA8D57]/10 transition-colors"
                title="Instagram"
              >
                <Globe className="w-4 h-4" />
              </a>
              <a
                href="https://www.facebook.com/DrFabianVictoria/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full border border-[#AA8D57]/30 flex items-center justify-center text-[#AA8D57] hover:bg-[#AA8D57]/10 transition-colors"
                title="Facebook"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
              <a
                href="https://www.linkedin.com/in/fabian-victoria-ardila-15b77a125/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full border border-[#AA8D57]/30 flex items-center justify-center text-[#AA8D57] hover:bg-[#AA8D57]/10 transition-colors"
                title="LinkedIn"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>

            <div className="flex items-start gap-3 mt-8 pt-6 border-t border-white/10">
              <Shield className="w-5 h-5 text-[#AA8D57] mt-0.5 shrink-0" />
              <p className="text-xs text-[#A59F90] leading-relaxed">
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
              <div className="bg-white/5 rounded-2xl p-8 text-center border border-white/10">
                <div className="w-16 h-16 rounded-full bg-[#AA8D57]/20 flex items-center justify-center mx-auto mb-4">
                  <Phone className="w-8 h-8 text-[#AA8D57]" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">¡Mensaje enviado!</h3>
                <p className="text-[#A59F90] text-sm mb-6">
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
              <form onSubmit={handleSubmit} className="bg-white/5 rounded-2xl p-8 border border-white/10">
                <h3 className="text-lg font-semibold text-white mb-6">Solicita tu valoración</h3>
                <div className="space-y-4">
                  <Input
                    placeholder="Nombre completo"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                    className="bg-white/10 border-white/20 text-white placeholder:text-[#A59F90]"
                  />
                  <Input
                    type="tel"
                    placeholder="WhatsApp"
                    value={form.whatsapp}
                    onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
                    required
                    className="bg-white/10 border-white/20 text-white placeholder:text-[#A59F90]"
                  />
                  <Input
                    placeholder="Procedimiento de interés"
                    value={form.procedure}
                    onChange={(e) => setForm({ ...form, procedure: e.target.value })}
                    className="bg-white/10 border-white/20 text-white placeholder:text-[#A59F90]"
                  />
                  <Input
                    placeholder="Ciudad"
                    value={form.city}
                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                    className="bg-white/10 border-white/20 text-white placeholder:text-[#A59F90]"
                  />
                  <Textarea
                    placeholder="Mensaje o consulta (opcional)"
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    rows={3}
                    className="bg-white/10 border-white/20 text-white placeholder:text-[#A59F90]"
                  />
                  <Button type="submit" size="lg" className="w-full" disabled={loading}>
                    {loading ? 'Enviando...' : 'Enviar solicitud'}
                  </Button>
                  <p className="text-xs text-[#A59F90] text-center">
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
