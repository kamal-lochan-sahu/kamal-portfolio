
'use client'
import { useRef, useState } from 'react'
import { motion } from 'framer-motion'

interface Props {
  children: React.ReactNode
  onClick?: () => void
  href?: string
  variant?: 'primary' | 'outline'
  style?: React.CSSProperties
}

export default function MagneticButton({ children, onClick, href, variant = 'primary', style }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const [pos, setPos] = useState({ x: 0, y: 0 })

  const onMove = (e: React.MouseEvent) => {
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    const x = (e.clientX - r.left - r.width  / 2) * 0.25
    const y = (e.clientY - r.top  - r.height / 2) * 0.25
    setPos({ x, y })
  }
  const onLeave = () => setPos({ x: 0, y: 0 })

  const base: React.CSSProperties = variant === 'primary' ? {
    padding: '14px 36px',
    background: '#00E5FF',
    color: '#090E1A',
    fontFamily: 'var(--sg)', fontWeight: 700, fontSize: 15,
    border: 'none', borderRadius: 14, cursor: 'none',
    boxShadow: '0 0 0 rgba(0,229,255,0)',
    transition: 'box-shadow 0.3s',
    ...style,
  } : {
    padding: '14px 36px',
    background: 'transparent',
    color: '#00E5FF',
    fontFamily: 'var(--sg)', fontWeight: 700, fontSize: 15,
    border: '2px solid #00E5FF',
    borderRadius: 14, cursor: 'none',
    ...style,
  }

  const content = (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      animate={{ x: pos.x, y: pos.y }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      whileHover={{
        boxShadow: variant === 'primary'
          ? '0 0 35px rgba(0,229,255,0.5), 0 0 70px rgba(0,229,255,0.2)'
          : '0 0 20px rgba(0,229,255,0.3)',
        scale: 1.03,
      }}
      whileTap={{ scale: 0.97 }}
      style={base}
      onClick={onClick}
    >
      {children}
    </motion.div>
  )

  return href ? <a href={href} style={{ textDecoration: 'none' }}>{content}</a> : content
}
