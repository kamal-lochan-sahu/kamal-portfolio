'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { matchJD } from '@/lib/api'

interface Result {
  match_score: number
  summary: string
  strengths: string[]
  gaps: string[]
  highlighted_projects: string[]
  recommendation: string
}

export default function MatchTab({ active }: { active: boolean }) {
  const [jd, setJd] = useState('')
  const [result, setResult] = useState<Result | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const analyze = async () => {
    if (!jd.trim() || loading) return
    setLoading(true); setError(''); setResult(null)
    try {
      setResult(await matchJD(jd))
    } catch {
      setError('Could not analyze. Please try again.')
    }
    setLoading(false)
  }

  const reset = () => { setJd(''); setResult(null); setError('') }
  const scoreColor = (s: number) => s >= 80 ? '#00C853' : s >= 60 ? '#00E5FF' : s >= 40 ? '#FFA500' : '#FF4444'

  return (
    <div style={{ display: active ? 'block' : 'none', height: '100%', overflowY: 'auto', padding: 16 }}>
      {!result ? (
        <>
          <p style={{ fontFamily: 'var(--jb)', fontSize: 13, color: '#8892B0', marginBottom: 12 }}>
            Paste a job description below — AI will analyze how well Kamal matches it.
          </p>
          <textarea
            value={jd}
            onChange={e => setJd(e.target.value)}
            placeholder="Paste job description here..."
            aria-label="Job description"
            style={{
              width: '100%', height: 160, padding: '12px 14px',
              background: '#090E1A', border: '1px solid #1A2235', borderRadius: 10,
              fontFamily: 'var(--jb)', fontSize: 13, color: '#F5F5F5',
              resize: 'none', outline: 'none', boxSizing: 'border-box',
            }}
          />
          {error && <p role="alert" style={{ fontFamily: 'var(--jb)', fontSize: 12, color: '#FF4444', marginTop: 8 }}>{error}</p>}
          <button onClick={analyze} disabled={!jd.trim() || loading} style={{
            width: '100%', padding: '12px 0', marginTop: 14,
            background: jd.trim() && !loading ? '#7B61FF' : '#1A2235',
            border: 'none', borderRadius: 10,
            fontFamily: 'var(--sg)', fontWeight: 700, fontSize: '0.95rem',
            color: jd.trim() && !loading ? '#F5F5F5' : '#8892B0',
          }}>
            {loading ? 'Analyzing...' : 'Analyze Match →'}
          </button>
        </>
      ) : (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ textAlign: 'center', padding: '12px 0' }}>
            <div style={{ fontSize: '3rem', fontFamily: 'var(--sg)', fontWeight: 900, color: scoreColor(result.match_score), lineHeight: 1 }}>
              {result.match_score}%
            </div>
            <p style={{ fontFamily: 'var(--jb)', fontSize: 12, color: '#8892B0', marginTop: 6 }}>Match Score</p>
          </div>

          <div style={{ padding: 14, background: '#090E1A', borderRadius: 12, border: '1px solid #1A2235' }}>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.88rem', color: 'rgba(245,245,245,0.8)', lineHeight: 1.65 }}>
              {result.summary}
            </p>
          </div>

          <div>
            <p style={{ fontFamily: 'var(--jb)', fontSize: 11, color: '#00C853', letterSpacing: '0.1em', marginBottom: 8 }}>✅ STRENGTHS</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {result.strengths.map((s, i) => (
                <div key={i} style={{ padding: '8px 12px', background: 'rgba(0,200,83,0.06)', border: '1px solid rgba(0,200,83,0.2)', borderRadius: 8, fontFamily: 'var(--font-body)', fontSize: '0.83rem', color: '#F5F5F5' }}>{s}</div>
              ))}
            </div>
          </div>

          {result.gaps.length > 0 && (
            <div>
              <p style={{ fontFamily: 'var(--jb)', fontSize: 11, color: '#FFA500', letterSpacing: '0.1em', marginBottom: 8 }}>⚡ GAPS</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {result.gaps.map((g, i) => (
                  <div key={i} style={{ padding: '8px 12px', background: 'rgba(255,165,0,0.06)', border: '1px solid rgba(255,165,0,0.2)', borderRadius: 8, fontFamily: 'var(--font-body)', fontSize: '0.83rem', color: '#F5F5F5' }}>{g}</div>
                ))}
              </div>
            </div>
          )}

          <div>
            <p style={{ fontFamily: 'var(--jb)', fontSize: 11, color: '#00E5FF', letterSpacing: '0.1em', marginBottom: 8 }}>🚀 MOST RELEVANT PROJECTS</p>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {result.highlighted_projects.map((p, i) => (
                <span key={i} style={{ padding: '6px 14px', background: 'rgba(0,229,255,0.08)', border: '1px solid rgba(0,229,255,0.3)', borderRadius: 99, fontFamily: 'var(--jb)', fontSize: 12, color: '#00E5FF' }}>{p}</span>
              ))}
            </div>
          </div>

          <div style={{ padding: 14, background: 'rgba(123,97,255,0.08)', border: '1px solid rgba(123,97,255,0.3)', borderRadius: 12 }}>
            <p style={{ fontFamily: 'var(--jb)', fontSize: 11, color: '#7B61FF', marginBottom: 6 }}>RECOMMENDATION</p>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.88rem', color: '#F5F5F5', lineHeight: 1.6 }}>{result.recommendation}</p>
          </div>

          <button onClick={reset} style={{ padding: '10px 0', background: 'transparent', border: '1px solid #1A2235', borderRadius: 10, fontFamily: 'var(--jb)', fontSize: 12, color: '#8892B0' }}>
            ← Try Another JD
          </button>
        </motion.div>
      )}
    </div>
  )
}
