'use client'
import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { askKamal, getSuggestions } from '@/lib/api'
import { speak, stopSpeaking } from '@/lib/voice'
import { useVoiceInput } from '@/lib/useVoiceInput'

interface Message { role: 'user' | 'kamal'; text: string }

export default function AskTab({ active }: { active: boolean }) {
  const [messages, setMessages] = useState<Message[]>([{
    role: 'kamal',
    text: "Namaste! I'm Kamal's AI assistant. Ask me anything about his projects, skills, or journey.",
  }])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [voiceOn, setVoiceOn] = useState(true)
  const bottomRef = useRef<HTMLDivElement>(null)
  const { supported: micSupported, listening, start, stop } = useVoiceInput(text => setInput(text))

  useEffect(() => {
    getSuggestions().then(d => setSuggestions(d.questions)).catch(() => {})
  }, [])

  useEffect(() => {
    if (active) bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading, active])

  const send = async (q?: string) => {
    const question = (q || input).trim()
    if (!question || loading) return
    setInput('')
    setMessages(m => [...m, { role: 'user', text: question }])
    setLoading(true)
    try {
      const data = await askKamal(question)
      setMessages(m => [...m, { role: 'kamal', text: data.answer }])
      if (voiceOn) speak(data.answer)
    } catch {
      setMessages(m => [...m, { role: 'kamal', text: 'Sorry, having trouble connecting. Please try again.' }])
    }
    setLoading(false)
  }

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() }
  }

  return (
    <div style={{ display: active ? 'flex' : 'none', flexDirection: 'column', height: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '8px 12px 0', flexShrink: 0 }}>
        <button
          onClick={() => { setVoiceOn(v => !v); if (voiceOn) stopSpeaking() }}
          aria-label={voiceOn ? 'Mute voice replies' : 'Enable voice replies'}
          aria-pressed={voiceOn}
          style={{
            width: 28, height: 28, borderRadius: 8,
            border: `1px solid ${voiceOn ? 'rgba(0,229,255,0.4)' : '#1A2235'}`,
            background: voiceOn ? 'rgba(0,229,255,0.08)' : 'transparent',
            color: voiceOn ? '#00E5FF' : '#8892B0', fontSize: 13,
          }}
        >
          {voiceOn ? '🔊' : '🔇'}
        </button>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '10px 16px', display: 'flex', flexDirection: 'column', gap: 12, minHeight: 0 }}>
        {messages.map((m, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
            <div style={{
              maxWidth: '85%', padding: '11px 15px',
              borderRadius: m.role === 'user' ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
              background: m.role === 'user' ? 'rgba(0,229,255,0.1)' : 'rgba(26,34,53,0.8)',
              border: `1px solid ${m.role === 'user' ? 'rgba(0,229,255,0.25)' : 'rgba(26,34,53,0.6)'}`,
              fontFamily: 'var(--font-body)', fontSize: '0.88rem',
              color: m.role === 'user' ? '#00E5FF' : '#F5F5F5', lineHeight: 1.6,
            }}>
              {m.text}
            </div>
          </motion.div>
        ))}
        {loading && (
          <div style={{ display: 'flex', gap: 5, padding: '11px 15px', background: 'rgba(26,34,53,0.8)', borderRadius: '14px 14px 14px 4px', width: 'fit-content' }}>
            {[0, 1, 2].map(i => (
              <div key={i} style={{ width: 7, height: 7, borderRadius: '50%', background: '#00E5FF', animation: 'bounce 1.2s infinite', animationDelay: `${i * 0.2}s` }} />
            ))}
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {messages.length <= 1 && suggestions.length > 0 && (
        <div style={{ padding: '0 16px 10px', display: 'flex', flexWrap: 'wrap', gap: 6, flexShrink: 0 }}>
          {suggestions.slice(0, 4).map(s => (
            <button key={s} onClick={() => send(s)} style={{
              padding: '5px 12px', background: 'rgba(0,229,255,0.05)',
              border: '1px solid rgba(0,229,255,0.18)', borderRadius: 99,
              fontFamily: 'var(--jb)', fontSize: 11, color: '#8892B0',
            }}>
              {s}
            </button>
          ))}
        </div>
      )}

      <div style={{ padding: '10px 14px', borderTop: '1px solid #1A2235', display: 'flex', gap: 8, alignItems: 'center', flexShrink: 0 }}>
        {micSupported && (
          <button
            onClick={listening ? stop : start}
            aria-label={listening ? 'Stop voice input' : 'Ask by voice'}
            aria-pressed={listening}
            style={{
              width: 38, height: 38, borderRadius: 10, flexShrink: 0,
              border: `1px solid ${listening ? '#FF4444' : '#1A2235'}`,
              background: listening ? 'rgba(255,68,68,0.12)' : 'transparent',
              color: listening ? '#FF4444' : '#8892B0', fontSize: 15,
            }}
          >
            {listening ? '⏹' : '🎤'}
          </button>
        )}
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKey}
          placeholder={listening ? 'Listening…' : 'Ask anything about Kamal...'}
          aria-label="Ask a question about Kamal"
          style={{
            flex: 1, minWidth: 0, padding: '10px 14px',
            background: '#090E1A', border: '1px solid #1A2235', borderRadius: 10,
            fontFamily: 'var(--jb)', fontSize: 13, color: '#F5F5F5', outline: 'none',
          }}
        />
        <button onClick={() => send()} disabled={!input.trim() || loading} aria-label="Send question"
          style={{
            width: 38, height: 38, borderRadius: 10, flexShrink: 0,
            background: input.trim() && !loading ? '#00E5FF' : '#1A2235',
            border: 'none', color: '#090E1A', fontSize: 16,
          }}>
          ↑
        </button>
      </div>
    </div>
  )
}
