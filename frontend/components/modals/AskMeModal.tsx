
'use client'
import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { askKamal, getSuggestions } from '@/lib/api'
import { speak, stopSpeaking } from '@/lib/voice'

interface Props { open: boolean; onClose: () => void }
interface Message { role: 'user' | 'kamal'; text: string }

export default function AskMeModal({ open, onClose }: Props) {
  const [messages,    setMessages]    = useState<Message[]>([])
  const [input,       setInput]       = useState('')
  const [loading,     setLoading]     = useState(false)
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [voiceOn,     setVoiceOn]     = useState(true)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (open && suggestions.length === 0) {
      getSuggestions().then(d => setSuggestions(d.questions)).catch(() => {})
      setMessages([{
        role: 'kamal',
        text: "Namaste! I'm Kamal's AI assistant. Ask me anything about his projects, skills, or journey.",
      }])
    }
    if (!open) stopSpeaking()
  }, [open])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

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
      setMessages(m => [...m, { role: 'kamal', text: "Sorry, having trouble connecting. Please try again." }])
    }
    setLoading(false)
  }

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() }
  }

  if (!open) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
        style={{
          position:'fixed', inset:0, zIndex:100,
          background:'rgba(9,14,26,0.88)', backdropFilter:'blur(10px)',
          display:'flex', alignItems:'center', justifyContent:'center', padding:24,
        }}
      >
        <motion.div
          initial={{ opacity:0, scale:0.93, y:20 }}
          animate={{ opacity:1, scale:1,    y:0  }}
          exit={{ opacity:0,    scale:0.93, y:20 }}
          transition={{ duration:0.25, type:'spring', stiffness:300 }}
          onClick={e => e.stopPropagation()}
          style={{
            width:'100%', maxWidth:680, height:'80vh', maxHeight:620,
            background:'rgba(15,22,36,0.97)',
            border:'1px solid rgba(0,229,255,0.2)',
            borderRadius:20, display:'flex', flexDirection:'column',
            overflow:'hidden',
            boxShadow:'0 0 80px rgba(0,229,255,0.08), 0 24px 64px rgba(0,0,0,0.6)',
          }}
        >
          {/* Header */}
          <div style={{
            display:'flex', alignItems:'center', justifyContent:'space-between',
            padding:'16px 20px', borderBottom:'1px solid #1A2235', flexShrink:0,
          }}>
            <div style={{ display:'flex', alignItems:'center', gap:10 }}>
              <span style={{ fontSize:22 }}>🤖</span>
              <div>
                <p style={{ fontFamily:'var(--sg)', fontWeight:700, fontSize:'1rem', color:'#F5F5F5' }}>
                  Ask Me About Kamal
                </p>
                <p style={{ fontFamily:'var(--jb)', fontSize:11, color:'#00E5FF' }}>
                  Powered by Gemini 2.5 Flash
                </p>
              </div>
            </div>
            <div style={{ display:'flex', alignItems:'center', gap:8 }}>
              {/* Voice toggle */}
              <button
                onClick={() => { setVoiceOn(v => !v); if (voiceOn) stopSpeaking() }}
                title={voiceOn ? 'Mute voice' : 'Enable voice'}
                style={{
                  width:32, height:32, borderRadius:8,
                  border:`1px solid ${voiceOn ? 'rgba(0,229,255,0.4)' : '#1A2235'}`,
                  background: voiceOn ? 'rgba(0,229,255,0.08)' : 'transparent',
                  color: voiceOn ? '#00E5FF' : '#8892B0',
                  cursor:'none', fontSize:14,
                  display:'flex', alignItems:'center', justifyContent:'center',
                }}
              >
                {voiceOn ? '🔊' : '🔇'}
              </button>
              <button onClick={onClose} style={{
                width:32, height:32, borderRadius:'50%',
                border:'1px solid #1A2235', background:'transparent',
                color:'#8892B0', cursor:'none', fontSize:16,
                display:'flex', alignItems:'center', justifyContent:'center',
              }}>✕</button>
            </div>
          </div>

          {/* Messages */}
          <div style={{
            flex:1, overflowY:'auto', padding:'16px 20px',
            display:'flex', flexDirection:'column', gap:12,
          }}>
            {messages.map((m,i) => (
              <motion.div key={i}
                initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }}
                transition={{ duration:0.2 }}
                style={{ display:'flex', justifyContent:m.role==='user'?'flex-end':'flex-start' }}
              >
                <div style={{
                  maxWidth:'82%', padding:'11px 15px',
                  borderRadius: m.role==='user' ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
                  background: m.role==='user' ? 'rgba(0,229,255,0.1)' : 'rgba(26,34,53,0.8)',
                  border:`1px solid ${m.role==='user' ? 'rgba(0,229,255,0.25)' : 'rgba(26,34,53,0.6)'}`,
                  fontFamily:'var(--body)', fontSize:'0.9rem',
                  color: m.role==='user' ? '#00E5FF' : '#F5F5F5', lineHeight:1.65,
                }}>
                  {m.text}
                </div>
              </motion.div>
            ))}

            {loading && (
              <div style={{
                display:'flex', gap:5, padding:'11px 15px',
                background:'rgba(26,34,53,0.8)', borderRadius:'14px 14px 14px 4px',
                width:'fit-content',
              }}>
                {[0,1,2].map(i => (
                  <div key={i} style={{
                    width:7, height:7, borderRadius:'50%', background:'#00E5FF',
                    animation:'bounce 1.2s infinite', animationDelay:`${i*0.2}s`,
                  }}/>
                ))}
              </div>
            )}
            <div ref={bottomRef}/>
          </div>

          {/* Suggestions */}
          {messages.length <= 1 && suggestions.length > 0 && (
            <div style={{ padding:'0 20px 12px', display:'flex', flexWrap:'wrap', gap:6 }}>
              {suggestions.slice(0, 5).map(s => (
                <button key={s} onClick={() => send(s)} style={{
                  padding:'5px 12px',
                  background:'rgba(0,229,255,0.05)',
                  border:'1px solid rgba(0,229,255,0.18)',
                  borderRadius:99, cursor:'none',
                  fontFamily:'var(--jb)', fontSize:11, color:'#8892B0',
                }}>
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div style={{
            padding:'12px 16px', borderTop:'1px solid #1A2235',
            display:'flex', gap:10, alignItems:'center', flexShrink:0,
          }}>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Ask anything about Kamal..."
              autoFocus
              style={{
                flex:1, padding:'10px 14px',
                background:'#090E1A', border:'1px solid #1A2235', borderRadius:10,
                fontFamily:'var(--jb)', fontSize:13, color:'#F5F5F5', outline:'none',
              }}
            />
            <button onClick={() => send()} disabled={!input.trim()||loading}
              style={{
                width:42, height:42, borderRadius:10,
                background: input.trim()&&!loading ? '#00E5FF' : '#1A2235',
                border:'none', cursor:'none', color:'#090E1A', fontSize:18,
                display:'flex', alignItems:'center', justifyContent:'center',
                transition:'all 0.2s',
              }}>
              ↑
            </button>
          </div>
        </motion.div>
        <style>{`@keyframes bounce{0%,80%,100%{transform:scale(0)}40%{transform:scale(1)}}`}</style>
      </motion.div>
    </AnimatePresence>
  )
}
