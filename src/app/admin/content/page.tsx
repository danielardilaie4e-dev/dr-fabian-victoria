'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent } from '@/components/ui/card'

interface ContentItem {
  id: string
  section: string
  key: string
  value: string
}

export default function AdminContent() {
  const [items, setItems] = useState<ContentItem[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState<string | null>(null)

  const load = async () => {
    const res = await fetch('/api/content')
    const data = await res.json()
    if (Array.isArray(data)) setItems(data)
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const handleSave = async (id: string, value: string) => {
    setSaving(id)
    await fetch(`/api/content/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ value }),
    })
    setSaving(null)
  }

  const grouped = items.reduce<Record<string, ContentItem[]>>((acc, item) => {
    if (!acc[item.section]) acc[item.section] = []
    acc[item.section].push(item)
    return acc
  }, {})

  if (loading) {
    return <div className="flex items-center justify-center py-12"><div className="w-8 h-8 border-2 border-[#AA8D57] border-t-transparent rounded-full animate-spin" /></div>
  }

  return (
    <div>
      <h1 className="text-2xl font-serif font-bold text-[#221E1F] mb-6">Contenido del Sitio</h1>

      {Object.entries(grouped).map(([section, contentItems]) => (
        <Card key={section} className="mb-6">
          <CardContent className="p-6">
            <h2 className="font-semibold text-[#221E1F] capitalize mb-4">{section.replace('_', ' ')}</h2>
            <div className="space-y-4">
              {contentItems.map((item) => (
                <div key={item.id}>
                  <label className="block text-sm font-medium text-[#A59F90] mb-1 capitalize">{item.key.replace('_', ' ')}</label>
                  <div className="flex gap-2">
                    <Textarea
                      defaultValue={item.value}
                      rows={item.key.includes('text') || item.key === 'body' ? 4 : 2}
                      className="flex-1"
                      id={item.id}
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      className="shrink-0 self-end"
                      onClick={() => {
                        const el = document.getElementById(item.id) as HTMLTextAreaElement
                        if (el) handleSave(item.id, el.value)
                      }}
                      disabled={saving === item.id}
                    >
                      {saving === item.id ? '...' : 'Guardar'}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
