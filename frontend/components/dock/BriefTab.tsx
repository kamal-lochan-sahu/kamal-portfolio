'use client'
import { useState } from 'react'
import { sendBrief } from '@/lib/api'
import { EMAIL, WHATSAPP } from '@/lib/constants'

const field: React.CSSProperties = {
  width: '100%', padding: '11px 13px', background: '#090E1A', border: '1px solid #1A2235',
  borderRadius: 10, color: '#F5F5F5', fontFamily: 'var(--font-body)', fontSize: 13.5, outline: 'none',
  boxSizing: 'border-box',
}

export default function BriefTab({ active }: { active: boolean }) {
  const [form, setForm] = useState({ name: '', email: '', message: '', website: '' })
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }))

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('sending')
    try {
      await sendBrief(form)
      setStatus('sent')
    } catch {
      setStatus('error')
    }
  }

  return (
    <div style={{ display: active ? 'flex' : 'none', flexDirection: 'column', height: '100%', padding: 16, overflowY: 'auto' }}>
      <p style={{ fontFamily: 'var(--jb)', fontSize: 13, color: '#8892B0', marginBottom: 14 }}>
        Quick version of the contact form — describe your problem, Kamal replies personally.
      </p>

      {status === 'sent' ? (
        <p role="status" style={{ fontFamily: 'var(--sg)', color: '#00C853', fontSize: '0.95rem' }}>
          Got it — I&apos;ll reply within 24 hours.
        </p>
      ) : (
        <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <input required aria-label="Your name" placeholder="Your name" maxLength={100} value={form.name} onChange={set('name')} style={field} />
          <input required type="email" aria-label="Your email" placeholder="Your email" maxLength={200} value={form.email} onChange={set('email')} style={field} />
          <textarea required aria-label="What is eating your time" placeholder="What process is eating your time?"
            minLength={10} maxLength={2000} rows={3} value={form.message} onChange={set('message')} style={{ ...field, resize: 'vertical' }} />
          <input tabIndex={-1} autoComplete="off" aria-hidden value={form.website} onChange={set('website')}
            style={{ position: 'absolute', left: -9999, opacity: 0, height: 0 }} />
          <button type="submit" disabled={status === 'sending'} style={{
            padding: '12px 0', background: '#00E5FF', color: '#090E1A', border: 'none', borderRadius: 10,
            fontFamily: 'var(--sg)', fontWeight: 700, fontSize: '0.95rem', opacity: status === 'sending' ? 0.6 : 1,
          }}>
            {status === 'sending' ? 'Sending…' : 'Send brief'}
          </button>
          {status === 'error' && (
            <p role="alert" style={{ color: '#FFA500', fontSize: 12 }}>
              Could not send from here — email <a href={`mailto:${EMAIL}`} style={{ color: '#00E5FF' }}>{EMAIL}</a> or{' '}
              <a href={WHATSAPP} target="_blank" rel="noopener noreferrer" style={{ color: '#25D366' }}>WhatsApp</a> instead.
            </p>
          )}
        </form>
      )}
    </div>
  )
}
