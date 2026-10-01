'use client'
import { useState, useEffect, useCallback } from 'react'
import { playSound } from '@/lib/sounds'
import { planTour, type TourStep } from '@/lib/api'
import { trackEvent } from '@/lib/analytics'

const QUICK_PICKS = [
  "I'm hiring for a role",
  'I need custom software built',
  'Just exploring',
]

// Used if the backend is unreachable — keeps the tour usable offline-ish,
// and mirrors backend/routers/tour.py's FALLBACK_STEPS so the two never
// drift into contradicting each other about what the site contains.
const FALLBACK_STEPS: TourStep[] = [
  { id: 'hero',     title: 'Welcome',  message: "Hey, I'm Kamal's assistant — let me show you around." },
  { id: 'services', title: 'Services', message: "Here's what Kamal builds: custom software, automation, and AI integration." },
  { id: 'projects', title: 'Projects', message: 'A mix of business systems, websites, and AI/robotics R&D.' },
  { id: 'process',  title: 'Process',  message: 'This is how a project with Kamal actually runs, start to finish.' },
  { id: 'skills',   title: 'Stack',    message: 'The tools Kamal works with day to day.' },
  { id: 'github',   title: 'GitHub',   message: 'Live activity, pulled straight from GitHub.' },
  { id: 'contact',  title: 'Contact',  message: "That's the tour — reach out here whenever you're ready." },
]

type Phase = 'closed' | 'asking' | 'loading' | 'touring'

export default function GuidedTour() {
  const [phase, setPhase] = useState<Phase>('closed')
  const [interest, setInterest] = useState('')
  const [steps, setSteps] = useState<TourStep[]>([])
  const [stepIndex, setStepIndex] = useState(0)

  const goToStep = useCallback((index: number, list: TourStep[]) => {
    const step = list[index]
    if (!step) return
    document.getElementById(step.id)?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    setStepIndex(index)
    playSound('open')
  }, [])

  const beginWith = async (chosenInterest: string) => {
    trackEvent('guided_tour_start', { interest: chosenInterest || '(unspecified)' })
    setInterest(chosenInterest)
    setPhase('loading')
    let planned: TourStep[]
    try {
      planned = (await planTour(chosenInterest)).steps
      if (!planned || planned.length < 2) planned = FALLBACK_STEPS
    } catch {
      planned = FALLBACK_STEPS
    }
    setSteps(planned)
    setPhase('touring')
    goToStep(0, planned)
  }

  const next = () => {
    if (stepIndex + 1 < steps.length) goToStep(stepIndex + 1, steps)
    else stop()
  }
  const prev = () => { if (stepIndex > 0) goToStep(stepIndex - 1, steps) }
  const stop = () => { setPhase('closed'); playSound('close') }

  useEffect(() => {
    if (phase !== 'touring') return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') stop()
      if (e.key === 'ArrowRight') next()
      if (e.key === 'ArrowLeft') prev()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, stepIndex, steps])

  const current = steps[stepIndex]

  return (
    <>
      {phase === 'closed' && (
        <button
          onClick={() => setPhase('asking')}
          style={{
            position: 'fixed', bottom: 20, left: 20, zIndex: 50,
            padding: '8px 14px', borderRadius: 20,
            background: '#0F1624', border: '1px solid #9B87FF', color: '#9B87FF',
            fontSize: 13, cursor: 'none',
          }}
        >
          ▶ Guided Tour
        </button>
      )}

      {phase === 'asking' && (
        <div style={{
          position: 'fixed', bottom: 24, left: 20, zIndex: 9998, width: 'min(320px, calc(100vw - 40px))',
          background: '#0F1624', border: '1px solid #1A2235', borderRadius: 12,
          padding: 16, boxShadow: '0 0 30px rgba(123,97,255,0.2)',
        }}>
          <p style={{ fontFamily: 'var(--sg)', color: '#00E5FF', fontWeight: 600, fontSize: 14, marginBottom: 4 }}>
            What brings you here?
          </p>
          <p style={{ color: '#8A93A6', fontSize: 12, marginBottom: 10 }}>
            I&apos;ll tailor the tour to what you&apos;re after.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 10 }}>
            {QUICK_PICKS.map(q => (
              <button key={q} onClick={() => beginWith(q)} style={{
                textAlign: 'left', padding: '8px 12px', borderRadius: 8,
                border: '1px solid #1A2235', background: 'rgba(0,229,255,0.04)',
                color: '#C7CEDB', fontSize: 13, cursor: 'none',
              }}>
                {q}
              </button>
            ))}
          </div>
          <input
            value={interest}
            onChange={e => setInterest(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && interest.trim()) beginWith(interest.trim()) }}
            placeholder="Or type your own..."
            aria-label="What brings you here"
            style={{
              width: '100%', padding: '8px 10px', marginBottom: 10, boxSizing: 'border-box',
              background: '#090E1A', border: '1px solid #1A2235', borderRadius: 8,
              color: '#F5F5F5', fontSize: 13, outline: 'none',
            }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <button onClick={() => setPhase('closed')} style={{ background: 'none', border: 'none', color: '#8A93A6', cursor: 'none', fontSize: 12 }}>
              Cancel
            </button>
            <button onClick={() => beginWith(interest.trim())} style={{
              padding: '6px 14px', borderRadius: 6, border: 'none',
              background: '#6A4CFF', color: '#fff', fontSize: 13, cursor: 'none',
            }}>
              Start tour
            </button>
          </div>
        </div>
      )}

      {phase === 'loading' && (
        <div style={{
          position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)', zIndex: 9998,
          background: '#0F1624', border: '1px solid #1A2235', borderRadius: 12,
          padding: '14px 20px', color: '#8A93A6', fontSize: 13,
        }}>
          Planning your tour…
        </div>
      )}

      {phase === 'touring' && current && (
        <div
          role="status" aria-live="polite"
          className="tour-card"
          style={{
            position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)',
            zIndex: 9998, width: 'min(420px, calc(100vw - 40px))',
            background: '#0F1624', border: '1px solid #1A2235', borderRadius: 12,
            padding: 16, boxShadow: '0 0 30px rgba(123,97,255,0.2)',
          }}
        >
          <div style={{ fontFamily: 'var(--sg)', color: '#00E5FF', fontWeight: 600, marginBottom: 4 }}>
            {current.title} <span style={{ color: '#8A93A6', fontWeight: 400, fontSize: 12 }}>({stepIndex + 1}/{steps.length})</span>
          </div>
          <div style={{ color: '#C7CEDB', fontSize: 14, marginBottom: 12 }}>{current.message}</div>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
            <button onClick={stop} style={{ background: 'none', border: 'none', color: '#8A93A6', cursor: 'none', fontSize: 13 }}>
              Exit
            </button>
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                onClick={prev}
                disabled={stepIndex === 0}
                style={{ padding: '6px 12px', borderRadius: 6, border: '1px solid #1A2235', background: 'transparent', color: '#C7CEDB', cursor: 'none', opacity: stepIndex === 0 ? 0.4 : 1 }}
              >
                Back
              </button>
              <button
                onClick={next}
                style={{ padding: '6px 12px', borderRadius: 6, border: 'none', background: '#6A4CFF', color: '#fff', cursor: 'none' }}
              >
                {stepIndex + 1 === steps.length ? 'Finish' : 'Next'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
