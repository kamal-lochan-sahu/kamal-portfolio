
'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Tilt from 'react-parallax-tilt'
import { PROJECTS } from '@/lib/constants'

const TABS = [
  { key:'flagship',   label:'⭐ Flagship',       filter:(p:typeof PROJECTS[0])=>p.tier===1 },
  { key:'ai',         label:'🧠 AI Systems',     filter:(p:typeof PROJECTS[0])=>p.tier===2 },
  { key:'production', label:'💼 Production',     filter:(p:typeof PROJECTS[0])=>p.tier===3 },
]
const STATUS: Record<string,{bg:string;color:string;label:string}> = {
  live: { bg:'rgba(0,200,83,0.1)',   color:'#00C853', label:'🟢 Live'  },
  demo: { bg:'rgba(123,97,255,0.1)', color:'#7B61FF', label:'🎬 Demo'  },
  soon: { bg:'rgba(255,165,0,0.1)',  color:'#FFA500', label:'🔄 Soon'  },
}

export default function Projects() {
  const [tab, setTab] = useState('flagship')
  const shown = PROJECTS.filter(TABS.find(t=>t.key===tab)!.filter)

  return (
    <section id="projects" className="snap-sec"
      style={{ flexDirection:'column', padding:'80px 24px 24px', overflow:'hidden' }}>

      {/* Gradient blob */}
      <div style={{
        position:'absolute', top:'20%', right:'-10%', width:400, height:400,
        borderRadius:'50%', background:'radial-gradient(circle,rgba(123,97,255,0.06),transparent 70%)',
        filter:'blur(50px)', pointerEvents:'none',
      }}/>

      <motion.div initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}}
        transition={{duration:0.6}} viewport={{once:true}}
        style={{ textAlign:'center', marginBottom:28 }}>
        <p style={{ fontFamily:'var(--jb)', color:'#7B61FF', fontSize:12, letterSpacing:'0.22em', marginBottom:8 }}>
          — PROJECTS —
        </p>
        <h2 style={{ fontFamily:'var(--sg)', fontWeight:900, fontSize:'3rem', color:'#F5F5F5' }}>
          My Work
        </h2>
      </motion.div>

      <div style={{ display:'flex', gap:8, justifyContent:'center', marginBottom:28 }}>
        {TABS.map(t => (
          <motion.button key={t.key} onClick={()=>setTab(t.key)}
            whileHover={{ scale:1.04 }} whileTap={{ scale:0.97 }}
            style={{
              padding:'8px 20px',
              fontFamily:'var(--jb)', fontSize:13, cursor:'none',
              border:`1px solid ${tab===t.key?'#00E5FF':'#1A2235'}`,
              borderRadius:10,
              background: tab===t.key?'rgba(0,229,255,0.1)':'transparent',
              color: tab===t.key?'#00E5FF':'#8892B0',
              transition:'all 0.2s',
            }}>
            {t.label}
          </motion.button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={tab}
          initial={{opacity:0,y:20}} animate={{opacity:1,y:0}}
          exit={{opacity:0,y:-20}} transition={{duration:0.3}}
          style={{
            display:'grid',
            gridTemplateColumns:shown.length===1?'1fr':'repeat(auto-fit,minmax(300px,1fr))',
            gap:18, maxWidth:1100, width:'100%', margin:'0 auto',
            maxHeight:'calc(100vh - 280px)', overflowY:'auto', paddingRight:4,
          }}>
          {shown.map((p,i) => {
            const st = STATUS[p.status]||STATUS.live
            return (
              <motion.div key={p.id}
                initial={{opacity:0,y:24}} animate={{opacity:1,y:0}}
                transition={{delay:i*0.08}}>
                <Tilt tiltMaxAngleX={8} tiltMaxAngleY={8} glareEnable={true}
                  glareMaxOpacity={0.08} glareColor="#00E5FF"
                  style={{ height:'100%' }}>
                  <div style={{
                    background:'rgba(15,22,36,0.85)',
                    border:'1px solid rgba(26,34,53,0.9)',
                    borderRadius:18, padding:22,
                    display:'flex', flexDirection:'column', gap:14,
                    backdropFilter:'blur(12px)',
                    boxShadow:'0 4px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.03)',
                    height:'100%', transition:'border-color 0.3s, box-shadow 0.3s',
                  }}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLElement).style.borderColor='rgba(0,229,255,0.25)'
                      ;(e.currentTarget as HTMLElement).style.boxShadow='0 8px 40px rgba(0,229,255,0.08), inset 0 1px 0 rgba(255,255,255,0.05)'
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLElement).style.borderColor='rgba(26,34,53,0.9)'
                      ;(e.currentTarget as HTMLElement).style.boxShadow='0 4px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.03)'
                    }}
                  >
                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
                      <div>
                        <h3 style={{ fontFamily:'var(--sg)', fontWeight:800, fontSize:'1.3rem', color:'#F5F5F5', marginBottom:3 }}>
                          {p.title}
                          {p.tier===1 && <span style={{ marginLeft:8, fontSize:11, color:'#00E5FF', fontFamily:'var(--jb)' }}>★ FLAGSHIP</span>}
                        </h3>
                        <p style={{ fontFamily:'var(--jb)', fontSize:12, color:'#8892B0' }}>{p.subtitle}</p>
                      </div>
                      <span style={{
                        padding:'4px 12px', borderRadius:99,
                        background:st.bg, color:st.color,
                        fontFamily:'var(--jb)', fontSize:11, whiteSpace:'nowrap',
                        border:`1px solid ${st.color}44`,
                      }}>{st.label}</span>
                    </div>

                    <p style={{
                      fontFamily:'var(--sg)', fontSize:13,
                      color:'rgba(245,245,245,0.5)', fontStyle:'italic', lineHeight:1.55,
                    }}>
                      &ldquo;{p.tagline}&rdquo;
                    </p>

                    <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                      <span style={{ fontFamily:'var(--sg)', fontSize:14, fontWeight:800, color:'#00E5FF' }}>{p.metric}</span>
                      <div style={{ flex:1, height:1, background:'linear-gradient(to right,#1A2235,transparent)' }}/>
                    </div>

                    <div style={{ display:'flex', flexWrap:'wrap', gap:6 }}>
                      {p.tags.map(tag => (
                        <span key={tag} style={{
                          padding:'3px 10px',
                          background:'rgba(0,229,255,0.05)',
                          border:'1px solid rgba(0,229,255,0.12)',
                          borderRadius:99,
                          fontFamily:'var(--jb)', fontSize:11, color:'#8892B0',
                        }}>{tag}</span>
                      ))}
                    </div>

                    <div style={{ display:'flex', gap:10, marginTop:'auto' }}>
                      {p.github!=='#' && (
                        <a href={p.github} target="_blank" rel="noreferrer" style={{
                          flex:1, padding:'9px 0', textAlign:'center',
                          border:'1px solid #1A2235', borderRadius:10,
                          fontFamily:'var(--jb)', fontSize:12, color:'#8892B0',
                          textDecoration:'none', transition:'all 0.2s',
                        }}
                          onMouseEnter={e=>{ (e.currentTarget as HTMLElement).style.borderColor='#00E5FF';(e.currentTarget as HTMLElement).style.color='#00E5FF' }}
                          onMouseLeave={e=>{ (e.currentTarget as HTMLElement).style.borderColor='#1A2235';(e.currentTarget as HTMLElement).style.color='#8892B0' }}
                        >GitHub →</a>
                      )}
                      {p.demo!=='#' ? (
                        <a href={p.demo} target="_blank" rel="noreferrer" style={{
                          flex:1, padding:'9px 0', textAlign:'center',
                          background:'rgba(0,229,255,0.1)',
                          border:'1px solid rgba(0,229,255,0.3)', borderRadius:10,
                          fontFamily:'var(--jb)', fontSize:12, color:'#00E5FF',
                          textDecoration:'none',
                        }}>Live Demo ↗</a>
                      ) : (
                        <span style={{
                          flex:1, padding:'9px 0', textAlign:'center',
                          border:'1px solid #1A2235', borderRadius:10,
                          fontFamily:'var(--jb)', fontSize:12, color:'#1A2235',
                        }}>{p.status==='demo'?'Video Demo':'Coming Soon'}</span>
                      )}
                    </div>
                  </div>
                </Tilt>
              </motion.div>
            )
          })}
        </motion.div>
      </AnimatePresence>
    </section>
  )
}
