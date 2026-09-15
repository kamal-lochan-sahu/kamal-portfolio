#!/usr/bin/env python3
"""
fix_and_wire.py
Run this from ~/projects/kamal-portfolio/ (or anywhere — it finds the repo
via PROJECT_ROOT below). Fixes the mistakes from add_remaining_features.py
and properly wires everything into your ACTUAL project structure
(frontend/app, frontend/components, frontend/lib — no src/ folder).

What it does:
  1. Moves misplaced files out of frontend/src/* into the correct folders
  2. Deletes the now-empty frontend/src/
  3. Rewrites Navbar.tsx to wire the EXISTING EN/DE + sound buttons to the
     real LanguageContext + Howler sounds (no duplicate UI added)
  4. Rewrites layout.tsx to add LanguageProvider, TerminalEgg, GuidedTour,
     and the mobile-fixes.css import
  5. Adds a backend GitHub proxy endpoint (routers/github.py) so your
     GitHub token stays server-side, and points the frontend Github.tsx
     section at it instead of calling api.github.com directly
  6. Registers the new backend router in main.py

Safe to run more than once (idempotent-ish) but it OVERWRITES:
  - frontend/components/layout/Navbar.tsx
  - frontend/app/layout.tsx
  - frontend/components/sections/Github.tsx
  - backend/main.py
  - frontend/lib/api.ts (appends, does not overwrite)
If you've hand-edited any of these since the last script run, back them up
first: git stash
"""

import os
import shutil
import sys

HOME = os.path.expanduser("~")
PROJECT_ROOT = os.path.join(HOME, "projects", "kamal-portfolio")
FRONTEND = os.path.join(PROJECT_ROOT, "frontend")
BACKEND = os.path.join(PROJECT_ROOT, "backend")
SRC = os.path.join(FRONTEND, "src")


def check():
    if not os.path.isdir(FRONTEND) or not os.path.isdir(BACKEND):
        print(f"ERROR: expected {FRONTEND} and {BACKEND} to exist.")
        print("Edit PROJECT_ROOT at the top of this script if your path differs.")
        sys.exit(1)


def move(src, dst):
    if not os.path.exists(src):
        print(f"  (skip, not found) {src.replace(HOME, '~')}")
        return
    os.makedirs(os.path.dirname(dst), exist_ok=True)
    shutil.move(src, dst)
    print(f"  ✓ moved -> {dst.replace(HOME, '~')}")


def write(path, content):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "w", encoding="utf-8") as f:
        f.write(content)
    print(f"  ✓ wrote {path.replace(HOME, '~')}")


# ---------------------------------------------------------------------------
# STEP 1: move misplaced files to correct locations
# ---------------------------------------------------------------------------
def fix_paths():
    print("\n[1/6] Fixing misplaced files...")
    move(os.path.join(SRC, "lib", "sounds.ts"), os.path.join(FRONTEND, "lib", "sounds.ts"))
    move(os.path.join(SRC, "components", "TerminalEgg.tsx"), os.path.join(FRONTEND, "components", "TerminalEgg.tsx"))
    move(os.path.join(SRC, "components", "GuidedTour.tsx"), os.path.join(FRONTEND, "components", "GuidedTour.tsx"))
    move(os.path.join(SRC, "contexts", "LanguageContext.tsx"), os.path.join(FRONTEND, "contexts", "LanguageContext.tsx"))
    move(os.path.join(SRC, "components", "ScrollReveal.tsx"), os.path.join(FRONTEND, "components", "ScrollReveal.tsx"))
    move(os.path.join(SRC, "styles", "mobile-fixes.css"), os.path.join(FRONTEND, "styles", "mobile-fixes.css"))

    # These two duplicated Navbar's existing buttons — not needed, delete if present
    for dupe in [
        os.path.join(SRC, "components", "SoundToggle.tsx"),
        os.path.join(SRC, "components", "LanguageToggle.tsx"),
    ]:
        if os.path.exists(dupe):
            os.remove(dupe)
            print(f"  ✓ removed duplicate {dupe.replace(HOME, '~')}")

    # Clean up now-empty src/ tree
    if os.path.isdir(SRC):
        shutil.rmtree(SRC, ignore_errors=True)
        print("  ✓ removed empty frontend/src/")


