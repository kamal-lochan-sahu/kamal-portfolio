
// Free voice using Web Speech Synthesis API
// Zero cost, works in Chrome/Edge/Firefox

let currentUtterance: SpeechSynthesisUtterance | null = null

export function speak(text: string, options?: {
  rate?: number; pitch?: number; volume?: number; lang?: 'en' | 'de'
}) {
  if (typeof window === 'undefined') return
  if (!('speechSynthesis' in window)) return

  // Cancel any ongoing speech
  window.speechSynthesis.cancel()

  const utterance = new SpeechSynthesisUtterance(text)
  utterance.rate   = options?.rate   ?? 0.92
  utterance.pitch  = options?.pitch  ?? 1.05
  utterance.volume = options?.volume ?? 0.85

  const lang = options?.lang ?? 'en'
  const voices = window.speechSynthesis.getVoices()

  let voice = null
  if (lang === 'de') {
    const preferredDe = ['Google Deutsch', 'Microsoft Katja', 'Anna', 'Markus']
    for (const name of preferredDe) {
      voice = voices.find(v => v.name.includes(name))
      if (voice) break
    }
    if (!voice) {
      voice = voices.find(v => v.lang.startsWith('de-DE')) ||
              voices.find(v => v.lang.startsWith('de'))
    }
    utterance.lang = 'de-DE'
  } else {
    const preferredEn = ['Google US English', 'Microsoft David', 'Alex', 'Daniel']
    for (const name of preferredEn) {
      voice = voices.find(v => v.name.includes(name))
      if (voice) break
    }
    if (!voice) {
      voice = voices.find(v => v.lang.startsWith('en-US')) ||
              voices.find(v => v.lang.startsWith('en'))
    }
    utterance.lang = 'en-US'
  }
  if (voice) utterance.voice = voice

  currentUtterance = utterance
  window.speechSynthesis.speak(utterance)
  return utterance
}

export function stopSpeaking() {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel()
  }
}

export function isSpeaking() {
  if (typeof window === 'undefined') return false
  return window.speechSynthesis.speaking
}
