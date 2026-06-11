
'use client'
import { useEffect, useRef } from 'react'

type Emotion = 'idle' | 'namaste' | 'talking' | 'excited' | 'thinking'
interface Props { emotion?: Emotion; size?: number; showFull?: boolean }

export default function SVGRobot({ emotion = 'idle', size = 200, showFull = true }: Props) {
  const groupRef    = useRef<SVGGElement>(null)
  const headRef     = useRef<SVGGElement>(null)
  const lArmRef     = useRef<SVGGElement>(null)
  const rArmRef     = useRef<SVGGElement>(null)

  useEffect(() => {
    let raf = 0
    const go = () => {
      const t = Date.now() / 1000
      const s = Math.sin

      if (groupRef.current) {
        if (emotion === 'idle' || emotion === 'talking')
          groupRef.current.style.transform = `translateY(${s(t*1.3)*5}px)`
        if (emotion === 'excited')
          groupRef.current.style.transform = `translateY(${Math.abs(s(t*7))*-12}px)`
      }
      if (headRef.current) {
        if (emotion === 'talking')
          headRef.current.style.transform = `rotate(${s(t*5)*4}deg)`
        else if (emotion === 'thinking')
          headRef.current.style.transform = `rotate(${s(t*0.7)*14}deg)`
        else if (emotion === 'idle')
          headRef.current.style.transform = `rotate(${s(t*0.4)*3}deg)`
        else
          headRef.current.style.transform = 'rotate(0deg)'
      }
      if (emotion === 'namaste') {
        const p = Math.min((t % 3) / 0.9, 1)
        const e = p < 0.5 ? 2*p*p : -1+(4-2*p)*p
        if (lArmRef.current) lArmRef.current.style.transform = `rotate(${-e*70}deg)`
        if (rArmRef.current) rArmRef.current.style.transform = `rotate(${e*70}deg)`
      } else {
        if (lArmRef.current) lArmRef.current.style.transform = `rotate(${s(t*0.8)*4}deg)`
        if (rArmRef.current) rArmRef.current.style.transform = `rotate(${s(t*0.8+1)*4}deg)`
      }
      raf = requestAnimationFrame(go)
    }
    raf = requestAnimationFrame(go)
    return () => cancelAnimationFrame(raf)
  }, [emotion])

  const full = showFull
  const vb = full ? '0 0 200 380' : '25 0 150 120'
  const h  = full ? size * 1.9 : size * 0.7

  return (
    <svg viewBox={vb} width={size} height={h}
      style={{ overflow:'visible', filter:'drop-shadow(0 0 24px rgba(0,229,255,0.25))' }}>
      <defs>
        <linearGradient id="rg1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%"   stopColor="#1E2D45"/>
          <stop offset="100%" stopColor="#090E1A"/>
        </linearGradient>
        <linearGradient id="rg2" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%"   stopColor="#162035"/>
          <stop offset="100%" stopColor="#070D18"/>
        </linearGradient>
        <radialGradient id="coreRG" cx="50%" cy="50%" r="50%">
          <stop offset="0%"   stopColor="#B090FF"/>
          <stop offset="60%"  stopColor="#7B61FF"/>
          <stop offset="100%" stopColor="#5040CC"/>
        </radialGradient>
        <filter id="glow2">
          <feGaussianBlur stdDeviation="2.5" result="b"/>
          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
        <filter id="sglow">
          <feGaussianBlur stdDeviation="6" result="b"/>
          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>

      <g ref={groupRef} style={{ transformOrigin:'100px 200px', transition:'transform 0.1s' }}>

        {/* Antenna */}
        <rect x="96" y="-24" width="8" height="24" rx="3" fill="#0F1624"/>
        <circle cx="100" cy="-28" r="7" fill="#00E5FF" filter="url(#glow2)"
          style={{ animation:'eyeGlow 2s ease-in-out infinite' }}/>
        <circle cx="100" cy="-28" r="3.5" fill="#fff" opacity="0.9"/>

        {/* HEAD */}
        <g ref={headRef} style={{ transformOrigin:'100px 50px', transition:'transform 0.1s' }}>
          {/* Outer helm */}
          <path d="M52 8 L42 28 L42 90 L55 102 L145 102 L158 90 L158 28 L148 8 Z"
            fill="url(#rg1)" stroke="#00E5FF" strokeWidth="1" strokeOpacity="0.3"/>
          {/* Inner visor */}
          <path d="M58 28 L52 40 L52 84 L62 92 L138 92 L148 84 L148 40 L142 28 Z"
            fill="#040B14" stroke="#1A2235" strokeWidth="1"/>
          {/* Visor hex pattern */}
          {[60,75,90,105,120,135].map((x,i) => (
            <circle key={i} cx={x} cy={i%2===0?56:64} r="5"
              fill="none" stroke="#00E5FF" strokeWidth="0.5" opacity="0.2"/>
          ))}
          {/* Eye L */}
          <rect x="58" y="48" width="34" height="12" rx="5"
            fill="#00E5FF" filter="url(#glow2)"
            style={{ animation:'eyeGlow 2.5s ease-in-out infinite' }}/>
          <rect x="62" y="51" width="26" height="6" rx="3" fill="#fff" opacity="0.9"/>
          {/* Eye R */}
          <rect x="108" y="48" width="34" height="12" rx="5"
            fill="#00E5FF" filter="url(#glow2)"
            style={{ animation:'eyeGlow 2.5s ease-in-out infinite 0.4s' }}/>
          <rect x="112" y="51" width="26" height="6" rx="3" fill="#fff" opacity="0.9"/>
          {/* Mouth */}
          <rect x="70" y="74" width="60" height="9" rx="4"
            fill={emotion==='talking'?'#00E5FF':'#0A1E30'}
            style={emotion==='talking'?{animation:'eyeGlow 0.3s infinite'}:{}}/>
          {emotion==='talking'&&[0,1,2,3].map(i=>(
            <rect key={i} x={74+i*13} y={76} width="7" height="5" rx="2"
              fill="#fff" opacity="0.8"/>
          ))}
          {/* Ear panels */}
          <rect x="38" y="44" width="9" height="32" rx="4" fill="url(#rg1)" stroke="#1A2235" strokeWidth="1"/>
          <circle cx="42.5" cy="60" r="5" fill="#00E5FF22" stroke="#00E5FF" strokeWidth="1"/>
          <circle cx="42.5" cy="60" r="2" fill="#00E5FF" opacity="0.8"/>
          <rect x="153" y="44" width="9" height="32" rx="4" fill="url(#rg1)" stroke="#1A2235" strokeWidth="1"/>
          <circle cx="157.5" cy="60" r="5" fill="#00E5FF22" stroke="#00E5FF" strokeWidth="1"/>
          <circle cx="157.5" cy="60" r="2" fill="#00E5FF" opacity="0.8"/>
          {/* Helm details */}
          <line x1="42" y1="28" x2="158" y2="28" stroke="#00E5FF" strokeWidth="0.5" opacity="0.3"/>
          <line x1="42" y1="90" x2="158" y2="90" stroke="#00E5FF" strokeWidth="0.5" opacity="0.3"/>
          <rect x="72" y="10" width="56" height="4" rx="2" fill="#00E5FF22"/>
          <rect x="80" y="10" width="40" height="4" rx="2" fill="#00E5FF55"/>
        </g>

        {/* NECK */}
        <rect x="86" y="102" width="28" height="22" rx="5"
          fill="url(#rg2)" stroke="#1A2235" strokeWidth="1.5"/>
        <rect x="90" y="106" width="20" height="14" rx="3" fill="#0A1620"/>
        {[0,1,2].map(i=>(
          <rect key={i} x={92+i*5} y={110} width="3" height="6" rx="1"
            fill="#00E5FF" opacity={0.3+i*0.2}/>
        ))}

        {/* BODY */}
        <path d="M35 122 L28 145 L28 242 L42 258 L158 258 L172 242 L172 145 L165 122 Z"
          fill="url(#rg2)" stroke="#1A2235" strokeWidth="1.5"/>
        {/* Body edge lights */}
        <line x1="35" y1="122" x2="28" y2="242" stroke="#00E5FF" strokeWidth="1" opacity="0.2"/>
        <line x1="165" y1="122" x2="172" y2="242" stroke="#00E5FF" strokeWidth="1" opacity="0.2"/>
        {/* Chest panel */}
        <rect x="48" y="132" width="104" height="94" rx="7"
          fill="#040B14" stroke="#00E5FF" strokeWidth="0.5" strokeOpacity="0.3"/>
        {/* Circuit lines on chest */}
        <path d="M55 145 H80 V155 H95" stroke="#00E5FF" strokeWidth="0.8" fill="none" opacity="0.25"/>
        <path d="M145 145 H120 V155 H105" stroke="#00E5FF" strokeWidth="0.8" fill="none" opacity="0.25"/>
        <path d="M55 210 H80 V200 H95" stroke="#7B61FF" strokeWidth="0.8" fill="none" opacity="0.25"/>
        <path d="M145 210 H120 V200 H105" stroke="#7B61FF" strokeWidth="0.8" fill="none" opacity="0.25"/>
        {/* Status bars */}
        <rect x="56" y="136" width="88" height="6" rx="3" fill="#0A1E30"/>
        <rect x="56" y="136" width="66" height="6" rx="3" fill="#00E5FF" opacity="0.8"/>
        <rect x="56" y="145" width="88" height="6" rx="3" fill="#0A1E30"/>
        <rect x="56" y="145" width="44" height="6" rx="3" fill="#7B61FF" opacity="0.8"/>
        {/* Core */}
        <circle cx="100" cy="185" r="24" fill="#0A1620" stroke="#7B61FF" strokeWidth="1.5"/>
        <circle cx="100" cy="185" r="17" fill="url(#coreRG)" filter="url(#sglow)"
          style={{ animation:'coreGlow 2s ease-in-out infinite' }}/>
        <circle cx="100" cy="185" r="9" fill="#E0D0FF"/>
        <circle cx="100" cy="185" r="4" fill="#fff"/>
        {/* Core ring */}
        <circle cx="100" cy="185" r="27" fill="none" stroke="#7B61FF"
          strokeWidth="1" strokeDasharray="4 3" opacity="0.5"
          style={{ animation:'spin 8s linear infinite' }}/>
        {/* Shoulder joints */}
        <circle cx="35" cy="130" r="12" fill="#0A1620" stroke="#00E5FF" strokeWidth="1.5"/>
        <circle cx="35" cy="130" r="6" fill="#00E5FF22"/>
        <circle cx="35" cy="130" r="2.5" fill="#00E5FF"/>
        <circle cx="165" cy="130" r="12" fill="#0A1620" stroke="#00E5FF" strokeWidth="1.5"/>
        <circle cx="165" cy="130" r="6" fill="#00E5FF22"/>
        <circle cx="165" cy="130" r="2.5" fill="#00E5FF"/>

        {/* LEFT ARM */}
        <g ref={lArmRef} style={{ transformOrigin:'35px 130px', transition:'transform 0.05s' }}>
          <rect x="17" y="124" width="24" height="90" rx="9"
            fill="url(#rg2)" stroke="#1A2235" strokeWidth="1.5"/>
          <rect x="20" y="150" width="18" height="4" rx="2" fill="#00E5FF" opacity="0.35"/>
          <rect x="20" y="170" width="18" height="4" rx="2" fill="#00E5FF" opacity="0.35"/>
          <circle cx="29" cy="192" r="9" fill="#0A1620" stroke="#00E5FF" strokeWidth="1.2"/>
          <circle cx="29" cy="192" r="4" fill="#00E5FF33"/>
          <rect x="14" y="218" width="30" height="24" rx="7"
            fill="#0F1624" stroke="#1A2235" strokeWidth="1.2"/>
          {[0,1,2].map(i=>(
            <rect key={i} x={17+i*8} y={221} width="6" height="18" rx="3"
              fill="#090E1A" stroke="#1A2235" strokeWidth="0.5"/>
          ))}
        </g>

        {/* RIGHT ARM */}
        <g ref={rArmRef} style={{ transformOrigin:'165px 130px', transition:'transform 0.05s' }}>
          <rect x="159" y="124" width="24" height="90" rx="9"
            fill="url(#rg2)" stroke="#1A2235" strokeWidth="1.5"/>
          <rect x="162" y="150" width="18" height="4" rx="2" fill="#00E5FF" opacity="0.35"/>
          <rect x="162" y="170" width="18" height="4" rx="2" fill="#00E5FF" opacity="0.35"/>
          <circle cx="171" cy="192" r="9" fill="#0A1620" stroke="#00E5FF" strokeWidth="1.2"/>
          <circle cx="171" cy="192" r="4" fill="#00E5FF33"/>
          <rect x="156" y="218" width="30" height="24" rx="7"
            fill="#0F1624" stroke="#1A2235" strokeWidth="1.2"/>
          {[0,1,2].map(i=>(
            <rect key={i} x={159+i*8} y={221} width="6" height="18" rx="3"
              fill="#090E1A" stroke="#1A2235" strokeWidth="0.5"/>
          ))}
        </g>

        {/* LEGS */}
        <rect x="57" y="256" width="38" height="18" rx="6" fill="#0A1620" stroke="#1A2235" strokeWidth="1"/>
        <rect x="105" y="256" width="38" height="18" rx="6" fill="#0A1620" stroke="#1A2235" strokeWidth="1"/>
        {/* Left */}
        <rect x="54" y="272" width="44" height="72" rx="9"
          fill="url(#rg2)" stroke="#1A2235" strokeWidth="1.5"/>
        <circle cx="76" cy="312" r="9" fill="#0A1620" stroke="#00E5FF" strokeWidth="1"/>
        <rect x="56" y="278" width="40" height="4" rx="2" fill="#00E5FF" opacity="0.25"/>
        <path d="M48 344 L48 353 L98 353 L104 344 Z"
          fill="#0A1620" stroke="#00E5FF" strokeWidth="0.8" strokeOpacity="0.5"/>
        {/* Right */}
        <rect x="102" y="272" width="44" height="72" rx="9"
          fill="url(#rg2)" stroke="#1A2235" strokeWidth="1.5"/>
        <circle cx="124" cy="312" r="9" fill="#0A1620" stroke="#00E5FF" strokeWidth="1"/>
        <rect x="104" y="278" width="40" height="4" rx="2" fill="#00E5FF" opacity="0.25"/>
        <path d="M96 344 L102 353 L152 353 L152 344 Z"
          fill="#0A1620" stroke="#00E5FF" strokeWidth="0.8" strokeOpacity="0.5"/>

        {/* Floor reflection */}
        <ellipse cx="100" cy="360" rx="60" ry="7"
          fill="none" stroke="#00E5FF" strokeWidth="1" opacity="0.15"/>
      </g>

      <style>{`
        @keyframes eyeGlow {
          0%,100%{filter:brightness(1) drop-shadow(0 0 3px #00E5FF)}
          50%{filter:brightness(1.7) drop-shadow(0 0 12px #00E5FF)}
        }
        @keyframes coreGlow {
          0%,100%{filter:brightness(1)}
          50%{filter:brightness(2) drop-shadow(0 0 20px #7B61FF)}
        }
        @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
      `}</style>
    </svg>
  )
}
