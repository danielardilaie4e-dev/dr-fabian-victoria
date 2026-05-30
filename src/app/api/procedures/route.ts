import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

export async function GET() {
  const procedures = await prisma.procedure.findMany({
    where: { visible: true },
    orderBy: { order: 'asc' },
  })
  return Response.json(procedures)
}

export async function POST(request: NextRequest) {
  const session = await getSession()
  if (!session.isLoggedIn) {
    return Response.json({ error: 'No autorizado' }, { status: 401 })
  }

  const data = await request.json()
  const procedure = await prisma.procedure.create({ data })
  return Response.json(procedure)
}
