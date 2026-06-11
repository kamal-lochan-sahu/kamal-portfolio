'use client'
import { useState, useEffect, useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { motion, AnimatePresence } from 'framer-motion'
import CartoonKamal from './CartoonKamal'

interface Props { onComplete: () => void }

export default function EntryScene({ onComplete }: Props) {
  const [phase,    setPhase]    = useState(0)
  const [progress, setProgress] = useState(0)
  const [text,     setText]     = useState('')
  const [showText, setShowText] = useState(false)
  const [done,     setDone]     = useState(false)
  const rafRef = useRef(0)
  const startRef = useRef(0)

  const PHASE_DURATIONS = [900, 1200, 800] // ms per phase

  useEffect(() => {
    let currentPhase = 0
    let phaseStart = Date.now()

    const tick = () => {
      const now = Date.now()
      const elapsed = now - phaseStart
      const dur = PHASE_DURATIONS[currentPhase]
      const prog = Math.min(elapsed / dur, 1)

      setPhase(currentPhase)
      setProgress(prog)

      if (currentPhase === 1 && prog > 0.3 && !showText) {
        setShowText(true)
        setText('Namaste! 🙏')
        setTimeout(() => setText("I'm Kamal Lochan Sahu"), 900)
        setTimeout(() => setText('AI & Robotics Engineer'), 1800)
      }

      if (prog >= 1) {
        currentPhase++
        phaseStart = Date.now()
        if (currentPhase >= PHASE_DURATIONS.length) {
          setDone(true)
          setTimeout(onComplete, 300)
          return
        }
      }

      rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [])

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          style={{
            position: 'fixed', inset: 0, zIndex: 200,
            background: '#090E1A',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
          }}
        >
          {/* 3D Canvas */}
          <div style={{ width: '100%', height: '70vh', maxWidth: 500 }}>
            <Canvas
              camera={{ position: [0, 0.5, 3.5], fov: 45 }}
              style={{ background: 'transparent' }}
            >
              <ambientLight intensity={0.6} />
              <directionalLight position={[2, 3, 2]} intensity={1} />
              <pointLight position={[0, 2, 2]} color="#00E5FF" intensity={0.5} />
              <CartoonKamal phase={phase} progress={progress} />
            </Canvas>
          </div>

          {/* Text below avatar */}
          <div style={{ height: 80, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <AnimatePresence mode="wait">
              {showText && text && (
                <motion.p
                  key={text}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.35 }}
                  style={{
                    fontFamily: 'var(--sg)',
                    fontWeight: 700,
                    fontSize: 'clamp(1.2rem, 3vw, 1.8rem)',
                    color: text === 'Namaste! 🙏' ? '#F5F5F5' : '#00E5FF',
                    textAlign: 'center',
                    letterSpacing: '0.02em',
                  }}
                >
                  {text}
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          {/* Skip button */}
          <button
            onClick={() => { setDone(true); setTimeout(onComplete, 200) }}
            style={{
              position: 'absolute', bottom: 32, right: 32,
              padding: '8px 18px',
              background: 'transparent',
              border: '1px solid #1A2235',
              borderRadius: 8,
              fontFamily: 'var(--jb)', fontSize: 12, color: '#8892B0',
              cursor: 'pointer',
            }}
          >
            Skip →
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
