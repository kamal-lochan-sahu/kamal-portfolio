
'use client'
import { motion } from 'framer-motion'
import { STATS, SUB_LINE, EMAIL } from '@/lib/constants'
import MagneticButton  from '@/components/ui/MagneticButton'
import ParticleBackground from '@/components/ui/ParticleBackground'
import SVGRobot from '@/components/avatar/SVGRobot'

const up = (d: number) => ({
  initial:{ opacity:0, y:32 }, animate:{ opacity:1, y:0 },
  transition:{ duration:0.8, delay:d, ease:[0.22,1,0.36,1] as const },
})

export default function Hero() {
  const scrollTo = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior:'smooth' })

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

      <div className="relative z-10 w-full max-w-6xl mx-auto px-6 pt-16"
        style={{ display:'grid', gridTemplateColumns:'1fr auto', gap:40, alignItems:'center' }}>

        {/* LEFT */}
        <div>
          <motion.p {...up(0.2)} style={{
            fontFamily:'var(--jb)', color:'#00E5FF', fontSize:12,
            letterSpacing:'0.28em', marginBottom:22,
          }}>
            &gt;_ Namaste, I&apos;m
          </motion.p>

          <motion.h1 {...up(0.35)} style={{
            fontFamily:'var(--sg)', fontWeight:900, lineHeight:1.02,
            fontSize:'clamp(3.2rem,5.5vw,5.8rem)', marginBottom:20,
          }}>
            Kamal<br/>Lochan{' '}
            <span style={{
              background:'linear-gradient(135deg,#00E5FF,#7B61FF)',
              WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent',
            }}>Sahu</span>
          </motion.h1>

          <motion.p {...up(0.5)} style={{
            fontFamily:'var(--sg)', fontSize:'clamp(1rem,1.8vw,1.25rem)',
            color:'rgba(245,245,245,0.7)', lineHeight:1.75, marginBottom:12,
          }}>
            I build systems that{' '}
            <span style={{ color:'#00E5FF', fontWeight:700, textShadow:'0 0 20px #00E5FF66' }}>think</span>,{' '}
            <span style={{ color:'#7B61FF', fontWeight:700, textShadow:'0 0 20px #7B61FF66' }}>predict</span>, and{' '}
            <span style={{ color:'#00E5FF', fontWeight:700, textShadow:'0 0 20px #00E5FF66' }}>act</span>
            {' '}— <span style={{ color:'rgba(245,245,245,0.35)' }}>without being told twice.</span>
          </motion.p>

          <motion.p {...up(0.6)} style={{
            fontFamily:'var(--jb)', fontSize:12, color:'#8892B0',
            letterSpacing:'0.09em', marginBottom:36,
          }}>{SUB_LINE}</motion.p>

          <motion.div {...up(0.7)} style={{ display:'flex', flexWrap:'wrap', gap:10, marginBottom:44 }}>
            {STATS.map((s,i) => (
              <motion.div key={i} whileHover={{ scale:1.05, borderColor:'rgba(0,229,255,0.5)' }}
                style={{
                  display:'flex', alignItems:'center', gap:8,
                  padding:'9px 20px',
                  background:'rgba(15,22,36,0.8)',
                  border:'1px solid rgba(26,34,53,0.9)',
                  borderRadius:999, backdropFilter:'blur(10px)',
                  cursor:'none', transition:'all 0.25s',
                }}>
                <span style={{ fontFamily:'var(--sg)', fontWeight:800, color:'#00E5FF', fontSize:15 }}>{s.value}</span>
                <span style={{ fontFamily:'var(--jb)', fontSize:11, color:'#8892B0' }}>{s.label}</span>
              </motion.div>
            ))}
          </motion.div>

          <motion.div {...up(0.85)} style={{ display:'flex', gap:18, flexWrap:'wrap' }}>
            <MagneticButton variant="primary" onClick={() => scrollTo('skills')}>
              View My Work ↓
            </MagneticButton>
            <MagneticButton variant="outline" href={`mailto:${EMAIL}`}>
              Hire Me
            </MagneticButton>
          </motion.div>
        </div>

        {/* RIGHT — Robot */}
        <motion.div
          initial={{ opacity:0, x:40, scale:0.9 }}
          animate={{ opacity:1, x:0,  scale:1 }}
          transition={{ duration:1.1, delay:0.5, ease:[0.22,1,0.36,1] }}
          className="hidden lg:flex items-center justify-center"
          style={{ minWidth:220 }}
        >
          <SVGRobot emotion="idle" size={200} showFull={true} />
        </motion.div>
      </div>

      {/* Currently building */}
      <motion.div
        initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} transition={{ delay:1.5 }}
        style={{
          position:'absolute', bottom:32, left:'50%', transform:'translateX(-50%)',
          display:'flex', alignItems:'center', gap:10,
          padding:'10px 24px',
          background:'rgba(15,22,36,0.9)',
          border:'1px solid rgba(26,34,53,0.8)',
          borderRadius:999, backdropFilter:'blur(14px)', whiteSpace:'nowrap',
        }}
      >
        <span style={{ width:8, height:8, borderRadius:'50%', background:'#00C853',
          display:'inline-block', boxShadow:'0 0 8px #00C853', animation:'pulse 2s infinite' }}/>
        <span style={{ fontFamily:'var(--jb)', fontSize:12, color:'#8892B0' }}>Currently building:</span>
        <span style={{ fontFamily:'var(--jb)', fontSize:12, fontWeight:700, color:'#00C853' }}>CORTEX</span>
        <span style={{ fontFamily:'var(--jb)', fontSize:12, color:'rgba(136,146,176,0.45)' }}>— Autonomous Factory AI</span>
      </motion.div>
    </section>
  )
}
