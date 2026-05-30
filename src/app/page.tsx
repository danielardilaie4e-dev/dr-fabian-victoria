import { Hero } from '@/components/sections/Hero'
import { TrustBlock } from '@/components/sections/TrustBlock'
import { AboutDoctor } from '@/components/sections/AboutDoctor'
import { ProceduresSection } from '@/components/sections/ProceduresSection'
import { Models3DSection } from '@/components/sections/Models3DSection'
import { ProcessSection } from '@/components/sections/ProcessSection'
import { TestimonialsSection } from '@/components/sections/TestimonialsSection'
import { FAQSection } from '@/components/sections/FAQSection'
import { ContactSection } from '@/components/sections/ContactSection'

export default function Home() {
  return (
    <main>
      <Hero />
      <TrustBlock />
      <AboutDoctor />
      <ProceduresSection />
      <Models3DSection />
      <ProcessSection />
      <TestimonialsSection />
      <FAQSection />
      <ContactSection />

      <footer className="bg-[#0a0a0a] py-8 border-t border-white/5">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-[#A59F90]">
            &copy; {new Date().getFullYear()} Dr. Fabian Victoria — Cirujano Plástico en Cali.
            Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </main>
  )
}
