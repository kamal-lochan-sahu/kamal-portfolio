
'use client'
import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import SVGRobot from './SVGRobot'

interface Props { onComplete: () => void }

const LINES = [
  { text: '> KAMAL.AI — SYSTEM BOOT v2.5', delay: 200,  color: '#8892B0' },
  { text: '> Loading AI modules...',        delay: 800,  color: '#8892B0' },
  { text: '> Neural Engine:    ONLINE ✓',  delay: 1400, color: '#00C853' },
  { text: '> Robotics Core:    ONLINE ✓',  delay: 1900, color: '#00C853' },
  { text: '> Portfolio:        READY  ✓',  delay: 2400, color: '#00E5FF' },
]

const NAME = 'KAMAL LOCHAN SAHU'.split('')

export default function EntryAnimation({ onComplete }: Props) {
  const [lines,       setLines]       = useState<number[]>([])
  const [showName,    setShowName]    = useState(false)
  const [letters,     setLetters]     = useState<number>(0)
  const [showSub,     setShowSub]     = useState(false)
  const [showRobot,   setShowRobot]   = useState(false)
  const [emotion,     setEmotion]     = useState<'idle'|'namaste'>('idle')
  const [done,        setDone]        = useState(false)
  const [scanLine,    setScanLine]    = useState(false)

  useEffect(() => {
    // Terminal lines
    LINES.forEach((l, i) => {
      setTimeout(() => setLines(prev => [...prev, i]), l.delay)
    })
    // Progress bar + name
    setTimeout(() => setScanLine(true),  2800)
    setTimeout(() => setShowName(true),  3200)
    // Letters drop in
    let letterCount = 0
    const letterInt = setInterval(() => {
      letterCount++
      setLetters(letterCount)
      if (letterCount >= NAME.length) clearInterval(letterInt)
    }, 60)
    setTimeout(() => {}, 3200)
    // Subtitle
    setTimeout(() => setShowSub(true),   5000)
    // Robot
    setTimeout(() => setShowRobot(true), 5600)
    setTimeout(() => setEmotion('namaste'), 6000)
    setTimeout(() => setEmotion('idle'),    7200)
    // Done
    setTimeout(() => { setDone(true); setTimeout(onComplete, 500) }, 8000)

    return () => clearInterval(letterInt)
  }, [])

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          style={{
            position: 'fixed', inset: 0, zIndex: 200,
            background: '#090E1A',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            overflow: 'hidden',
          }}
        >
          {/* Grid background */}
          <div style={{
            position: 'absolute', inset: 0, opacity: 0.15,
            backgroundImage: `
              linear-gradient(rgba(0,229,255,0.3) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0,229,255,0.3) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
          }}/>

          {/* Scan line */}
          {scanLine && (
            <div style={{
              position: 'absolute', left: 0, right: 0, height: 2,
              background: 'linear-gradient(90deg, transparent, #00E5FF, transparent)',
              animation: 'scanLine 1.5s ease-in-out',
              top: '0%',
            }}/>
          )}

          {/* Corner decorations */}
          {[['top:16px,left:16px','border-top,border-left'],
            ['top:16px,right:16px','border-top,border-right'],
            ['bottom:16px,left:16px','border-bottom,border-left'],
            ['bottom:16px,right:16px','border-bottom,border-right']
          ].map(([pos], i) => {
            const positions = pos.split(',').reduce((a, p) => {
              const [k,v] = p.split(':')
              return {...a, [k]: v}
            }, {} as Record<string,string>)
            const cornerStyle: React.CSSProperties = {
              position: 'absolute', width: 32, height: 32,
              borderColor: '#00E5FF55', borderStyle: 'solid',
              borderWidth: 0,
              ...positions,
            }
            if (i === 0) { cornerStyle.borderTopWidth = 2; cornerStyle.borderLeftWidth = 2 }
            if (i === 1) { cornerStyle.borderTopWidth = 2; cornerStyle.borderRightWidth = 2 }
            if (i === 2) { cornerStyle.borderBottomWidth = 2; cornerStyle.borderLeftWidth = 2 }
            if (i === 3) { cornerStyle.borderBottomWidth = 2; cornerStyle.borderRightWidth = 2 }
            return <div key={i} style={cornerStyle}/>
          })}

          <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            gap: 0, position: 'relative', zIndex: 1, width: '100%', maxWidth: 700,
            padding: '0 24px',
          }}>

            {/* Terminal lines */}
            <div style={{
              alignSelf: 'flex-start', marginBottom: 24, minHeight: 120,
              fontFamily: 'var(--jb)', fontSize: 13, lineHeight: 2.2,
            }}>
              {LINES.map((l, i) => (
                lines.includes(i) && (
                  <motion.div key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                    style={{ color: l.color }}
                  >
                    {l.text}
                    {i === lines[lines.length - 1] && lines.length < LINES.length && (
                      <span style={{ animation: 'blink 0.8s infinite', marginLeft: 4 }}>▌</span>
                    )}
                  </motion.div>
                )
              ))}
            </div>

            {/* Name */}
            {showName && (
              <div style={{
                display: 'flex', gap: 0, flexWrap: 'wrap',
                justifyContent: 'center', marginBottom: 16,
              }}>
                {NAME.map((l, i) => (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0, y: -50, scale: 1.3 }}
                    animate={i < letters ? { opacity: 1, y: 0, scale: 1 } : {}}
                    transition={{ duration: 0.25, type: 'spring', stiffness: 300 }}
                    style={{
                      fontFamily: 'var(--sg)', fontWeight: 900,
                      fontSize: 'clamp(2rem, 5vw, 3.5rem)',
                      letterSpacing: l === ' ' ? '0.5em' : '0.05em',
                      color: l === ' ' ? 'transparent' : '#F5F5F5',
                      textShadow: i < letters ? '0 0 20px rgba(0,229,255,0.4)' : 'none',
                      display: 'inline-block',
                      minWidth: l === ' ' ? '0.5em' : 'auto',
                    }}
                  >
                    {l === ' ' ? ' ' : l}
                  </motion.span>
                ))}
              </div>
            )}

            {/* Subtitle */}
            <AnimatePresence>
              {showSub && (
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{
                    fontFamily: 'var(--jb)', fontSize: 14,
                    color: '#00E5FF', letterSpacing: '0.3em',
                    textTransform: 'uppercase', marginBottom: 32,
                  }}
                >
                  AI & Robotics Engineer
                </motion.p>
              )}
            </AnimatePresence>

            {/* Robot */}
            <AnimatePresence>
              {showRobot && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.6, y: 30 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ duration: 0.6, type: 'spring', stiffness: 200 }}
                  style={{ marginTop: 8 }}
                >
                  <SVGRobot emotion={emotion} size={160} showFull={true} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Skip */}
          <button
            onClick={() => { setDone(true); setTimeout(onComplete, 300) }}
            style={{
              position: 'absolute', bottom: 28, right: 28,
              padding: '8px 16px', background: 'transparent',
              border: '1px solid #1A2235', borderRadius: 8,
              fontFamily: 'var(--jb)', fontSize: 11, color: '#8892B0',
              cursor: 'none',
            }}
          >
            Skip →
          </button>

          <style>{`
            @keyframes scanLine { 0%{top:-2px;opacity:1} 100%{top:100%;opacity:0.3} }
            @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
          `}</style>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
