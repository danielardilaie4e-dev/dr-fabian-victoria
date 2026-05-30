import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

export async function POST(request: NextRequest) {
  const data = await request.json()
  const inquiry = await prisma.contactInquiry.create({ data })
  return Response.json({ success: true, id: inquiry.id })
}

export async function GET() {
  const session = await getSession()
  if (!session.isLoggedIn) {
    return Response.json({ error: 'No autorizado' }, { status: 401 })
  }

  const inquiries = await prisma.contactInquiry.findMany({
    orderBy: { createdAt: 'desc' },
  })
  return Response.json(inquiries)
}
