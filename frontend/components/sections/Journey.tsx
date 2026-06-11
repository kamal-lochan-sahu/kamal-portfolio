'use client'
import { motion } from 'framer-motion'

const MILESTONES = [
  { year: '2019', title: 'Class 10 — Top District Scorer', sub: 'Strong math foundation · 81.3%', color: '#8892B0', side: 'left' },
  { year: '2021', title: 'Class 12 — Science', sub: 'Higher Secondary · 80% · Puri, Odisha', color: '#8892B0', side: 'right' },
  { year: '2021', title: 'Self-Learning Begins', sub: 'Chose practical learning over traditional degree', color: '#00E5FF', side: 'left' },
  { year: '2023', title: 'Independent Developer', sub: 'First production systems · Open source contributions', color: '#00E5FF', side: 'right' },
  { year: '2025', title: 'AWS Cloud Practitioner', sub: 'Certified · Cloud architecture expertise', color: '#7B61FF', side: 'left' },
  { year: '2025', title: 'Freelance — 10+ Systems Delivered', sub: 'E-commerce · Healthcare · Education · Retail', color: '#7B61FF', side: 'right' },
  { year: '2025', title: 'NEXUS + CORTEX', sub: 'Industry 5.0 Robotics + Autonomous Factory AI', color: '#00E5FF', side: 'left' },
  { year: '2026', title: 'Goethe C1 German', sub: 'Portfolio complete · Applications begin', color: '#00C853', side: 'right' },
  { year: '2027', title: 'FIAE Ausbildung — Germany 🇩🇪', sub: 'IT & Robotics · Fachinformatiker Anwendungsentwicklung', color: '#00C853', side: 'left' },
]

export default function Journey() {
  return (
    <section id="journey" className="snap-sec" style={{ flexDirection: 'column', padding: '80px 24px 24px', overflow: 'hidden' }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        style={{ textAlign: 'center', marginBottom: 32 }}
      >
        <p style={{ fontFamily: 'var(--jb)', color: '#00E5FF', fontSize: 12, letterSpacing: '0.2em', marginBottom: 6 }}>— JOURNEY —</p>
        <h2 style={{ fontFamily: 'var(--sg)', fontWeight: 700, fontSize: '2.8rem', color: '#F5F5F5' }}>
          Berhampur → <span style={{ color: '#00E5FF' }}>Germany</span>
        </h2>
      </motion.div>

      <div style={{
        position: 'relative', maxWidth: 760, width: '100%', margin: '0 auto',
        maxHeight: 'calc(100vh - 240px)', overflowY: 'auto', paddingRight: 8,
      }}>
        {/* Center line */}
        <div style={{
          position: 'absolute', left: '50%', top: 0, bottom: 0,
          width: 2, background: 'linear-gradient(to bottom, transparent, #1A2235 10%, #1A2235 90%, transparent)',
          transform: 'translateX(-50%)', zIndex: 0,
        }} />

        {MILESTONES.map((m, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: m.side === 'left' ? -30 : 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: i * 0.06 }}
            viewport={{ once: true }}
            style={{
              display: 'flex',
              justifyContent: m.side === 'left' ? 'flex-end' : 'flex-start',
              paddingLeft:  m.side === 'right' ? '52%' : 0,
              paddingRight: m.side === 'left'  ? '52%' : 0,
              marginBottom: 16,
              position: 'relative', zIndex: 1,
            }}
          >
            {/* Dot */}
            <div style={{
              position: 'absolute', left: '50%', top: '50%',
              transform: 'translate(-50%, -50%)',
              width: 12, height: 12, borderRadius: '50%',
              background: m.color,
              boxShadow: `0 0 8px ${m.color}`,
              zIndex: 2,
            }} />

            <div style={{
              background: '#0F1624',
              border: `1px solid ${m.color}33`,
              borderRadius: 12,
              padding: '12px 16px',
              maxWidth: 280,
            }}>
              <span style={{ fontFamily: 'var(--jb)', fontSize: 11, color: m.color, fontWeight: 700 }}>{m.year}</span>
              <p style={{ fontFamily: 'var(--sg)', fontWeight: 600, fontSize: '0.9rem', color: '#F5F5F5', margin: '3px 0' }}>{m.title}</p>
              <p style={{ fontFamily: 'var(--jb)', fontSize: 11, color: '#8892B0', lineHeight: 1.4 }}>{m.sub}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
