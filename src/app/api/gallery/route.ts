import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

export async function GET() {
  const images = await prisma.galleryImage.findMany({
    where: { visible: true },
    orderBy: { order: 'asc' },
  })
  return Response.json(images)
}

export async function POST(request: NextRequest) {
  const session = await getSession()
  if (!session.isLoggedIn) {
    return Response.json({ error: 'No autorizado' }, { status: 401 })
  }

  const data = await request.json()
  const image = await prisma.galleryImage.create({ data })
  return Response.json(image)
}
