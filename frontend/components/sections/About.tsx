'use client'
import { motion } from 'framer-motion'

const LANGS = [
  { flag: '🇬🇧', name: 'English', level: 'Professional', color: '#7B61FF' },
  { flag: '🇮🇳', name: 'Hindi',   level: 'Native',       color: '#8892B0' },
  { flag: '🇮🇳', name: 'Odia',    level: 'Native',       color: '#8892B0' },
  { flag: '🇩🇪', name: 'German',  level: 'A2',           color: '#8892B0' },
  { flag: '🇮🇹', name: 'Italian', level: 'Elementary',   color: '#8892B0' },
]

const CERTS = [
  { icon: '☁️',  name: 'AWS Cloud Practitioner', year: '2025', color: '#FF9900' },
  { icon: '🤖', name: 'MIMIC-IV CITI Certified', year: '2025', color: '#00E5FF' },
]

const HIGHLIGHTS = [
  { label: '8',    sub: 'Business Systems' },
  { label: '2021', sub: 'Building Since' },
  { label: '7',    sub: 'AI/ML Projects' },
]

export default function About() {
  return (
    <section id="about" className="snap-sec" style={{ padding: '80px 24px 24px' }}>
      <div className="about-grid" style={{ maxWidth: 1000, width: '100%', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'center' }}>

        {/* LEFT — Bio */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
        >
          <p style={{ fontFamily: 'var(--jb)', color: '#7B61FF', fontSize: 12, letterSpacing: '0.2em', marginBottom: 10 }}>— ABOUT —</p>
          <h2 style={{ fontFamily: 'var(--sg)', fontWeight: 700, fontSize: '2.5rem', color: '#F5F5F5', lineHeight: 1.1, marginBottom: 20 }}>
            Who is<br /><span style={{ color: '#00E5FF' }}>Kamal</span>?
          </h2>

          <p style={{ fontFamily: 'var(--font-body)', fontSize: '1rem', color: 'rgba(245,245,245,0.7)', lineHeight: 1.8, marginBottom: 16 }}>
            I&apos;m a self-taught full-stack and ML engineer from Odisha, India. Since 2021 I&apos;ve learned by building: business management systems, AI-powered platforms and automation workflows.
          </p>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '1rem', color: 'rgba(245,245,245,0.7)', lineHeight: 1.8, marginBottom: 20 }}>
            I start with your workflow, not with technology: where does manual work slow you down, what breaks, what repeats? Then I design a system around it and automate the rest. I work remotely with clients in any time zone, with clear written updates and milestone-based delivery.
          </p>

          {/* Highlights */}
          <div className="about-highlights-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
            {HIGHLIGHTS.map(h => (
              <div key={h.label} style={{ textAlign: 'center', padding: '12px 8px', background: '#0F1624', borderRadius: 10, border: '1px solid #1A2235' }}>
                <div style={{ fontFamily: 'var(--sg)', fontWeight: 700, fontSize: '1.4rem', color: '#00E5FF' }}>{h.label}</div>
                <div style={{ fontFamily: 'var(--jb)', fontSize: 11, color: '#8892B0', marginTop: 2 }}>{h.sub}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* RIGHT — Certs + Languages */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          style={{ display: 'flex', flexDirection: 'column', gap: 24 }}
        >
          {/* Certifications */}
          <div>
            <p style={{ fontFamily: 'var(--jb)', fontSize: 12, color: '#8892B0', marginBottom: 12, letterSpacing: '0.1em' }}>CERTIFICATIONS</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {CERTS.map(c => (
                <div key={c.name} style={{
                  display: 'flex', alignItems: 'center', gap: 14,
                  padding: '12px 16px', background: '#0F1624',
                  border: `1px solid ${c.color}33`, borderRadius: 12,
                }}>
                  <span style={{ fontSize: 24 }}>{c.icon}</span>
                  <div>
                    <p style={{ fontFamily: 'var(--sg)', fontWeight: 600, fontSize: '0.9rem', color: '#F5F5F5' }}>{c.name}</p>
                    <p style={{ fontFamily: 'var(--jb)', fontSize: 11, color: c.color }}>{c.year}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Languages */}
          <div>
            <p style={{ fontFamily: 'var(--jb)', fontSize: 12, color: '#8892B0', marginBottom: 12, letterSpacing: '0.1em' }}>LANGUAGES</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {LANGS.map(l => (
                <div key={l.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 14px', background: '#0F1624', borderRadius: 8, border: '1px solid #1A2235' }}>
                  <span style={{ fontFamily: 'var(--sg)', fontSize: '0.9rem', color: '#F5F5F5' }}>{l.flag} {l.name}</span>
                  <span style={{ fontFamily: 'var(--jb)', fontSize: 11, color: l.color, fontWeight: 700 }}>{l.level}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Location */}
          <div style={{ padding: '14px 16px', background: 'rgba(0,229,255,0.04)', border: '1px solid rgba(0,229,255,0.15)', borderRadius: 12 }}>
            <p style={{ fontFamily: 'var(--jb)', fontSize: 13, color: '#F5F5F5' }}>
              📍 Berhampur, Odisha, India
            </p>
            <p style={{ fontFamily: 'var(--jb)', fontSize: 12, color: '#00E5FF', marginTop: 4 }}>
              → Working remotely with clients worldwide
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
