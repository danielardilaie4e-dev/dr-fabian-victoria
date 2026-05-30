'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Image, Trash2 } from 'lucide-react'

interface GalleryItem {
  id: string
  url: string
  category: string | null
  description: string | null
  visible: boolean
  order: number
}

export default function AdminGallery() {
  const [items, setItems] = useState<GalleryItem[]>([])

  useEffect(() => {
    fetch('/api/gallery')
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setItems(data)
      })
  }, [])

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar esta imagen?')) return
    await fetch(`/api/gallery/${id}`, { method: 'DELETE' })
    setItems(items.filter((i) => i.id !== id))
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-serif font-bold text-[#221E1F]">Galería</h1>
      </div>

      {items.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center text-neutral">
            <Image className="w-12 h-12 mx-auto mb-3 text-secondary/30" />
            <p>No hay imágenes en la galería.</p>
            <p className="text-sm mt-1">Las imágenes se pueden agregar directamente en la carpeta /public/images/</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item) => (
            <Card key={item.id}>
              <CardContent className="p-3">
                <div className="aspect-square rounded-xl bg-[#F7F3EA] flex items-center justify-center mb-2 overflow-hidden">
                  <img src={item.url} alt={item.description || ''} className="w-full h-full object-cover" />
                </div>
                {item.description && (
                  <p className="text-xs text-neutral mb-2">{item.description}</p>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-xs text-neutral">{item.category || 'Sin categoría'}</span>
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(item.id)}>
                    <Trash2 className="w-3 h-3 text-red-500" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
