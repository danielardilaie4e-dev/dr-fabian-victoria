'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent } from '@/components/ui/card'
import { Plus, Pencil, Trash2 } from 'lucide-react'

interface FAQ {
  id: string
  question: string
  answer: string
  order: number
  visible: boolean
}

const defaultForm = { question: '', answer: '', order: 0, visible: true }

export default function AdminFAQs() {
  const [items, setItems] = useState<FAQ[]>([])
  const [editing, setEditing] = useState<string | null>(null)
  const [form, setForm] = useState(defaultForm)
  const [showForm, setShowForm] = useState(false)

  const load = async () => {
    const res = await fetch('/api/faqs')
    const data = await res.json()
    if (Array.isArray(data)) setItems(data)
  }

  useEffect(() => { load() }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (editing) {
      await fetch(`/api/faqs/${editing}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
    } else {
      await fetch('/api/faqs', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
    }
    setShowForm(false); setEditing(null); setForm(defaultForm); load()
  }

  const handleEdit = (item: FAQ) => {
    setForm({ question: item.question, answer: item.answer, order: item.order, visible: item.visible })
    setEditing(item.id); setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar?')) return
    await fetch(`/api/faqs/${id}`, { method: 'DELETE' }); load()
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-serif font-bold text-[#221E1F]">Preguntas Frecuentes</h1>
        <Button onClick={() => { setShowForm(!showForm); setEditing(null); setForm(defaultForm) }}>
          <Plus className="w-4 h-4 mr-2" /> Nueva
        </Button>
      </div>

      {showForm && (
        <Card className="mb-6">
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#221E1F] mb-1">Pregunta</label>
                <Input value={form.question} onChange={(e) => setForm({ ...form, question: e.target.value })} required />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#221E1F] mb-1">Respuesta</label>
                <Textarea value={form.answer} onChange={(e) => setForm({ ...form, answer: e.target.value })} rows={4} required />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#221E1F] mb-1">Orden</label>
                  <Input type="number" value={form.order} onChange={(e) => setForm({ ...form, order: parseInt(e.target.value) || 0 })} />
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
                  <h3 className="font-semibold text-[#221E1F] text-sm mb-1">{item.question}</h3>
                  <p className="text-sm text-[#A59F90] line-clamp-2">{item.answer}</p>
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
