'use client'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

const USERNAME = 'kamal-lochan-sahu'

interface GHUser {
  public_repos: number
  followers: number
  following: number
  created_at: string
}

interface GHRepo {
  name: string
  description: string | null
  stargazers_count: number
  language: string | null
  html_url: string
  updated_at: string
}

export default function Github() {
  const [user,  setUser]  = useState<GHUser | null>(null)
  const [repos, setRepos] = useState<GHRepo[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [uRes, rRes] = await Promise.all([
          fetch(`https://api.github.com/users/${USERNAME}`),
          fetch(`https://api.github.com/users/${USERNAME}/repos?sort=updated&per_page=6`),
        ])
        const u = await uRes.json()
        const r = await rRes.json()
        setUser(u)
        setRepos(Array.isArray(r) ? r : [])
      } catch { /* offline graceful */ }
      finally { setLoading(false) }
    }
    fetchData()
  }, [])

  const LANG_COLOR: Record<string, string> = {
    Python: '#3572A5', TypeScript: '#2b7489', JavaScript: '#f1e05a',
    HTML: '#e34c26', CSS: '#563d7c', 'Jupyter Notebook': '#DA5B0B',
  }

  return (
    <section id="github" className="snap-sec" style={{ flexDirection: 'column', padding: '80px 24px 24px', overflow: 'hidden' }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        style={{ textAlign: 'center', marginBottom: 28 }}
      >
        <p style={{ fontFamily: 'var(--jb)', color: '#00E5FF', fontSize: 12, letterSpacing: '0.2em', marginBottom: 6 }}>— GITHUB —</p>
        <h2 style={{ fontFamily: 'var(--sg)', fontWeight: 700, fontSize: '2.8rem', color: '#F5F5F5' }}>
          Always <span style={{ color: '#00E5FF' }}>Building</span>
        </h2>
      </motion.div>

      <div style={{ maxWidth: 960, width: '100%', margin: '0 auto' }}>
        {/* Stats row */}
        {user && (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            style={{ display: 'flex', gap: 12, justifyContent: 'center', marginBottom: 24, flexWrap: 'wrap' }}
          >
            {[
              { value: user.public_repos, label: 'Repositories' },
              { value: user.followers,    label: 'Followers'     },
              { value: user.following,    label: 'Following'     },
            ].map(s => (
              <div key={s.label} style={{
                padding: '14px 28px', background: '#0F1624',
                border: '1px solid #1A2235', borderRadius: 12, textAlign: 'center',
              }}>
                <div style={{ fontFamily: 'var(--sg)', fontWeight: 700, fontSize: '1.6rem', color: '#00E5FF' }}>{s.value}</div>
                <div style={{ fontFamily: 'var(--jb)', fontSize: 12, color: '#8892B0' }}>{s.label}</div>
              </div>
            ))}
          </motion.div>
        )}

        {/* Contribution heatmap */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          style={{ marginBottom: 24, textAlign: 'center' }}
        >
          <img
            src={`https://ghchart.rshah.org/00E5FF/${USERNAME}`}
            alt="GitHub Contributions"
            style={{ maxWidth: '100%', opacity: 0.85, borderRadius: 8 }}
          />
        </motion.div>

        {/* Recent repos */}
        {!loading && repos.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 12 }}>
            {repos.slice(0, 6).map((repo, i) => (
              <motion.a
                key={repo.name}
                href={repo.html_url}
                target="_blank"
                rel="noreferrer"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                viewport={{ once: true }}
                style={{
                  display: 'block', padding: '14px 16px',
                  background: '#0F1624', border: '1px solid #1A2235',
                  borderRadius: 10, textDecoration: 'none',
                  transition: 'border-color 0.2s',
                }}
              >
                <p style={{ fontFamily: 'var(--sg)', fontWeight: 600, fontSize: '0.88rem', color: '#00E5FF', marginBottom: 4 }}>
                  {repo.name}
                </p>
                <p style={{ fontFamily: 'var(--jb)', fontSize: 11, color: '#8892B0', lineHeight: 1.4, marginBottom: 8, minHeight: 30 }}>
                  {repo.description || 'No description'}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  {repo.language && (
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <span style={{ width: 8, height: 8, borderRadius: '50%', background: LANG_COLOR[repo.language] || '#8892B0', display: 'inline-block' }} />
                      <span style={{ fontFamily: 'var(--jb)', fontSize: 10, color: '#8892B0' }}>{repo.language}</span>
                    </span>
                  )}
                  <span style={{ fontFamily: 'var(--jb)', fontSize: 10, color: '#8892B0' }}>★ {repo.stargazers_count}</span>
                </div>
              </motion.a>
            ))}
          </div>
        )}

        {loading && (
          <div style={{ textAlign: 'center', fontFamily: 'var(--jb)', fontSize: 13, color: '#8892B0' }}>
            Loading GitHub data...
          </div>
        )}
      </div>
    </section>
  )
}
