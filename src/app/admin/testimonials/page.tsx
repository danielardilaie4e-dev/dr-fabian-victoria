'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent } from '@/components/ui/card'
import { Plus, Pencil, Trash2, Star } from 'lucide-react'

interface Testimonial {
  id: string
  text: string
  author: string | null
  procedure: string | null
  visible: boolean
}

const defaultForm = { text: '', author: '', procedure: '', visible: true }

export default function AdminTestimonials() {
  const [items, setItems] = useState<Testimonial[]>([])
  const [editing, setEditing] = useState<string | null>(null)
  const [form, setForm] = useState(defaultForm)
  const [showForm, setShowForm] = useState(false)

  const load = async () => {
    const res = await fetch('/api/testimonials')
    const data = await res.json()
    if (Array.isArray(data)) setItems(data)
  }

  useEffect(() => { load() }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (editing) {
      await fetch(`/api/testimonials/${editing}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
    } else {
      await fetch('/api/testimonials', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
    }
    setShowForm(false)
    setEditing(null)
    setForm(defaultForm)
    load()
  }

  const handleEdit = (item: Testimonial) => {
    setForm({ text: item.text, author: item.author || '', procedure: item.procedure || '', visible: item.visible })
    setEditing(item.id)
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar?')) return
    await fetch(`/api/testimonials/${id}`, { method: 'DELETE' })
    load()
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-serif font-bold text-[#221E1F]">Testimonios</h1>
        <Button onClick={() => { setShowForm(!showForm); setEditing(null); setForm(defaultForm) }}>
          <Plus className="w-4 h-4 mr-2" /> Nuevo
        </Button>
      </div>

      {showForm && (
        <Card className="mb-6">
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#221E1F] mb-1">Testimonio</label>
                <Textarea value={form.text} onChange={(e) => setForm({ ...form, text: e.target.value })} rows={3} required />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#221E1F] mb-1">Autor</label>
                  <Input value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#221E1F] mb-1">Procedimiento</label>
                  <Input value={form.procedure} onChange={(e) => setForm({ ...form, procedure: e.target.value })} />
                </div>
              </div>
              <div className="flex gap-2">
                <Button type="submit">{editing ? 'Guardar' : 'Crear'}</Button>
                <Button type="button" variant="ghost" onClick={() => { setShowForm(false); setEditing(null) }}>Cancelar</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="space-y-3">
        {items.map((item) => (
          <Card key={item.id}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex gap-1 mb-2">
                    {[...Array(5)].map((_, j) => <Star key={j} className="w-3 h-3 text-[#AA8D57] fill-[#AA8D57]" />)}
                  </div>
                  <p className="text-sm text-[#221E1F] mb-1">&ldquo;{item.text}&rdquo;</p>
                  <p className="text-xs text-[#A59F90]">
                    {item.author && <span className="font-medium">{item.author}</span>}
                    {item.author && item.procedure && <span> · </span>}
                    {item.procedure && <span>{item.procedure}</span>}
                  </p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <Button variant="ghost" size="sm" onClick={() => handleEdit(item)}><Pencil className="w-4 h-4" /></Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(item.id)}><Trash2 className="w-4 h-4 text-red-500" /></Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
