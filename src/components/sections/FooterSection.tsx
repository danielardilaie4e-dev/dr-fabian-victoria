'use client'

import { useLocale } from '@/lib/locale-context'

export function FooterSection() {
  const { t } = useLocale()

  return (
    <footer className="bg-background py-8 border-t border-card-border">
      <div className="container mx-auto px-4 text-center">
        <p className="text-sm text-neutral">
          &copy; {new Date().getFullYear()} Dr. Fabián Victoria —{' '}
          {t('footer.copyright')}
        </p>
      </div>
    </footer>
  )
}
