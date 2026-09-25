'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { sendBrief } from '@/lib/api'
import { EMAIL, GITHUB, LINKEDIN, WHATSAPP } from '@/lib/constants'

const LINKS = [
  { label: 'LinkedIn',   href: LINKEDIN,                              icon: '💼', color: '#0A66C2' },
  { label: 'GitHub',     href: GITHUB,                                icon: '⚙️', color: '#F5F5F5' },
  { label: 'Kaggle',     href: 'https://kaggle.com/kamallochansahu', icon: '📊', color: '#20BEFF' },
  { label: 'HuggingFace',href: 'https://huggingface.co/kamal-lochan',icon: '🤗', color: '#FFD21E' },
]

const field: React.CSSProperties = {
  width: '100%', padding: '12px 14px', background: '#0F1624', border: '1px solid #1A2235',
  borderRadius: 10, color: '#F5F5F5', fontFamily: 'var(--font-body)', fontSize: 14, outline: 'none',
}

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '', website: '' })
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const [err, setErr] = useState('')
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }))

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('sending'); setErr('')
    try {
      await sendBrief(form)
      setStatus('sent')
    } catch {
      setErr('Could not send from here. Use the email button below instead.')
      setStatus('error')
    }
  }
  const subject = encodeURIComponent('Project enquiry for Kamal')
  const body    = encodeURIComponent(
    'Hi Kamal,\n\nI came across your portfolio and would like to discuss a project.\n\nBest regards,'
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
            Have a manual process<br />
            <span style={{ color: '#00E5FF' }}>eating your time?</span>
          </h2>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '1rem', color: 'rgba(245,245,245,0.6)', lineHeight: 1.7, maxWidth: 480, margin: '0 auto 28px' }}>
            Describe it, and I&apos;ll help figure out the right system or automation for it. I reply personally, usually within 24 hours.
          </p>

          {status === 'sent' ? (
            <p role="status" style={{ fontFamily: 'var(--sg)', color: '#00C853', fontSize: '1.05rem', marginBottom: 32 }}>
              Got it. I&apos;ll reply personally, usually within 24 hours.
            </p>
          ) : (
            <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 12, textAlign: 'left', marginBottom: 28 }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 12 }}>
                <input required aria-label="Your name" placeholder="Your name" maxLength={100} value={form.name} onChange={set('name')} style={field} />
                <input required type="email" aria-label="Your email" placeholder="Your email" maxLength={200} value={form.email} onChange={set('email')} style={field} />
              </div>
              <textarea required aria-label="What is eating your time" placeholder="What process is eating your time?"
                minLength={10} maxLength={2000} rows={4} value={form.message} onChange={set('message')} style={{ ...field, resize: 'vertical' }} />
              {/* honeypot: hidden from real users */}
              <input tabIndex={-1} autoComplete="off" aria-hidden value={form.website} onChange={set('website')}
                style={{ position: 'absolute', left: -9999, opacity: 0, height: 0 }} />
              <button type="submit" disabled={status === 'sending'}
                style={{ padding: '14px 0', background: '#00E5FF', color: '#090E1A', border: 'none', borderRadius: 12,
                  fontFamily: 'var(--sg)', fontWeight: 700, fontSize: '1rem', opacity: status === 'sending' ? 0.6 : 1 }}>
                {status === 'sending' ? 'Sending…' : 'Send brief'}
              </button>
              {status === 'error' && <p role="alert" style={{ color: '#FFA500', fontSize: 13 }}>{err}</p>}
            </form>
          )}
          <p style={{ fontFamily: 'var(--jb)', fontSize: 12, color: '#8892B0', marginBottom: 16 }}>or email directly</p>

          {/* Smart email CTA + WhatsApp */}
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 14, marginBottom: 16 }}>
            <motion.a
              href={mailHref}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 10,
                padding: '12px 32px',
                background: '#00E5FF',
                color: '#090E1A',
                fontFamily: 'var(--sg)', fontWeight: 700, fontSize: '1.05rem',
                borderRadius: 14, textDecoration: 'none',
                boxShadow: '0 0 0 0 rgba(0,229,255,0)',
                transition: 'box-shadow 0.3s',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = '0 0 40px rgba(0,229,255,0.4)' }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = '0 0 0 0 rgba(0,229,255,0)' }}
            >
              ✉️  Email Me
            </motion.a>

            <motion.a
              href={WHATSAPP}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 10,
                padding: '12px 32px',
                background: 'rgba(37,211,102,0.12)',
                border: '1px solid rgba(37,211,102,0.4)',
                color: '#25D366',
                fontFamily: 'var(--sg)', fontWeight: 700, fontSize: '1.05rem',
                borderRadius: 14, textDecoration: 'none',
                boxShadow: '0 0 0 0 rgba(37,211,102,0)',
                transition: 'box-shadow 0.3s',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = '0 0 40px rgba(37,211,102,0.3)' }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = '0 0 0 0 rgba(37,211,102,0)' }}
            >
              💬  WhatsApp Me
            </motion.a>
          </div>

          <p style={{ fontFamily: 'var(--jb)', fontSize: 13, color: '#8892B0', marginBottom: 24 }}>
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
          <p style={{ fontFamily: 'var(--jb)', fontSize: 11, color: '#8892B0', marginTop: 48 }}>
            Built with Next.js · Framer Motion · FastAPI · Gemini AI
          </p>
        </motion.div>
      </div>
    </section>
  )
}
