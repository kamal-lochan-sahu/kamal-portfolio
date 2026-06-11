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
