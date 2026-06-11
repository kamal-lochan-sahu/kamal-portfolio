'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { SECTIONS } from '@/lib/constants'

export default function Navbar() {
  const [active, setActive] = useState('hero')
  const [lang,   setLang]   = useState<'EN' | 'DE'>('EN')
  const [sound,  setSound]  = useState(false)

  useEffect(() => {
    const wrap = document.querySelector('.snap-wrap')
    if (!wrap) return
    const handler = () => {
      const mid = window.innerHeight / 2
      SECTIONS.forEach(s => {
        const el = document.getElementById(s.id)
        if (!el) return
        const r = el.getBoundingClientRect()
        if (r.top <= mid && r.bottom >= mid) setActive(s.id)
      })
    }
    wrap.addEventListener('scroll', handler)
    return () => wrap.removeEventListener('scroll', handler)
  }, [])

  const scrollTo = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '14px 28px',
    }}>
      {/* Backdrop */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'rgba(9,14,26,0.7)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(26,34,53,0.6)',
        pointerEvents: 'none',
      }} />

      {/* Logo */}
      <motion.button
        initial={{ opacity: 0, x: -16 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={() => scrollTo('hero')}
        style={{
          position: 'relative', zIndex: 1,
          fontFamily: 'var(--sg)', fontWeight: 700, fontSize: 17,
          color: '#F5F5F5', background: 'none', border: 'none', cursor: 'pointer',
        }}
      >
        <span style={{ color: '#00E5FF' }}>K</span>amal
        <span style={{ fontFamily: 'var(--jb)', color: '#8892B0', fontSize: 11, marginLeft: 6 }}>.dev</span>
      </motion.button>

      {/* Section dots */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', gap: 10 }}
      >
        {SECTIONS.map(s => (
          <button
            key={s.id}
            onClick={() => scrollTo(s.id)}
            title={s.label}
            style={{
              borderRadius: 999,
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.3s',
              width:  active === s.id ? 28 : 8,
              height: 8,
              background: active === s.id ? '#00E5FF' : '#1A2235',
              boxShadow: active === s.id ? '0 0 8px #00E5FF' : 'none',
              padding: 0,
            }}
          />
        ))}
      </motion.div>

      {/* Controls */}
      <motion.div
        initial={{ opacity: 0, x: 16 }}
        animate={{ opacity: 1, x: 0 }}
        style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', gap: 8 }}
      >
        <button
          onClick={() => setLang(l => l === 'EN' ? 'DE' : 'EN')}
          style={{
            padding: '6px 12px',
            fontFamily: 'var(--jb)', fontSize: 11,
            border: '1px solid #1A2235', borderRadius: 8,
            color: '#8892B0', background: 'transparent', cursor: 'pointer',
            transition: 'all 0.2s',
          }}
        >
          {lang === 'EN' ? '🇬🇧 EN' : '🇩🇪 DE'}
        </button>
        <button
          onClick={() => setSound(s => !s)}
          style={{
            width: 34, height: 34, fontSize: 14,
            border: '1px solid #1A2235', borderRadius: 8,
            color: '#8892B0', background: 'transparent', cursor: 'pointer',
          }}
        >
          {sound ? '🔊' : '🔇'}
        </button>
      </motion.div>
    </nav>
  )
}
