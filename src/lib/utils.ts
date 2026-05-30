import { type ClassValue, clsx } from 'clsx'

export function cn(...inputs: ClassValue[]) {
  return clsx(...inputs)
}

export function formatWhatsApp(phone: string) {
  const clean = phone.replace(/[^\d]/g, '')
  return `https://wa.me/57${clean}`
}
