import { NextRequest } from 'next/server'
import { getSession, verifyCredentials, seedAdmin } from '@/lib/auth'

export async function POST(request: NextRequest) {
  await seedAdmin()

  const { email, password } = await request.json()
  const admin = await verifyCredentials(email, password)

  if (!admin) {
    return Response.json({ error: 'Credenciales inválidas' }, { status: 401 })
  }

  const session = await getSession()
  session.isLoggedIn = true
  session.adminId = admin.id
  session.adminName = admin.name
  session.adminEmail = admin.email
  await session.save()

  return Response.json({ success: true, admin: { name: admin.name, email: admin.email } })
}

export async function DELETE() {
  const session = await getSession()
  session.destroy()
  return Response.json({ success: true })
}
