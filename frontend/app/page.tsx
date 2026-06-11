
'use client'
import { useState } from 'react'
import dynamic from 'next/dynamic'
import Navbar          from '@/components/layout/Navbar'
import AvatarCompanion from '@/components/avatar/AvatarCompanion'
import CustomCursor    from '@/components/ui/CustomCursor'
import Hero     from '@/components/sections/Hero'
import Skills   from '@/components/sections/Skills'
import Projects from '@/components/sections/Projects'
import Journey  from '@/components/sections/Journey'
import About    from '@/components/sections/About'
import Github   from '@/components/sections/Github'
import Contact  from '@/components/sections/Contact'

const EntryAnimation = dynamic(
  () => import('@/components/avatar/EntryAnimation'),
  { ssr: false }
)

export default function Home() {
  const [entryDone, setEntryDone] = useState(false)

  return (
    <>
      <CustomCursor />

      {!entryDone && (
        <EntryAnimation onComplete={() => setEntryDone(true)} />
      )}

      <div style={{
        opacity: entryDone ? 1 : 0,
        transition: 'opacity 0.8s ease',
        pointerEvents: entryDone ? 'auto' : 'none',
      }}>
        <Navbar />
        <div className="snap-wrap">
          <Hero />
          <Skills />
          <Projects />
          <Journey />
          <About />
          <Github />
          <Contact />
        </div>
        <AvatarCompanion />
      </div>
    </>
  )
}
