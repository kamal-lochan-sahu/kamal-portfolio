
'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import SVGRobot from './SVGRobot'
import AskMeModal     from '@/components/modals/AskMeModal'
import JDMatcherModal from '@/components/modals/JDMatcherModal'

export default function AvatarCompanion() {
  const [hovered, setHovered] = useState(false)
  const [askOpen, setAskOpen] = useState(false)
  const [jdOpen,  setJdOpen]  = useState(false)

  return (
    <>
      <div onMouseEnter={()=>setHovered(true)} onMouseLeave={()=>setHovered(false)}
        style={{
          position:'fixed', bottom:20, right:20, zIndex:50,
          display:'flex', flexDirection:'column', alignItems:'flex-end', gap:8, padding:8,
        }}>
        <AnimatePresence>
          {hovered && (
            <motion.div
              initial={{opacity:0,y:10,scale:0.9}} animate={{opacity:1,y:0,scale:1}}
              exit={{opacity:0,y:10,scale:0.9}} transition={{duration:0.2,type:'spring',stiffness:350}}
              style={{ display:'flex', flexDirection:'column', gap:8 }}>
              {[
                { label:'💬 Ask Me About Kamal', color:'#00E5FF', bc:'rgba(0,229,255,0.3)', fn:()=>{setAskOpen(true);setHovered(false)} },
                { label:'📋 Match Your JD',       color:'#7B61FF', bc:'rgba(123,97,255,0.3)', fn:()=>{setJdOpen(true);setHovered(false)} },
              ].map(b => (
                <motion.button key={b.label} onClick={b.fn}
                  whileHover={{ x:-5, boxShadow:`0 0 24px ${b.bc}` }}
                  style={{
                    padding:'11px 18px',
                    background:'rgba(9,14,26,0.95)',
                    border:`1px solid ${b.bc}`,
                    backdropFilter:'blur(16px)', borderRadius:13,
                    fontFamily:'var(--jb)', fontSize:13, color:b.color,
                    cursor:'none', whiteSpace:'nowrap', textAlign:'left',
                    boxShadow:'0 8px 32px rgba(0,0,0,0.5)',
                  }}>
                  {b.label}
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Robot */}
        <motion.div
          whileHover={{ scale:1.06 }}
          style={{
            width:80, height:80, borderRadius:'50%', overflow:'hidden',
            cursor:'none', display:'flex', alignItems:'center', justifyContent:'center',
            background:'rgba(9,14,26,0.95)',
            border:`2px solid ${hovered?'#00E5FF':'rgba(0,229,255,0.3)'}`,
            boxShadow: hovered
              ? '0 0 32px rgba(0,229,255,0.45), 0 0 64px rgba(0,229,255,0.15)'
              : '0 0 16px rgba(0,229,255,0.12)',
            transition:'border-color 0.3s, box-shadow 0.3s',
          }}>
          <SVGRobot emotion={hovered?'excited':'idle'} size={72} showFull={false}/>
        </motion.div>
      </div>

      <AskMeModal     open={askOpen} onClose={()=>setAskOpen(false)}/>
      <JDMatcherModal open={jdOpen}  onClose={()=>setJdOpen(false)}/>
    </>
  )
}
