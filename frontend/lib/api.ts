const BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export async function askKamal(question: string) {
  const res = await fetch(`${BASE}/api/ask/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ question }),
  })
  if (!res.ok) throw new Error('API error')
  return res.json() as Promise<{ answer: string; question: string }>
}

export async function getSuggestions() {
  const res = await fetch(`${BASE}/api/ask/suggestions`)
  if (!res.ok) throw new Error('API error')
  return res.json() as Promise<{ questions: string[] }>
}

export async function matchJD(jd_text: string) {
  const res = await fetch(`${BASE}/api/jd/match`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ jd_text }),
  })
  if (!res.ok) throw new Error('API error')
  return res.json() as Promise<{
    match_score: number
    summary: string
    strengths: string[]
    gaps: string[]
    highlighted_projects: string[]
    recommendation: string
  }>
}


export async function getGithubStats() {
  const res = await fetch(`${BASE}/api/github/stats`)
  if (!res.ok) throw new Error('API error')
  return res.json() as Promise<{
    user: { public_repos: number; followers: number; following: number; created_at: string }
    repos: { name: string; description: string | null; stargazers_count: number; language: string | null; html_url: string; updated_at: string }[]
  }>
}

export async function sendBrief(data: { name: string; email: string; message: string; website?: string }) {
  const res = await fetch(`${BASE}/api/contact/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error('API error')
  return res.json() as Promise<{ ok: boolean }>
}
