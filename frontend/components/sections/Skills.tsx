'use client'
import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { SKILLS } from '@/lib/constants'

const FLAT = Object.entries(SKILLS).flatMap(([cat, list]) =>
  list.map(name => ({ name, cat }))
)

const CAT_COLOR: Record<string, string> = {
  'AI / ML':   '#00E5FF',
  'Robotics':  '#7B61FF',
  'Backend':   '#00E5FF',
  'Frontend':  '#7B61FF',
  'Cloud':     '#00C853',
  'Languages': '#8892B0',
}

interface Chip {
  x: number; y: number; vx: number; vy: number;
  w: number; h: number; name: string; cat: string;
}

export default function Skills() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouse     = useRef({ x: -999, y: -999 })
  const chips     = useRef<Chip[]>([])
  const raf       = useRef(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => {
      canvas.width  = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
      initChips()
    }

    const initChips = () => {
      const W = canvas.width
      const H = canvas.height
      chips.current = FLAT.map(s => {
        ctx.font = '13px JetBrains Mono, monospace'
        const tw = ctx.measureText(s.name).width
        const w  = tw + 32
        const h  = 34
        return {
          name: s.name, cat: s.cat,
          x: Math.random() * (W - w) + w / 2,
          y: Math.random() * (H - h) + h / 2,
          vx: (Math.random() - 0.5) * 1.2,
          vy: (Math.random() - 0.5) * 1.2,
          w, h,
        }
      })
    }

    const draw = () => {
      const W = canvas.width
      const H = canvas.height
      ctx.clearRect(0, 0, W, H)

      chips.current.forEach(c => {
        // Mouse repulsion
        const dx   = c.x - mouse.current.x
        const dy   = c.y - mouse.current.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < 130 && dist > 0) {
          const force = (130 - dist) / 130 * 0.4
          c.vx += (dx / dist) * force
          c.vy += (dy / dist) * force
        }

        // Friction
        c.vx *= 0.985
        c.vy *= 0.985

        // Speed cap
        const speed = Math.sqrt(c.vx * c.vx + c.vy * c.vy)
        if (speed > 3) { c.vx = c.vx / speed * 3; c.vy = c.vy / speed * 3 }
        if (speed < 0.3 && dist > 130) {
          c.vx += (Math.random() - 0.5) * 0.05
          c.vy += (Math.random() - 0.5) * 0.05
        }

        c.x += c.vx; c.y += c.vy

        // Bounce off walls
        if (c.x - c.w/2 < 8)   { c.x = c.w/2 + 8;   c.vx = Math.abs(c.vx) }
        if (c.x + c.w/2 > W-8) { c.x = W - c.w/2-8; c.vx = -Math.abs(c.vx) }
        if (c.y - c.h/2 < 8)   { c.y = c.h/2 + 8;   c.vy = Math.abs(c.vy) }
        if (c.y + c.h/2 > H-8) { c.y = H - c.h/2-8; c.vy = -Math.abs(c.vy) }

        const color  = CAT_COLOR[c.cat] || '#8892B0'
        const hex33  = color + '33'
        const hex66  = color + '55'
        const x = c.x - c.w / 2
        const y = c.y - c.h / 2
        const r = c.h / 2

        // Chip background
        ctx.beginPath()
        ctx.roundRect(x, y, c.w, c.h, r)
        ctx.fillStyle = '#0F1624'
        ctx.fill()

        // Chip border
        ctx.strokeStyle = hex66
        ctx.lineWidth   = 1
        ctx.stroke()

        // Glow
        ctx.shadowBlur  = 8
        ctx.shadowColor = hex33
        ctx.stroke()
        ctx.shadowBlur  = 0

        // Text
        ctx.font      = '13px "JetBrains Mono", monospace'
        ctx.fillStyle = color
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText(c.name, c.x, c.y)
      })

      raf.current = requestAnimationFrame(draw)
    }

    const onMove = (e: MouseEvent) => {
      const r = canvas.getBoundingClientRect()
      mouse.current = { x: e.clientX - r.left, y: e.clientY - r.top }
    }
    const onLeave = () => { mouse.current = { x: -999, y: -999 } }

    resize()
    draw()
    canvas.addEventListener('mousemove', onMove)
    canvas.addEventListener('mouseleave', onLeave)
    window.addEventListener('resize', resize)

    return () => {
      cancelAnimationFrame(raf.current)
      canvas.removeEventListener('mousemove', onMove)
      canvas.removeEventListener('mouseleave', onLeave)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <section id="skills" className="snap-sec" style={{ flexDirection: 'column', padding: '80px 0 24px' }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        style={{ textAlign: 'center', marginBottom: 16, zIndex: 10, position: 'relative' }}
      >
        <p style={{ fontFamily: 'var(--jb)', color: '#00E5FF', fontSize: 12, letterSpacing: '0.2em', marginBottom: 6 }}>— SKILLS —</p>
        <h2 style={{ fontFamily: 'var(--sg)', fontWeight: 700, fontSize: '2.8rem', color: '#F5F5F5', marginBottom: 6 }}>Skill Wall</h2>
        <p style={{ fontFamily: 'var(--jb)', fontSize: 12, color: '#8892B0' }}>Hover to repel · 29 technologies</p>
      </motion.div>

      <canvas
        ref={canvasRef}
        style={{ width: '100%', flex: 1, minHeight: 0, display: 'block' }}
      />

      {/* Legend */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'center', padding: '12px 24px', zIndex: 10 }}>
        {Object.entries(CAT_COLOR).map(([cat, color]) => (
          <div key={cat} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: color }} />
            <span style={{ fontFamily: 'var(--jb)', fontSize: 11, color: '#8892B0' }}>{cat}</span>
          </div>
        ))}
      </div>
    </section>
  )
}
