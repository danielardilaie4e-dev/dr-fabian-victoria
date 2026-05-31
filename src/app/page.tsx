import { Hero } from '@/components/sections/Hero'
import { TrustBlock } from '@/components/sections/TrustBlock'
import { AboutDoctor } from '@/components/sections/AboutDoctor'
import { ProceduresSection } from '@/components/sections/ProceduresSection'
import { Models3DSection } from '@/components/sections/Models3DSection'
import { ProcessSection } from '@/components/sections/ProcessSection'
import { SafetySection } from '@/components/sections/SafetySection'
import { TestimonialsSection } from '@/components/sections/TestimonialsSection'
import { BeforeAfterSection } from '@/components/sections/BeforeAfterSection'
import { FAQSection } from '@/components/sections/FAQSection'
import { ContactSection } from '@/components/sections/ContactSection'
import { FooterSection } from '@/components/sections/FooterSection'

export default function Home() {
  return (
    <main>
      <Hero />
      <TrustBlock />
      <AboutDoctor />
      <ProceduresSection />
      <Models3DSection />
      <ProcessSection />
      <SafetySection />
      <TestimonialsSection />
      <BeforeAfterSection />
      <FAQSection />
      <ContactSection />
      <FooterSection />
    </main>
  )
}
