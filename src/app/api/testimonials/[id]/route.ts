import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session.isLoggedIn) {
    return Response.json({ error: 'No autorizado' }, { status: 401 })
  }

  const { id } = await params
  const data = await request.json()
  const testimonial = await prisma.testimonial.update({ where: { id }, data })
  return Response.json(testimonial)
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session.isLoggedIn) {
    return Response.json({ error: 'No autorizado' }, { status: 401 })
  }

  const { id } = await params
  await prisma.testimonial.delete({ where: { id } })
  return Response.json({ success: true })
}
