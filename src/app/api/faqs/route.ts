import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

export async function GET() {
  const faqs = await prisma.fAQ.findMany({
    where: { visible: true },
    orderBy: { order: 'asc' },
  })
  return Response.json(faqs)
}

export async function POST(request: NextRequest) {
  const session = await getSession()
  if (!session.isLoggedIn) {
    return Response.json({ error: 'No autorizado' }, { status: 401 })
  }

  const data = await request.json()
  const faq = await prisma.fAQ.create({ data })
  return Response.json(faq)
}
