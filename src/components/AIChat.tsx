'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, X, Send, Bot, User, Loader2 } from 'lucide-react'

interface Message {
  role: 'user' | 'bot'
  text: string
}

export function AIChat() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    { role: 'bot', text: '¡Hola! Soy el asistente virtual del Dr. Fabian Victoria. Puedo ayudarte con información sobre procedimientos, valoraciones y resolver tus dudas. ¿En qué puedo ayudarte?' },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [streamingText, setStreamingText] = useState('')
  const [streamingTarget, setStreamingTarget] = useState('')
  const listRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 100)
  }, [open])

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, streamingText])

  useEffect(() => {
    if (!streamingTarget) {
      setStreamingText('')
      return
    }
    let idx = 0
    setStreamingText('')
    intervalRef.current = setInterval(() => {
      idx++
      setStreamingText(streamingTarget.slice(0, idx))
      if (idx >= streamingTarget.length) {
        if (intervalRef.current) clearInterval(intervalRef.current)
        setStreamingTarget('')
      }
    }, 20)
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [streamingTarget])

  const send = useCallback(async () => {
    const text = input.trim()
    if (!text) return

    setError('')
    setMessages((prev) => [...prev, { role: 'user', text }])
    setInput('')
    setLoading(true)

    try {
      const controller = new AbortController()
      const timeout = setTimeout(() => controller.abort(), 15000)

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text }),
        signal: controller.signal,
      })
      clearTimeout(timeout)

      if (!res.ok) {
        throw new Error(`Error ${res.status}`)
      }

      const data = await res.json()
      const responseText = data.response || 'Lo siento, no pude procesar tu consulta. Por favor escríbenos al WhatsApp +57 320 911 5240.'
      setMessages((prev) => [...prev, { role: 'bot', text: responseText }])
      setStreamingTarget(responseText)
    } catch (err) {
      const errMsg = err instanceof Error && err.name === 'AbortError'
        ? 'La respuesta está tardando mucho. Por favor intenta de nuevo o escríbenos al WhatsApp +57 320 911 5240.'
        : 'Ocurrió un error al conectar. Por favor intenta de nuevo o contáctanos por WhatsApp +57 320 911 5240.'
      setMessages((prev) => [...prev, { role: 'bot', text: errMsg }])
      setStreamingTarget(errMsg)
    }
    setLoading(false)
  }, [input])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      send()
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-24 right-6 z-50 w-14 h-14 rounded-full bg-secondary text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center justify-center"
        aria-label="Chat con IA"
      >
        {open ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-40 right-6 z-50 w-80 sm:w-96 h-[500px] rounded-2xl border border-card-border bg-card shadow-2xl flex flex-col overflow-hidden"
          >
            <div className="bg-secondary px-4 py-3 flex items-center gap-3 shrink-0">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">Dr. Fabian Victoria</p>
                <p className="text-xs text-white/70">Asistente virtual con IA</p>
              </div>
            </div>

            <div ref={listRef} className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg, i) => {
                const isStreaming = streamingTarget && i === messages.length - 1 && msg.role === 'bot'
                const display = isStreaming ? streamingText : msg.text
                const isComplete = !isStreaming || streamingText === msg.text

                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className={`flex gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                  >
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
                      msg.role === 'user' ? 'bg-secondary/20' : 'bg-surface'
                    }`}>
                      {msg.role === 'user' ? (
                        <User className="w-3.5 h-3.5 text-secondary" />
                      ) : (
                        <Bot className="w-3.5 h-3.5 text-muted" />
                      )}
                    </div>
                    <div className={`max-w-[80%] rounded-xl px-3 py-2 text-sm ${
                      msg.role === 'user'
                        ? 'bg-secondary text-white rounded-tr-sm'
                        : 'bg-surface text-foreground rounded-tl-sm'
                    }`}>
                      {display}
                      {!isComplete && (
                        <span className="inline-block w-0.5 h-4 bg-secondary/60 ml-0.5 animate-pulse align-middle" />
                      )}
                    </div>
                  </motion.div>
                )
              })}
              {loading && (
                <div className="flex gap-2">
                  <div className="w-7 h-7 rounded-full bg-surface flex items-center justify-center shrink-0">
                    <Bot className="w-3.5 h-3.5 text-muted" />
                  </div>
                  <div className="bg-surface rounded-xl rounded-tl-sm px-4 py-2 flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin text-secondary" />
                    <span className="text-xs text-muted">Escribiendo respuesta...</span>
                  </div>
                </div>
              )}
            </div>

            <div className="border-t border-card-border p-3 flex gap-2 shrink-0">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Escribe tu pregunta..."
                className="flex-1 bg-surface text-foreground rounded-xl px-3 py-2 text-sm border border-card-border outline-none focus:ring-1 focus:ring-secondary/30 placeholder:text-muted"
                disabled={loading}
              />
              <button
                onClick={send}
                disabled={!input.trim() || loading}
                className="w-9 h-9 rounded-xl bg-secondary text-white flex items-center justify-center shrink-0 disabled:opacity-40 transition-opacity"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
