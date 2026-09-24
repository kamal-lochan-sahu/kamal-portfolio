'use client'
import { motion } from 'framer-motion'
import { SERVICES } from '@/lib/constants'

export default function Services() {
  return (
    <section id="services" className="snap-sec" style={{ flexDirection: 'column', padding: '80px 24px 48px' }}>
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }} viewport={{ once: true }}
        style={{ textAlign: 'center', marginBottom: 32 }}>
        <p style={{ fontFamily: 'var(--jb)', color: '#00E5FF', fontSize: 12, letterSpacing: '0.2em', marginBottom: 8 }}>— SERVICES —</p>
        <h2 style={{ fontFamily: 'var(--sg)', fontWeight: 700, fontSize: 'clamp(2rem,4vw,2.8rem)', color: '#F5F5F5' }}>
          What I can <span style={{ color: '#00E5FF' }}>build for you</span>
        </h2>
      </motion.div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: 18, maxWidth: 1000, width: '100%' }}>
        {SERVICES.map((s, i) => (
          <motion.div key={s.title} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }} viewport={{ once: true }}
            style={{ background: '#0F1624', border: '1px solid #1A2235', borderRadius: 18, padding: 24, display: 'flex', flexDirection: 'column', gap: 12 }}>
            <span style={{ fontSize: 28 }} aria-hidden>{s.icon}</span>
            <h3 style={{ fontFamily: 'var(--sg)', fontWeight: 700, fontSize: '1.15rem', color: '#F5F5F5' }}>{s.title}</h3>
            <p style={{ fontSize: 14, lineHeight: 1.6, color: 'rgba(245,245,245,0.6)' }}>{s.desc}</p>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 6, marginTop: 'auto' }}>
              {s.points.map(pt => (
                <li key={pt} style={{ fontFamily: 'var(--jb)', fontSize: 12, color: '#8892B0' }}>
                  <span style={{ color: '#00E5FF' }}>›</span> {pt}
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>

      <button onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
        style={{ marginTop: 32, padding: '12px 28px', background: 'rgba(0,229,255,0.1)', border: '1px solid rgba(0,229,255,0.3)',
          borderRadius: 12, color: '#00E5FF', fontFamily: 'var(--sg)', fontWeight: 600, fontSize: 14 }}>
        Tell me your problem →
      </button>
    </section>
  )
}
