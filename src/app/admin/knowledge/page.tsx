'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent } from '@/components/ui/card'
import { Plus, Pencil, Trash2, BookOpen } from 'lucide-react'

interface Doc {
  id: string
  title: string
  content: string
  category: string | null
  createdAt: string
}

const defaultForm = { title: '', content: '', category: '' }

export default function AdminKnowledge() {
  const [items, setItems] = useState<Doc[]>([])
  const [editing, setEditing] = useState<string | null>(null)
  const [form, setForm] = useState(defaultForm)
  const [showForm, setShowForm] = useState(false)

  const load = async () => {
    const res = await fetch('/api/knowledge')
    const data = await res.json()
    if (Array.isArray(data)) setItems(data)
  }

  useEffect(() => { load() }, [])

  const save = async () => {
    if (!form.title.trim() || !form.content.trim()) return

    if (editing) {
      await fetch(`/api/knowledge/${editing}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
    } else {
      await fetch('/api/knowledge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
    }

    setForm(defaultForm)
    setEditing(null)
    setShowForm(false)
    load()
  }

  const edit = (doc: Doc) => {
    setForm({ title: doc.title, content: doc.content, category: doc.category || '' })
    setEditing(doc.id)
    setShowForm(true)
  }

  const remove = async (id: string) => {
    if (!confirm('¿Eliminar este documento?')) return
    await fetch(`/api/knowledge/${id}`, { method: 'DELETE' })
    load()
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Base de Conocimiento</h1>
          <p className="text-sm text-neutral mt-1">
            Documentos científicos que alimentan el asistente IA
          </p>
        </div>
        <Button onClick={() => { setShowForm(!showForm); setEditing(null); setForm(defaultForm) }}>
          <Plus className="w-4 h-4 mr-2" />
          Nuevo documento
        </Button>
      </div>

      {showForm && (
        <Card className="mb-8">
          <CardContent className="p-6 space-y-4">
            <Input
              placeholder="Título del documento"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="bg-card border-card-border text-foreground placeholder:text-muted"
            />
            <Input
              placeholder="Categoría (opcional, ej: cuidados preoperatorios)"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="bg-card border-card-border text-foreground placeholder:text-muted"
            />
            <div>
              <p className="text-xs text-muted mb-1">
                Contenido del documento — la IA usará esta información para responder preguntas
              </p>
              <Textarea
                placeholder="Escribe o pega el contenido aquí..."
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
                rows={12}
                className="bg-card border-card-border text-foreground placeholder:text-muted font-mono text-sm"
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={save}>{editing ? 'Actualizar' : 'Guardar'}</Button>
              <Button variant="ghost" onClick={() => { setShowForm(false); setForm(defaultForm); setEditing(null) }}>
                Cancelar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="space-y-3">
        {items.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <BookOpen className="w-8 h-8 text-muted mx-auto mb-3" />
              <p className="text-muted text-sm">
                No hay documentos. Agrega contenido científico para que la IA pueda responder con información precisa.
              </p>
            </CardContent>
          </Card>
        ) : (
          items.map((doc) => (
            <Card key={doc.id}>
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-foreground">{doc.title}</h3>
                      {doc.category && (
                        <span className="text-xs bg-secondary/10 text-secondary px-2 py-0.5 rounded-full">
                          {doc.category}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-neutral line-clamp-3 whitespace-pre-line">{doc.content}</p>
                    <p className="text-xs text-muted mt-2">
                      {new Date(doc.createdAt).toLocaleDateString('es-CO')}
                    </p>
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <Button variant="ghost" size="sm" onClick={() => edit(doc)}>
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => remove(doc.id)}>
                      <Trash2 className="w-4 h-4 text-red-400" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
