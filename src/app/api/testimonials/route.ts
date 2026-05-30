import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

export async function GET() {
  const testimonials = await prisma.testimonial.findMany({
    where: { visible: true },
    orderBy: { createdAt: 'desc' },
  })
  return Response.json(testimonials)
}

export async function POST(request: NextRequest) {
  const session = await getSession()
  if (!session.isLoggedIn) {
    return Response.json({ error: 'No autorizado' }, { status: 401 })
  }

  const data = await request.json()
  const testimonial = await prisma.testimonial.create({ data })
  return Response.json(testimonial)
}
