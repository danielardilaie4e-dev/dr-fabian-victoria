import { getSession } from '@/lib/auth'

export async function GET() {
  const session = await getSession()

  if (!session.isLoggedIn) {
    return Response.json({ isLoggedIn: false }, { status: 401 })
  }

  return Response.json({
    isLoggedIn: true,
    admin: {
      id: session.adminId,
      name: session.adminName,
      email: session.adminEmail,
    },
  })
}
