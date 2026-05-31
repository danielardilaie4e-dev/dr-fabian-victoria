'use client'

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'

interface Models3DContextType {
  visible: boolean
  toggle: () => void
}

const Models3DContext = createContext<Models3DContextType>({
  visible: true,
  toggle: () => {},
})

export function Models3DProvider({ children }: { children: ReactNode }) {
  const [visible, setVisible] = useState(true)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const stored = localStorage.getItem('models3d-visible')
    if (stored !== null) setVisible(stored === 'true')
  }, [])

  const toggle = () => {
    setVisible((prev) => {
      const next = !prev
      if (mounted) localStorage.setItem('models3d-visible', String(next))
      return next
    })
  }

  return (
    <Models3DContext.Provider value={{ visible, toggle }}>
      {children}
    </Models3DContext.Provider>
  )
}

export const useModels3D = () => useContext(Models3DContext)