# ---------------------------------------------------------------------------
# STEP 2: rewrite Navbar.tsx — wire existing buttons to real systems
# ---------------------------------------------------------------------------
NAVBAR_TSX = '''\
'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { SECTIONS } from '@/lib/constants'
import { useLanguage } from '@/contexts/LanguageContext'
import { playSound, toggleMute, isMuted } from '@/lib/sounds'

export default function Navbar() {
  const [active, setActive] = useState('hero')
  const { lang, setLang } = useLanguage()
  const [sound, setSound] = useState(!isMuted())

  useEffect(() => {
    const wrap = document.querySelector('.snap-wrap')
    if (!wrap) return
    const handler = () => {
      const mid = window.innerHeight / 2
      SECTIONS.forEach(s => {
        const el = document.getElementById(s.id)
        if (!el) return
        const r = el.getBoundingClientRect()
        if (r.top <= mid && r.bottom >= mid) setActive(s.id)
      })
    }
    wrap.addEventListener('scroll', handler)
    return () => wrap.removeEventListener('scroll', handler)
  }, [])

  const scrollTo = (id: string) => {
    playSound('click')
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '14px 28px',
    }}>
      {/* Backdrop */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'rgba(9,14,26,0.7)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(26,34,53,0.6)',
        pointerEvents: 'none',
      }} />

      {/* Logo */}
      <motion.button
        initial={{ opacity: 0, x: -16 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={() => scrollTo('hero')}
        style={{
          position: 'relative', zIndex: 1,
          fontFamily: 'var(--sg)', fontWeight: 700, fontSize: 17,
          color: '#F5F5F5', background: 'none', border: 'none', cursor: 'pointer',
        }}
      >
        <span style={{ color: '#00E5FF' }}>K</span>amal
        <span style={{ fontFamily: 'var(--jb)', color: '#8892B0', fontSize: 11, marginLeft: 6 }}>.dev</span>
      </motion.button>

      {/* Section dots */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', gap: 10 }}
      >
        {SECTIONS.map(s => (
          <button
            key={s.id}
            onClick={() => scrollTo(s.id)}
            title={s.label}
            style={{
              borderRadius: 999,
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.3s',
              width:  active === s.id ? 28 : 8,
              height: 8,
              background: active === s.id ? '#00E5FF' : '#1A2235',
              boxShadow: active === s.id ? '0 0 8px #00E5FF' : 'none',
              padding: 0,
            }}
          />
        ))}
      </motion.div>

      {/* Controls */}
      <motion.div
        initial={{ opacity: 0, x: 16 }}
        animate={{ opacity: 1, x: 0 }}
        style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', gap: 8 }}
      >
        <button
          onClick={() => {
            setLang(lang === 'en' ? 'de' : 'en')
            playSound('click')
          }}
          style={{
            padding: '6px 12px',
            fontFamily: 'var(--jb)', fontSize: 11,
            border: '1px solid #1A2235', borderRadius: 8,
            color: '#8892B0', background: 'transparent', cursor: 'pointer',
            transition: 'all 0.2s',
          }}
        >
          {lang === 'en' ? '🇬🇧 EN' : '🇩🇪 DE'}
        </button>
        <button
          onClick={() => {
            const nowMuted = toggleMute()
            setSound(!nowMuted)
          }}
          style={{
            width: 34, height: 34, fontSize: 14,
            border: '1px solid #1A2235', borderRadius: 8,
            color: '#8892B0', background: 'transparent', cursor: 'pointer',
          }}
        >
          {sound ? '🔊' : '🔇'}
        </button>
      </motion.div>
    </nav>
  )
}
'''

