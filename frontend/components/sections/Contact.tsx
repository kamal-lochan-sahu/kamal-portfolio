'use client'
import { motion } from 'framer-motion'
import { EMAIL, GITHUB, LINKEDIN } from '@/lib/constants'

const LINKS = [
  { label: 'LinkedIn',   href: LINKEDIN,                              icon: '💼', color: '#0A66C2' },
  { label: 'GitHub',     href: GITHUB,                                icon: '⚙️', color: '#F5F5F5' },
  { label: 'Kaggle',     href: 'https://kaggle.com/kamallochansahu', icon: '📊', color: '#20BEFF' },
  { label: 'HuggingFace',href: 'https://huggingface.co/kamal-lochan',icon: '🤗', color: '#FFD21E' },
]

export default function Contact() {
  const subject = encodeURIComponent('Opportunity for Kamal Lochan Sahu')
  const body    = encodeURIComponent(
    'Hi Kamal,\n\nI came across your portfolio and I am interested in discussing an opportunity with you.\n\nBest regards,'
  )
  const mailHref = `mailto:${EMAIL}?subject=${subject}&body=${body}`

  return (
    <section id="contact" className="snap-sec" style={{ flexDirection: 'column', padding: '80px 24px' }}>
      <div style={{ maxWidth: 680, width: '100%', textAlign: 'center' }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
        >
          <p style={{ fontFamily: 'var(--jb)', color: '#7B61FF', fontSize: 12, letterSpacing: '0.2em', marginBottom: 12 }}>— CONTACT —</p>
          <h2 style={{ fontFamily: 'var(--sg)', fontWeight: 700, fontSize: 'clamp(2rem, 4vw, 3rem)', color: '#F5F5F5', lineHeight: 1.1, marginBottom: 16 }}>
            Let&apos;s Build<br />
            <span style={{ color: '#00E5FF' }}>Something</span>
          </h2>
          <p style={{ fontFamily: 'var(--body)', fontSize: '1rem', color: 'rgba(245,245,245,0.6)', lineHeight: 1.7, marginBottom: 36, maxWidth: 480, margin: '0 auto 36px' }}>
            Open to FIAE Ausbildung, freelance projects, and full-time roles.
            Based in Berhampur, India — relocating to Germany 2027.
          </p>

          {/* Smart email CTA */}
          <motion.a
            href={mailHref}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 10,
              padding: '16px 40px',
              background: '#00E5FF',
              color: '#090E1A',
              fontFamily: 'var(--sg)', fontWeight: 700, fontSize: '1.05rem',
              borderRadius: 14, textDecoration: 'none',
              boxShadow: '0 0 0 0 rgba(0,229,255,0)',
              transition: 'box-shadow 0.3s',
              marginBottom: 40,
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = '0 0 40px rgba(0,229,255,0.4)' }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = '0 0 0 0 rgba(0,229,255,0)' }}
          >
            ✉️  Hire Me — Send Email
          </motion.a>

          <p style={{ fontFamily: 'var(--jb)', fontSize: 13, color: '#8892B0', marginBottom: 32 }}>
            {EMAIL}
          </p>

          {/* Social links */}
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            {LINKS.map(l => (
              <motion.a
                key={l.label}
                href={l.href}
                target="_blank"
                rel="noreferrer"
                whileHover={{ y: -2 }}
                style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  padding: '10px 20px',
                  background: '#0F1624',
                  border: '1px solid #1A2235',
                  borderRadius: 10,
                  fontFamily: 'var(--jb)', fontSize: 13,
                  color: '#8892B0', textDecoration: 'none',
                  transition: 'border-color 0.2s, color 0.2s',
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.borderColor = l.color
                  ;(e.currentTarget as HTMLElement).style.color = l.color
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.borderColor = '#1A2235'
                  ;(e.currentTarget as HTMLElement).style.color = '#8892B0'
                }}
              >
                {l.icon} {l.label}
              </motion.a>
            ))}
          </div>

          {/* Footer */}
          <p style={{ fontFamily: 'var(--jb)', fontSize: 11, color: '#1A2235', marginTop: 48 }}>
            Built with Next.js · Framer Motion · Three.js · FastAPI
          </p>
        </motion.div>
      </div>
    </section>
  )
}
