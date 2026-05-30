'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent } from '@/components/ui/card'
import { Plus, Pencil, Trash2, Check, X } from 'lucide-react'

interface Procedure {
  id: string
  name: string
  category: string
  description: string
  benefits: string[]
  steps: string[]
  recoveryNotes: string | null
  expectedResult: string | null
  commercialPriority: string
  cta: string
  visible: boolean
  order: number
}

const defaultForm = {
  name: '',
  category: 'corporal',
  description: '',
  benefits: '',
  steps: '',
  recoveryNotes: '',
  expectedResult: '',
  commercialPriority: 'media',
  cta: 'Agendar valoración',
  visible: true,
  order: 0,
}

export default function AdminProcedures() {
  const [procedures, setProcedures] = useState<Procedure[]>([])
  const [editing, setEditing] = useState<string | null>(null)
  const [form, setForm] = useState(defaultForm)
  const [showForm, setShowForm] = useState(false)

  const load = async () => {
    const res = await fetch('/api/procedures')
    const data = await res.json()
    if (Array.isArray(data)) setProcedures(data)
  }

  useEffect(() => { load() }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const payload = {
      ...form,
      benefits: form.benefits.split('\n').filter(Boolean),
      steps: form.steps.split('\n').filter(Boolean),
    }

    if (editing) {
      await fetch(`/api/procedures/${editing}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
    } else {
      await fetch('/api/procedures', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
    }

    setShowForm(false)
    setEditing(null)
    setForm(defaultForm)
    load()
  }

  const handleEdit = (proc: Procedure) => {
    setForm({
      name: proc.name,
      category: proc.category,
      description: proc.description,
      benefits: proc.benefits.join('\n'),
      steps: proc.steps.join('\n'),
      recoveryNotes: proc.recoveryNotes || '',
      expectedResult: proc.expectedResult || '',
      commercialPriority: proc.commercialPriority,
      cta: proc.cta,
      visible: proc.visible,
      order: proc.order,
    })
    setEditing(proc.id)
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar este procedimiento?')) return
    await fetch(`/api/procedures/${id}`, { method: 'DELETE' })
    load()
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-serif font-bold text-[#221E1F]">Procedimientos</h1>
        <Button onClick={() => { setShowForm(!showForm); setEditing(null); setForm(defaultForm) }}>
          <Plus className="w-4 h-4 mr-2" />
          Nuevo
        </Button>
      </div>

      {showForm && (
        <Card className="mb-6">
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#221E1F] mb-1">Nombre</label>
                  <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#221E1F] mb-1">Categoría</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full rounded-xl border border-[#AA8D57]/20 bg-white px-4 py-3 text-sm"
                  >
                    <option value="consulta médica">Valoración</option>
                    <option value="corporal">Corporal</option>
                    <option value="mamaria">Mamaria</option>
                    <option value="facial">Facial</option>
                    <option value="cirugía íntima">Íntima</option>
                    <option value="reconstructiva">Reconstructiva</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#221E1F] mb-1">Descripción</label>
                <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} required />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#221E1F] mb-1">Beneficios (uno por línea)</label>
                  <Textarea value={form.benefits} onChange={(e) => setForm({ ...form, benefits: e.target.value })} rows={4} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#221E1F] mb-1">Pasos (uno por línea)</label>
                  <Textarea value={form.steps} onChange={(e) => setForm({ ...form, steps: e.target.value })} rows={4} />
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#221E1F] mb-1">Notas de recuperación</label>
                  <Textarea value={form.recoveryNotes} onChange={(e) => setForm({ ...form, recoveryNotes: e.target.value })} rows={2} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#221E1F] mb-1">Resultado esperado</label>
                  <Textarea value={form.expectedResult} onChange={(e) => setForm({ ...form, expectedResult: e.target.value })} rows={2} />
                </div>
              </div>
              <div className="grid sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#221E1F] mb-1">Prioridad</label>
                  <select
                    value={form.commercialPriority}
                    onChange={(e) => setForm({ ...form, commercialPriority: e.target.value })}
                    className="w-full rounded-xl border border-[#AA8D57]/20 bg-white px-4 py-3 text-sm"
                  >
                    <option value="alta">Alta</option>
                    <option value="media">Media</option>
                    <option value="baja">Baja</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#221E1F] mb-1">CTA</label>
                  <Input value={form.cta} onChange={(e) => setForm({ ...form, cta: e.target.value })} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#221E1F] mb-1">Orden</label>
                  <Input type="number" value={form.order} onChange={(e) => setForm({ ...form, order: parseInt(e.target.value) || 0 })} />
                </div>
              </div>
              <div className="flex gap-2">
                <Button type="submit">{editing ? 'Guardar cambios' : 'Crear procedimiento'}</Button>
                <Button type="button" variant="ghost" onClick={() => { setShowForm(false); setEditing(null) }}>Cancelar</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="space-y-3">
        {procedures.map((proc) => (
          <Card key={proc.id}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-[#221E1F]">{proc.name}</h3>
                  <p className="text-sm text-[#A59F90]">{proc.category} · {proc.cta}</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" onClick={() => handleEdit(proc)}>
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(proc.id)}>
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
