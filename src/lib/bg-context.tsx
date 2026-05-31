'use client'

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'

interface BgContextType {
  animated: boolean
  toggle: () => void
}

const BgContext = createContext<BgContextType>({
  animated: true,
  toggle: () => {},
})

export function BgProvider({ children }: { children: ReactNode }) {
  const [animated, setAnimated] = useState(true)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const stored = localStorage.getItem('bg-animated')
    if (stored !== null) setAnimated(stored === 'true')
  }, [])

  useEffect(() => {
    if (mounted) localStorage.setItem('bg-animated', String(animated))
  }, [animated, mounted])

  const toggle = () => setAnimated((v) => !v)

  return <BgContext.Provider value={{ animated, toggle }}>{children}</BgContext.Provider>
}

export const useBg = () => useContext(BgContext)