# ---------------------------------------------------------------------------
# STEP 3: rewrite layout.tsx
# ---------------------------------------------------------------------------
LAYOUT_TSX = '''\
import type { Metadata } from 'next'
import { Space_Grotesk, Inter, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import '@/styles/mobile-fixes.css'
import { LanguageProvider } from '@/contexts/LanguageContext'
import TerminalEgg from '@/components/TerminalEgg'
import GuidedTour from '@/components/GuidedTour'

// Variable names: --sg, --inter, --jb
// (avoids conflict with Tailwind v4 --font-* namespace)
const sg = Space_Grotesk({
  subsets: ['latin'],
  variable: '--sg',
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
})
const inter = Inter({
  subsets: ['latin'],
  variable: '--inter',
  display: 'swap',
})
const jb = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--jb',
  weight: ['400', '500'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Kamal Lochan Sahu — AI & Robotics Engineer',
  description: 'I build systems that think, predict, and act — without being told twice.',
  keywords: ['AI Engineer', 'Robotics', 'Full Stack', 'ML', 'NEXUS', 'CORTEX', 'Germany'],
  authors: [{ name: 'Kamal Lochan Sahu' }],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sg.variable} ${inter.variable} ${jb.variable}`}>
      <body>
        <LanguageProvider>
          {children}
          <TerminalEgg />
          <GuidedTour />
        </LanguageProvider>
      </body>
    </html>
  )
}
'''

# ---------------------------------------------------------------------------
# STEP 4: backend GitHub proxy (keeps token server-side)
# ---------------------------------------------------------------------------
GITHUB_ROUTER_PY = '''\
import os
import httpx
from fastapi import APIRouter, HTTPException

router = APIRouter(prefix="/api/github", tags=["github"])

USERNAME = "kamal-lochan-sahu"
GITHUB_TOKEN = os.getenv("GITHUB_TOKEN")


def _headers():
    headers = {"Accept": "application/vnd.github+json"}
    if GITHUB_TOKEN:
        headers["Authorization"] = f"Bearer {GITHUB_TOKEN}"
    return headers


@router.get("/stats")
async def github_stats():
    """Returns user profile + recent repos. Uses GITHUB_TOKEN if set
    (higher rate limit, accurate follower count); falls back to
    unauthenticated calls otherwise."""
    async with httpx.AsyncClient(timeout=10) as client:
        try:
            user_res = await client.get(
                f"https://api.github.com/users/{USERNAME}", headers=_headers()
            )
            repos_res = await client.get(
                f"https://api.github.com/users/{USERNAME}/repos"
                "?sort=updated&per_page=6",
                headers=_headers(),
            )
        except httpx.HTTPError as e:
            raise HTTPException(status_code=502, detail=str(e))

    if user_res.status_code != 200:
        raise HTTPException(status_code=user_res.status_code, detail="GitHub user fetch failed")

    user = user_res.json()
    repos = repos_res.json() if repos_res.status_code == 200 else []

    return {
        "user": {
            "public_repos": user.get("public_repos", 0),
            "followers": user.get("followers", 0),
            "following": user.get("following", 0),
            "created_at": user.get("created_at"),
        },
        "repos": [
            {
                "name": r.get("name"),
                "description": r.get("description"),
                "stargazers_count": r.get("stargazers_count", 0),
                "language": r.get("language"),
                "html_url": r.get("html_url"),
                "updated_at": r.get("updated_at"),
            }
            for r in (repos if isinstance(repos, list) else [])
        ],
    }
'''

MAIN_PY = '''\
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import ask_me, jd_matcher, health, github
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(
    title="Kamal Portfolio API",
    description="AI-powered backend for kamallochan.dev",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://kamallochan.dev",
        "https://*.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(ask_me.router)
app.include_router(jd_matcher.router)
app.include_router(health.router)
app.include_router(github.router)

@app.get("/")
def root():
    return {"name": "Kamal Portfolio API", "status": "online", "version": "1.0.0"}

@app.get("/api/ping")
def ping():
    return {"pong": True}
'''

# ---------------------------------------------------------------------------
# STEP 5: rewrite Github.tsx section to call backend instead of GitHub direct
# ---------------------------------------------------------------------------
GITHUB_SECTION_TSX = '''\
'use client'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { getGithubStats } from '@/lib/api'

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
        const data = await getGithubStats()
        setUser(data.user)
        setRepos(data.repos || [])
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
'''

