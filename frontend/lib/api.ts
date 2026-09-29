const BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export interface HistoryTurn { role: 'user' | 'kamal'; text: string }

export async function askKamal(question: string, history: HistoryTurn[] = []) {
  const res = await fetch(`${BASE}/api/ask/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    // Backend caps this at 6 turns anyway; trimming here keeps the payload small.
    body: JSON.stringify({ question, history: history.slice(-6) }),
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
  // Backend always returns 200 for this endpoint; user is null when GitHub's
  // own API failed or rate-limited us, so the caller checks that instead of
  // relying on a thrown error.
  return res.json() as Promise<{
    ok: boolean
    user: { public_repos: number; followers: number; following: number; created_at: string } | null
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

export interface TourStep { id: string; title: string; message: string }

export async function planTour(interest: string) {
  const res = await fetch(`${BASE}/api/tour/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ interest }),
  })
  if (!res.ok) throw new Error('API error')
  return res.json() as Promise<{ steps: TourStep[] }>
}
