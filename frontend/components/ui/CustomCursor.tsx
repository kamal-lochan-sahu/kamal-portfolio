
'use client'
import { useEffect, useRef, useState } from 'react'

export default function CustomCursor() {
  const dotRef   = useRef<HTMLDivElement>(null)
  const ringRef  = useRef<HTMLDivElement>(null)
  const [hovered, setHovered] = useState(false)
  const [clicked, setClicked] = useState(false)
  const pos = useRef({ x: 0, y: 0 })
  const ring = useRef({ x: 0, y: 0 })
  const raf  = useRef(0)

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      pos.current = { x: e.clientX, y: e.clientY }
      if (dotRef.current) {
        dotRef.current.style.left = e.clientX + 'px'
        dotRef.current.style.top  = e.clientY + 'px'
      }
    }

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t
    const loop = () => {
      ring.current.x = lerp(ring.current.x, pos.current.x, 0.12)
      ring.current.y = lerp(ring.current.y, pos.current.y, 0.12)
      if (ringRef.current) {
        ringRef.current.style.left = ring.current.x + 'px'
        ringRef.current.style.top  = ring.current.y + 'px'
      }
      raf.current = requestAnimationFrame(loop)
    }
    loop()

    const onEnter = () => setHovered(true)
    const onLeave = () => setHovered(false)
    const onClick = () => { setClicked(true); setTimeout(() => setClicked(false), 400) }

    document.addEventListener('mousemove', onMove)
    document.addEventListener('click', onClick)
    document.querySelectorAll('a,button,[data-hover]').forEach(el => {
      el.addEventListener('mouseenter', onEnter)
      el.addEventListener('mouseleave', onLeave)
    })

    // Re-attach on DOM changes
    const obs = new MutationObserver(() => {
      document.querySelectorAll('a,button,[data-hover]').forEach(el => {
        el.addEventListener('mouseenter', onEnter)
        el.addEventListener('mouseleave', onLeave)
      })
    })
    obs.observe(document.body, { childList: true, subtree: true })

    return () => {
      cancelAnimationFrame(raf.current)
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('click', onClick)
      obs.disconnect()
    }
  }, [])

  return (
    <>
      {/* Inner dot */}
      <div ref={dotRef} style={{
        position: 'fixed', zIndex: 9999, pointerEvents: 'none',
        width: hovered ? 8 : 6, height: hovered ? 8 : 6,
        background: hovered ? '#7B61FF' : '#00E5FF',
        borderRadius: '50%',
        transform: 'translate(-50%,-50%)',
        transition: 'width 0.2s, height 0.2s, background 0.2s',
        boxShadow: `0 0 ${hovered ? 12 : 6}px ${hovered ? '#7B61FF' : '#00E5FF'}`,
      }} />

      {/* Outer ring */}
      <div ref={ringRef} style={{
        position: 'fixed', zIndex: 9998, pointerEvents: 'none',
        width: hovered ? 48 : 32, height: hovered ? 48 : 32,
        border: `1.5px solid ${hovered ? 'rgba(123,97,255,0.7)' : 'rgba(0,229,255,0.5)'}`,
        borderRadius: '50%',
        transform: 'translate(-50%,-50%)',
        transition: 'width 0.3s, height 0.3s, border-color 0.3s',
      }} />

      {/* Click ripple */}
      {clicked && (
        <div style={{
          position: 'fixed', zIndex: 9997, pointerEvents: 'none',
          left: pos.current.x, top: pos.current.y,
          width: 40, height: 40,
          border: '1px solid rgba(0,229,255,0.6)',
          borderRadius: '50%',
          transform: 'translate(-50%,-50%)',
          animation: 'ripple 0.4s ease-out forwards',
        }} />
      )}
    </>
  )
}
