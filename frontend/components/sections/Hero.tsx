
'use client'
import { motion } from 'framer-motion'
import { STATS, EMAIL } from '@/lib/constants'
import MagneticButton  from '@/components/ui/MagneticButton'
import ParticleBackground from '@/components/ui/ParticleBackground'

const up = (d: number) => ({
  initial:{ opacity:0, y:32 }, animate:{ opacity:1, y:0 },
  transition:{ duration:0.8, delay:d, ease:[0.22,1,0.36,1] as const },
})

const CHIPS = ['Business systems', 'AI & automation', 'Web & mobile apps']

export default function Hero() {
  const scrollTo = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior:'smooth' })

  const openAskAI = () => {
    window.dispatchEvent(new CustomEvent('open-ask-ai'))
  }

  return (
    <section id="hero" className="snap-sec" style={{ alignItems:'center' }}>
      <ParticleBackground />

      {/* Gradient mesh blobs */}
      <div style={{
        position:'absolute', top:'15%', left:'5%', width:600, height:600,
        borderRadius:'50%', background:'radial-gradient(circle,rgba(0,229,255,0.06),transparent 70%)',
        filter:'blur(60px)', pointerEvents:'none', zIndex:0,
      }}/>
      <div style={{
        position:'absolute', bottom:'10%', right:'5%', width:500, height:500,
        borderRadius:'50%', background:'radial-gradient(circle,rgba(123,97,255,0.07),transparent 70%)',
        filter:'blur(60px)', pointerEvents:'none', zIndex:0,
      }}/>

      <div className="relative z-10 w-full max-w-3xl mx-auto px-6 pt-16">

        <motion.p {...up(0.2)} style={{
          fontFamily:'var(--jb)', color:'#00E5FF', fontSize:12,
          letterSpacing:'0.28em', marginBottom:22,
        }}>
          {'>_ Hello,'}
        </motion.p>

        <motion.h1 className="hero-heading" {...up(0.35)} style={{
          fontFamily:'var(--sg)', fontWeight:900, lineHeight:1.02,
          fontSize:'clamp(2.6rem,5.5vw,4.6rem)', marginBottom:20,
        }}>
          I&apos;m Kamal{' '}
          <span style={{
            background:'linear-gradient(135deg,#00E5FF,#7B61FF)',
            WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent',
          }}>Lochan Sahu</span>
        </motion.h1>

        <motion.p {...up(0.45)} style={{
          fontFamily:'var(--sg)', fontSize:'clamp(1rem,1.8vw,1.2rem)',
          color:'#00E5FF', fontWeight:600, marginBottom:14,
        }}>
          Full-Stack &amp; ML/AI Engineer — Business Software, Automation &amp; Intelligent Systems
        </motion.p>

        <motion.p {...up(0.55)} style={{
          fontFamily:'var(--sg)', fontSize:'clamp(1rem,1.6vw,1.15rem)',
          color:'rgba(245,245,245,0.7)', lineHeight:1.75, marginBottom:24, maxWidth:560,
        }}>
          I build custom software and automation that cut manual work and keep your business running smoothly.
        </motion.p>

        <motion.div {...up(0.65)} style={{ display:'flex', flexWrap:'wrap', gap:8, marginBottom:36 }}>
          {CHIPS.map(c => (
            <span key={c} style={{
              padding:'6px 14px', borderRadius:999,
              border:'1px solid rgba(0,229,255,0.25)', background:'rgba(0,229,255,0.05)',
              fontFamily:'var(--jb)', fontSize:12, color:'#00E5FF',
            }}>{c}</span>
          ))}
        </motion.div>

        <motion.div {...up(0.75)} style={{ display:'flex', gap:14, flexWrap:'wrap', marginBottom:40 }}>
          <MagneticButton variant="primary" onClick={openAskAI}>
            Tell me your problem →
          </MagneticButton>
          <MagneticButton variant="outline" onClick={() => scrollTo('projects')}>
            See what I&apos;ve built ↓
          </MagneticButton>
          <MagneticButton variant="outline" href={`mailto:${EMAIL}`}>
            Email me
          </MagneticButton>
        </motion.div>

        <motion.div {...up(0.85)} style={{ display:'flex', flexWrap:'wrap', gap:10 }}>
          {STATS.map((s,i) => {
            const badgeStyle = {
              display:'flex', alignItems:'center', gap:8,
              padding:'9px 20px',
              background:'rgba(15,22,36,0.8)',
              border:'1px solid rgba(26,34,53,0.9)',
              borderRadius:999, backdropFilter:'blur(10px)',
              cursor:'none', transition:'all 0.25s',
              textDecoration:'none',
            } as const
            const inner = (
              <>
                <span style={{ fontFamily:'var(--sg)', fontWeight:800, color:'#00E5FF', fontSize:15 }}>{s.value}</span>
                <span style={{ fontFamily:'var(--jb)', fontSize:11, color:'#8892B0' }}>{s.label}</span>
              </>
            )
            if (s.href) {
              return (
                <motion.a
                  key={i}
                  onClick={(e) => { e.preventDefault(); scrollTo(s.href!.replace('#','')) }}
                  href={s.href}
                  whileHover={{ scale:1.05, borderColor:'rgba(0,229,255,0.5)' }}
                  style={badgeStyle}
                >
                  {inner}
                </motion.a>
              )
            }
            return (
              <motion.div key={i} whileHover={{ scale:1.05, borderColor:'rgba(0,229,255,0.5)' }} style={badgeStyle}>
                {inner}
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
