'use client'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import SVGRobot from '@/components/avatar/SVGRobot'
import { useModalA11y } from '@/lib/useModalA11y'
import AskTab from './AskTab'
import MatchTab from './MatchTab'
import BriefTab from './BriefTab'

type Tab = 'ask' | 'match' | 'brief'

const TABS: { key: Tab; label: string; icon: string }[] = [
  { key: 'ask',   label: 'Ask Me',   icon: '💬' },
  { key: 'match', label: 'Match JD', icon: '📋' },
  { key: 'brief', label: 'Brief',    icon: '✉️' },
]

/**
 * Persistent bottom-right AI dock: a docked panel (side panel on desktop,
 * bottom sheet on mobile) with Ask / Match / Brief tabs. Every tab stays
 * mounted while the dock exists, so chat history and JD results survive
 * closing the panel, switching tabs, or scrolling the page.
 */
export default function AIDock() {
  const [open, setOpen] = useState(false)
  const [tab, setTab] = useState<Tab>('ask')
  const panelRef = useModalA11y<HTMLDivElement>(open, () => setOpen(false))

  // Hero's "Tell me your problem" CTA opens the dock straight to Ask Me.
  useEffect(() => {
    const onOpenAsk = () => { setTab('ask'); setOpen(true) }
    window.addEventListener('open-ask-ai', onOpenAsk)
    return () => window.removeEventListener('open-ask-ai', onOpenAsk)
  }, [])

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label="Kamal's AI assistant"
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ duration: 0.22, type: 'spring', stiffness: 320 }}
            className="ai-dock-panel"
            style={{
              position: 'fixed', zIndex: 90,
              background: 'rgba(15,22,36,0.98)', backdropFilter: 'blur(16px)',
              border: '1px solid rgba(0,229,255,0.2)', borderRadius: 20,
              boxShadow: '0 24px 64px rgba(0,0,0,0.6), 0 0 60px rgba(0,229,255,0.06)',
              display: 'flex', flexDirection: 'column', overflow: 'hidden',
            }}
          >
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '12px 14px', borderBottom: '1px solid #1A2235', flexShrink: 0, gap: 8,
            }}>
              <div style={{ display: 'flex', gap: 6, overflowX: 'auto' }}>
                {TABS.map(t => (
                  <button
                    key={t.key}
                    onClick={() => setTab(t.key)}
                    aria-current={tab === t.key ? 'true' : undefined}
                    style={{
                      padding: '7px 11px', borderRadius: 9, whiteSpace: 'nowrap', flexShrink: 0,
                      border: `1px solid ${tab === t.key ? 'rgba(0,229,255,0.4)' : '#1A2235'}`,
                      background: tab === t.key ? 'rgba(0,229,255,0.1)' : 'transparent',
                      color: tab === t.key ? '#00E5FF' : '#8892B0',
                      fontFamily: 'var(--jb)', fontSize: 12,
                    }}
                  >
                    {t.icon} {t.label}
                  </button>
                ))}
              </div>
              <button onClick={() => setOpen(false)} aria-label="Close AI assistant" style={{
                width: 30, height: 30, borderRadius: '50%', flexShrink: 0,
                border: '1px solid #1A2235', background: 'transparent', color: '#8892B0', fontSize: 15,
              }}>
                ✕
              </button>
            </div>

            <div style={{ flex: 1, minHeight: 0 }}>
              <AskTab   active={tab === 'ask'} />
              <MatchTab active={tab === 'match'} />
              <BriefTab active={tab === 'brief'} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={() => setOpen(o => !o)}
        aria-label={open ? 'Close AI assistant' : 'Open AI assistant — ask about Kamal or share a job description'}
        aria-expanded={open}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.96 }}
        style={{
          position: 'fixed', bottom: 20, right: 20, zIndex: 91,
          width: 80, height: 80, borderRadius: '50%', overflow: 'hidden',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'rgba(9,14,26,0.95)',
          border: `2px solid ${open ? '#00E5FF' : 'rgba(0,229,255,0.3)'}`,
          boxShadow: open
            ? '0 0 32px rgba(0,229,255,0.45), 0 0 64px rgba(0,229,255,0.15)'
            : '0 0 16px rgba(0,229,255,0.12)',
          transition: 'border-color 0.3s, box-shadow 0.3s',
        }}
      >
        <SVGRobot emotion={open ? 'excited' : 'idle'} size={72} showFull={false} />
      </motion.button>
    </>
  )
}