API_TS_ADDITION = '''

export async function getGithubStats() {
  const res = await fetch(`${BASE}/api/github/stats`)
  if (!res.ok) throw new Error('API error')
  return res.json() as Promise<{
    user: { public_repos: number; followers: number; following: number; created_at: string }
    repos: { name: string; description: string | null; stargazers_count: number; language: string | null; html_url: string; updated_at: string }[]
  }>
}
'''


def wire_frontend():
    print("\n[2/6] Wiring Navbar.tsx (EN/DE + sound -> real systems)...")
    write(os.path.join(FRONTEND, "components", "layout", "Navbar.tsx"), NAVBAR_TSX)

    print("\n[3/6] Wiring layout.tsx (LanguageProvider, TerminalEgg, GuidedTour, mobile CSS)...")
    write(os.path.join(FRONTEND, "app", "layout.tsx"), LAYOUT_TSX)

    print("\n[4/6] Pointing Github.tsx at the backend proxy...")
    write(os.path.join(FRONTEND, "components", "sections", "Github.tsx"), GITHUB_SECTION_TSX)

    api_path = os.path.join(FRONTEND, "lib", "api.ts")
    with open(api_path, "r", encoding="utf-8") as f:
        current = f.read()
    if "getGithubStats" not in current:
        with open(api_path, "a", encoding="utf-8") as f:
            f.write(API_TS_ADDITION)
        print(f"  ✓ appended getGithubStats() to {api_path.replace(HOME, '~')}")
    else:
        print("  (skip) getGithubStats already in api.ts")


def wire_backend():
    print("\n[5/6] Adding backend GitHub proxy router...")
    write(os.path.join(BACKEND, "routers", "github.py"), GITHUB_ROUTER_PY)
    write(os.path.join(BACKEND, "main.py"), MAIN_PY)

    req_path = os.path.join(BACKEND, "requirements.txt")
    with open(req_path, "r", encoding="utf-8") as f:
        reqs = f.read()
    if "httpx" not in reqs:
        with open(req_path, "a", encoding="utf-8") as f:
            f.write("\nhttpx\n")
        print(f"  ✓ added httpx to {req_path.replace(HOME, '~')}")
    else:
        print("  (skip) httpx already in requirements.txt")

    env_path = os.path.join(BACKEND, ".env")
    print(f"\n  NOTE: add your GitHub token to {env_path.replace(HOME, '~')}:")
    print("    GITHUB_TOKEN=ghp_your_token_here")
    print("  (Create one at https://github.com/settings/tokens — 'public_repo' read scope is enough)")
    print("  Without it, the proxy still works but at GitHub's lower unauthenticated rate limit.")


def main():
    check()
    fix_paths()
    wire_frontend()
    wire_backend()

    print("\n" + "=" * 60)
    print("DONE. Remaining manual steps:")
    print("=" * 60)
    print('''
1. Add your GitHub token locally:
     echo "GITHUB_TOKEN=ghp_your_token_here" >> backend/.env

2. Add it to Render too (backend is deployed there):
   Render dashboard -> your backend service -> Environment ->
   add GITHUB_TOKEN=ghp_your_token_here -> Save (auto-redeploys)

3. Install the new backend dependency:
     cd backend && source venv/bin/activate && pip install httpx

4. Drop 6 short mp3s into frontend/public/sounds/
   (see frontend/public/sounds/README.txt for the list + free sources)
   Sound button in navbar will silently no-op until these exist.

5. STILL fully manual (needs your real data):
   - Update project live URLs (github/demo) in frontend/lib/constants.ts
     — replace the '#' placeholders on NEXUS, BioSignal, EarthWatch,
     TruthLens

6. Optional: wrap any section in frontend/app/page.tsx with
   <ScrollReveal>...</ScrollReveal> for scroll-in animation.
   Component is at frontend/components/ScrollReveal.tsx.

7. Test locally:
     cd frontend && npm run dev
   Then: Ctrl+` for terminal easter egg, tour button bottom-right,
   EN/DE + sound buttons in the navbar (now actually wired).

8. Deploy:
     git add . && git commit -m "wire terminal egg, guided tour,
     language toggle, sound, github token proxy, mobile fixes" && git push
''')


if __name__ == "__main__":
    main()
