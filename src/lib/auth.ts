import { getIronSession, IronSession } from 'iron-session'
import { cookies } from 'next/headers'
import { prisma } from './prisma'
import bcrypt from 'bcryptjs'

export interface SessionData {
  isLoggedIn: boolean
  adminId?: string
  adminName?: string
  adminEmail?: string
}

const sessionOptions = {
  password: process.env.SESSION_PASSWORD || 'complex_password_at_least_32_characters_long',
  cookieName: 'drfabian_session',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'lax' as const,
    maxAge: 60 * 60 * 8,
  },
}

export async function getSession(): Promise<IronSession<SessionData>> {
  const cookieStore = await cookies()
  const session = await getIronSession<SessionData>(cookieStore, sessionOptions)
  return session
}

export async function verifyCredentials(email: string, password: string) {
  const admin = await prisma.admin.findUnique({ where: { email } })
  if (!admin) return null
  const valid = await bcrypt.compare(password, admin.password)
  if (!valid) return null
  return { id: admin.id, name: admin.name, email: admin.email }
}

export async function seedAdmin() {
  const email = process.env.ADMIN_EMAIL || 'admin@drfabianvictoria.com'
  const password = process.env.ADMIN_PASSWORD || 'admin123456'
  const existing = await prisma.admin.findUnique({ where: { email } })
  if (!existing) {
    const hashed = await bcrypt.hash(password, 12)
    await prisma.admin.create({
      data: { email, password: hashed, name: 'Dr. Fabian Victoria' },
    })
    console.log('Admin user seeded')
  }
}
