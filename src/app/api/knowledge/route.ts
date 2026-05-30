import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const docs = await prisma.knowledgeDocument.findMany({
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(docs)
  } catch {
    return NextResponse.json({ error: 'Error al cargar documentos' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const { title, content, category } = await req.json()

    if (!title || !content) {
      return NextResponse.json({ error: 'Título y contenido son requeridos' }, { status: 400 })
    }

    const doc = await prisma.knowledgeDocument.create({
      data: { title, content, category: category || null },
    })

    return NextResponse.json(doc, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Error al crear documento' }, { status: 500 })
  }
}
