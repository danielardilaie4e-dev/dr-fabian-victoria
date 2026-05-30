export interface Procedure {
  id: string
  name: string
  category: string
  description: string
  benefits: string[]
  steps: string[]
  recoveryNotes: string | null
  expectedResult: string | null
  commercialPriority: string
  cta: string
  iconName: string | null
  visible: boolean
  order: number
  createdAt: Date
  updatedAt: Date
}

export interface Testimonial {
  id: string
  text: string
  author: string | null
  procedure: string | null
  visible: boolean
  createdAt: Date
}

export interface FAQ {
  id: string
  question: string
  answer: string
  order: number
  visible: boolean
  createdAt: Date
}

export interface SiteContent {
  id: string
  section: string
  key: string
  value: string
}

export interface ContactInquiry {
  id: string
  name: string
  whatsapp: string
  procedure: string | null
  city: string | null
  message: string | null
  consent: boolean
  createdAt: Date
}

export interface GalleryImage {
  id: string
  url: string
  thumbUrl: string | null
  category: string | null
  description: string | null
  consent: boolean
  visible: boolean
  order: number
  createdAt: Date
}
