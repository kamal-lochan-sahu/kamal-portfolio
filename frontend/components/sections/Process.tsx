'use client'
import { motion } from 'framer-motion'
import { PROCESS } from '@/lib/constants'

export default function Process() {
  return (
    <section id="process" className="snap-sec" style={{ flexDirection: 'column', padding: '80px 24px 48px' }}>
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }} viewport={{ once: true }}
        style={{ textAlign: 'center', marginBottom: 32 }}>
        <p style={{ fontFamily: 'var(--jb)', color: '#7B61FF', fontSize: 12, letterSpacing: '0.2em', marginBottom: 8 }}>— HOW I WORK —</p>
        <h2 style={{ fontFamily: 'var(--sg)', fontWeight: 700, fontSize: 'clamp(2rem,4vw,2.8rem)', color: '#F5F5F5' }}>
          From problem to <span style={{ color: '#00E5FF' }}>working system</span>
        </h2>
      </motion.div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 16, maxWidth: 1000, width: '100%' }}>
        {PROCESS.map((s, i) => (
          <motion.div key={s.n} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }} viewport={{ once: true }}
            style={{ background: '#0F1624', border: '1px solid #1A2235', borderRadius: 16, padding: 20 }}>
            <span style={{ fontFamily: 'var(--jb)', fontSize: 12, color: '#7B61FF', fontWeight: 700 }}>{s.n}</span>
            <h3 style={{ fontFamily: 'var(--sg)', fontWeight: 600, fontSize: '1rem', color: '#F5F5F5', margin: '8px 0' }}>{s.title}</h3>
            <p style={{ fontSize: 13, lineHeight: 1.6, color: '#8892B0' }}>{s.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
