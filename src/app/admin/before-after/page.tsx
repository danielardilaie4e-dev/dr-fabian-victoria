'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent } from '@/components/ui/card'
import { Plus, Trash2 } from 'lucide-react'

interface BeforeAfter {
  id: string
  title: string
  beforeUrl: string
  afterUrl: string
  procedure: string | null
  description: string | null
  visible: boolean
  order: number
}

const defaultForm = { title: '', beforeUrl: '', afterUrl: '', procedure: '', description: '' }

export default function AdminBeforeAfter() {
  const [items, setItems] = useState<BeforeAfter[]>([])
  const [form, setForm] = useState(defaultForm)
  const [showForm, setShowForm] = useState(false)

  const load = async () => {
    const res = await fetch('/api/before-after')
    const data = await res.json()
    if (Array.isArray(data)) setItems(data)
  }

  useEffect(() => { load() }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await fetch('/api/before-after', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, visible: true, order: Date.now() }),
    })
    setShowForm(false)
    setForm(defaultForm)
    load()
  }

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar este registro?')) return
    await fetch(`/api/before-after/${id}`, { method: 'DELETE' })
    load()
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-serif font-bold text-foreground">Antes y Despu&eacute;s</h1>
        <Button onClick={() => { setShowForm(!showForm); setForm(defaultForm) }}>
          <Plus className="w-4 h-4 mr-2" /> Subir Antes/Despu&eacute;s
        </Button>
      </div>

      {showForm && (
        <Card className="mb-6">
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">T&iacute;tulo</label>
                <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Procedimiento</label>
                <Input value={form.procedure} onChange={(e) => setForm({ ...form, procedure: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Descripci&oacute;n</label>
                <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">URL Imagen Antes</label>
                <Input value={form.beforeUrl} onChange={(e) => setForm({ ...form, beforeUrl: e.target.value })} required />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">URL Imagen Despu&eacute;s</label>
                <Input value={form.afterUrl} onChange={(e) => setForm({ ...form, afterUrl: e.target.value })} required />
              </div>
              <div className="flex gap-2">
                <Button type="submit">Crear</Button>
                <Button type="button" variant="ghost" onClick={() => { setShowForm(false) }}>Cancelar</Button>
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
                  <h3 className="font-semibold text-foreground text-sm mb-1">{item.title}</h3>
                  {item.procedure && <p className="text-xs text-neutral mb-1">{item.procedure}</p>}
                  {item.description && <p className="text-sm text-neutral line-clamp-2">{item.description}</p>}
                  <div className="flex gap-2 mt-2">
                    <img src={item.beforeUrl} alt="Before" className="w-20 h-14 object-cover rounded" />
                    <img src={item.afterUrl} alt="After" className="w-20 h-14 object-cover rounded" />
                  </div>
                </div>
                <Button variant="ghost" size="sm" onClick={() => handleDelete(item.id)}>
                  <Trash2 className="w-4 h-4 text-red-500" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
