#!/usr/bin/env python3
"""
add_remaining_features.py
Run this from anywhere. It expects your project at ~/projects/kamal-portfolio/
(edit PROJECT_ROOT below if yours is different).

Adds:
  1. Terminal Easter Egg (Ctrl+`)
  2. Sound Design (Howler.js)
  3. Guided Tour Mode
  4. DE/EN Language Toggle
  5. GSAP ScrollTrigger reveal animations
  6. Mobile responsive CSS fixes
  7. TODO markers for project URLs + GitHub token (manual step, listed at the end)

Usage:
    python3 add_remaining_features.py
"""

import os
import subprocess
import sys

HOME = os.path.expanduser("~")
PROJECT_ROOT = os.path.join(HOME, "projects", "kamal-portfolio")
FRONTEND = os.path.join(PROJECT_ROOT, "frontend")
SRC = os.path.join(FRONTEND, "src")
COMPONENTS = os.path.join(SRC, "components")
LIB = os.path.join(SRC, "lib")
CONTEXTS = os.path.join(SRC, "contexts")
PUBLIC_SOUNDS = os.path.join(FRONTEND, "public", "sounds")


def write_file(path, content):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "w", encoding="utf-8") as f:
        f.write(content)
    print(f"  ✓ {path.replace(HOME, '~')}")


def check_project():
    if not os.path.isdir(FRONTEND):
        print(f"ERROR: {FRONTEND} not found.")
        print("Edit PROJECT_ROOT at the top of this script to point to your repo.")
        sys.exit(1)


def npm_install(packages):
    print(f"\n📦 Installing: {' '.join(packages)}")
    try:
        subprocess.run(["npm", "install"] + packages, cwd=FRONTEND, check=True)
    except Exception as e:
        print(f"  ⚠ npm install failed automatically ({e}). Run manually:")
        print(f"    cd {FRONTEND} && npm install {' '.join(packages)}")


# ---------------------------------------------------------------------------
# 1. TERMINAL EASTER EGG
# ---------------------------------------------------------------------------
TERMINAL_EGG = '''\
'use client';
import { useEffect, useState, useRef } from 'react';
import { playSound } from '@/lib/sounds';

const COMMANDS: Record<string, string> = {
  help: 'Available: help, whoami, skills, projects, contact, sudo, clear, exit',
  whoami: 'Kamal Lochan Sahu — Full-Stack Dev -> Robotics AI Engineer (Germany track)',
  skills: 'React . Node.js . Python/ML . AWS . FastAPI . C1 German',
  projects: 'NEXUS . CORTEX . BioSignal . GridSense . EarthWatch . TruthLens . CropSense',
  contact: 'Scroll to the Contact section, or type: open contact',
  sudo: 'Nice try. Permission denied: you are not root here.',
};

export default function TerminalEgg() {
  const [open, setOpen] = useState(false);
  const [lines, setLines] = useState<string[]>(['Type "help" to get started.']);
  const [input, setInput] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === '`') {
        e.preventDefault();
        setOpen((o) => !o);
        playSound('click');
      }
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 50);
  }, [open]);

  const runCommand = (cmd: string) => {
    const trimmed = cmd.trim().toLowerCase();
    if (!trimmed) return;
    if (trimmed === 'clear') return setLines([]);
    if (trimmed === 'exit') return setOpen(false);
    if (trimmed === 'open contact') {
      document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
      setOpen(false);
      return;
    }
    const output = COMMANDS[trimmed] ?? `command not found: ${trimmed}`;
    setLines((l) => [...l, `> ${cmd}`, output]);
  };

  if (!open) return null;

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: 'rgba(9,14,26,0.92)', backdropFilter: 'blur(4px)',
        display: 'flex', alignItems: 'flex-start', justifyContent: 'center', paddingTop: '10vh',
      }}
      onClick={() => setOpen(false)}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: 'min(700px, 90vw)', background: '#0F1624', border: '1px solid #1A2235',
          borderRadius: 8, padding: 16, fontFamily: 'JetBrains Mono, monospace',
          fontSize: 14, color: '#00E5FF', boxShadow: '0 0 40px rgba(0,229,255,0.15)',
        }}
      >
        <div style={{ maxHeight: 300, overflowY: 'auto', marginBottom: 8 }}>
          {lines.map((l, i) => (
            <div key={i} style={{ whiteSpace: 'pre-wrap', color: l.startsWith('>') ? '#7B61FF' : '#00E5FF' }}>
              {l}
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          <span>{'>'}</span>
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                runCommand(input);
                setInput('');
              }
            }}
            style={{ background: 'transparent', border: 'none', outline: 'none', color: '#fff', flex: 1, fontFamily: 'inherit' }}
            autoComplete="off"
            spellCheck={false}
          />
        </div>
      </div>
    </div>
  );
}
'''

# ---------------------------------------------------------------------------
# 2. SOUND DESIGN (Howler.js)
# ---------------------------------------------------------------------------
SOUNDS_LIB = '''\
import { Howl } from 'howler';

type SoundName = 'click' | 'hover' | 'success' | 'boot' | 'open' | 'close';

let muted = false;
let sounds: Record<SoundName, Howl> | null = null;

function getSounds(): Record<SoundName, Howl> {
  if (!sounds) {
    sounds = {
      click: new Howl({ src: ['/sounds/click.mp3'], volume: 0.3 }),
      hover: new Howl({ src: ['/sounds/hover.mp3'], volume: 0.12 }),
      success: new Howl({ src: ['/sounds/success.mp3'], volume: 0.4 }),
      boot: new Howl({ src: ['/sounds/boot.mp3'], volume: 0.3 }),
      open: new Howl({ src: ['/sounds/open.mp3'], volume: 0.25 }),
      close: new Howl({ src: ['/sounds/close.mp3'], volume: 0.25 }),
    };
  }
  return sounds;
}

export function playSound(name: SoundName) {
  if (muted) return;
  try {
    getSounds()[name]?.play();
  } catch {
    // ignore if file missing — non-fatal
  }
}

export function toggleMute(): boolean {
  muted = !muted;
  return muted;
}

export function isMuted() {
  return muted;
}
'''

SOUND_TOGGLE = '''\
'use client';
import { useState } from 'react';
import { toggleMute } from '@/lib/sounds';

export default function SoundToggle() {
  const [muted, setMuted] = useState(false);

  return (
    <button
      onClick={() => setMuted(toggleMute())}
      aria-label={muted ? 'Unmute sounds' : 'Mute sounds'}
      style={{
        position: 'fixed', bottom: 20, left: 20, zIndex: 50,
        width: 40, height: 40, borderRadius: '50%',
        background: '#0F1624', border: '1px solid #1A2235', color: '#00E5FF',
        cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}
    >
      {muted ? '🔇' : '🔊'}
    </button>
  );
}
'''

README_SOUNDS = '''\
Drop these short mp3 files here (all under ~1s except boot which can be ~2s):

  click.mp3    - UI click / button press
  hover.mp3    - Subtle hover tick
  success.mp3  - AI response / form success
  boot.mp3     - Terminal boot sequence
  open.mp3     - Modal opening
  close.mp3    - Modal closing

Free sources: freesound.org, mixkit.co/free-sound-effects, zapsplat.com
Keep each file small (<50kb) for fast loads.
'''

# ---------------------------------------------------------------------------
# 3. GUIDED TOUR MODE
# ---------------------------------------------------------------------------
GUIDED_TOUR = '''\
'use client';
import { useState, useEffect, useCallback } from 'react';
import { playSound } from '@/lib/sounds';

interface TourStep {
  id: string;
  title: string;
  message: string;
}

const TOUR_STEPS: TourStep[] = [
  { id: 'hero', title: 'Welcome', message: "Hey, I'm Kamal's assistant. Let me show you around." },
  { id: 'skills', title: 'Skills', message: 'Here is the physics-based skills wall — drag the nodes around.' },
  { id: 'projects', title: 'Projects', message: 'These are the flagship builds — NEXUS and CORTEX lead the pack.' },
  { id: 'journey', title: 'Journey', message: "This timeline traces Kamal's path toward Robotics AI in Germany." },
  { id: 'about', title: 'About', message: 'A bit more about who Kamal is and how he works.' },
  { id: 'github', title: 'GitHub Activity', message: 'Live contribution activity, pulled straight from GitHub.' },
  { id: 'contact', title: 'Contact', message: "That's the tour! Feel free to reach out from here." },
];

export default function GuidedTour() {
  const [active, setActive] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);

  const goToStep = useCallback((index: number) => {
    const step = TOUR_STEPS[index];
    if (!step) return;
    const el = document.getElementById(step.id);
    el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    setStepIndex(index);
    playSound('open');
  }, []);

  const start = () => {
    setActive(true);
    goToStep(0);
  };

  const next = () => {
    if (stepIndex + 1 < TOUR_STEPS.length) goToStep(stepIndex + 1);
    else stop();
  };

  const prev = () => {
    if (stepIndex > 0) goToStep(stepIndex - 1);
  };

  const stop = () => {
    setActive(false);
    playSound('close');
  };

  useEffect(() => {
    if (!active) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') stop();
      if (e.key === 'ArrowRight') next();
      if (e.key === 'ArrowLeft') prev();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, stepIndex]);

  const current = TOUR_STEPS[stepIndex];

  return (
    <>
      {!active && (
        <button
          onClick={start}
          style={{
            position: 'fixed', bottom: 20, right: 90, zIndex: 50,
            padding: '8px 14px', borderRadius: 20,
            background: '#0F1624', border: '1px solid #7B61FF', color: '#7B61FF',
            fontSize: 13, cursor: 'pointer',
          }}
        >
          ▶ Guided Tour
        </button>
      )}

      {active && current && (
        <div
          style={{
            position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)',
            zIndex: 9998, width: 'min(420px, 90vw)',
            background: '#0F1624', border: '1px solid #1A2235', borderRadius: 12,
            padding: 16, boxShadow: '0 0 30px rgba(123,97,255,0.2)',
          }}
        >
          <div style={{ fontFamily: 'Space Grotesk, sans-serif', color: '#00E5FF', fontWeight: 600, marginBottom: 4 }}>
            {current.title} <span style={{ color: '#8A93A6', fontWeight: 400, fontSize: 12 }}>({stepIndex + 1}/{TOUR_STEPS.length})</span>
          </div>
          <div style={{ color: '#C7CEDB', fontSize: 14, marginBottom: 12 }}>{current.message}</div>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
            <button onClick={stop} style={{ background: 'none', border: 'none', color: '#8A93A6', cursor: 'pointer', fontSize: 13 }}>
              Exit
            </button>
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                onClick={prev}
                disabled={stepIndex === 0}
                style={{ padding: '6px 12px', borderRadius: 6, border: '1px solid #1A2235', background: 'transparent', color: '#C7CEDB', cursor: 'pointer', opacity: stepIndex === 0 ? 0.4 : 1 }}
              >
                Back
              </button>
              <button
                onClick={next}
                style={{ padding: '6px 12px', borderRadius: 6, border: 'none', background: '#7B61FF', color: '#fff', cursor: 'pointer' }}
              >
                {stepIndex + 1 === TOUR_STEPS.length ? 'Finish' : 'Next'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
'''

# ---------------------------------------------------------------------------
# 4. DE/EN LANGUAGE TOGGLE
# ---------------------------------------------------------------------------
LANGUAGE_CONTEXT = '''\
'use client';
import { createContext, useContext, useState, ReactNode } from 'react';

export type Lang = 'en' | 'de';

const translations = {
  en: {
    heroTagline: 'Building the brain of robotic systems.',
    skillsTitle: 'Skills',
    projectsTitle: 'Projects',
    journeyTitle: 'Journey',
    aboutTitle: 'About',
    contactTitle: 'Contact',
    contactCta: "Let's build something.",
  },
  de: {
    heroTagline: 'Ich baue das Gehirn robotischer Systeme.',
    skillsTitle: 'Fähigkeiten',
    projectsTitle: 'Projekte',
    journeyTitle: 'Werdegang',
    aboutTitle: 'Über mich',
    contactTitle: 'Kontakt',
    contactCta: 'Lass uns etwas bauen.',
  },
} as const;

export type TranslationKey = keyof typeof translations['en'];

interface LanguageContextValue {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: TranslationKey) => string;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>('en');
  const t = (key: TranslationKey) => translations[lang][key];
  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used inside LanguageProvider');
  return ctx;
}
'''

LANGUAGE_TOGGLE_COMPONENT = '''\
'use client';
import { useLanguage } from '@/contexts/LanguageContext';
import { playSound } from '@/lib/sounds';

export default function LanguageToggle() {
  const { lang, setLang } = useLanguage();

  return (
    <button
      onClick={() => {
        setLang(lang === 'en' ? 'de' : 'en');
        playSound('click');
      }}
      style={{
        position: 'fixed', top: 20, right: 20, zIndex: 50,
        padding: '6px 12px', borderRadius: 20,
        background: '#0F1624', border: '1px solid #1A2235', color: '#00E5FF',
        fontSize: 13, cursor: 'pointer', fontFamily: 'JetBrains Mono, monospace',
      }}
      aria-label="Toggle language"
    >
      {lang === 'en' ? 'DE' : 'EN'}
    </button>
  );
}
'''

# ---------------------------------------------------------------------------
# 5. GSAP SCROLLTRIGGER REVEAL
# ---------------------------------------------------------------------------
SCROLL_REVEAL = '''\
'use client';
import { useEffect, useRef, ReactNode } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface ScrollRevealProps {
  children: ReactNode;
  y?: number;
  duration?: number;
  delay?: number;
  className?: string;
}

export default function ScrollReveal({ children, y = 40, duration = 0.8, delay = 0, className }: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { opacity: 0, y },
        {
          opacity: 1,
          y: 0,
          duration,
          delay,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }, el);

    return () => ctx.revert();
  }, [y, duration, delay]);

  return <div ref={ref} className={className}>{children}</div>;
}
'''

# ---------------------------------------------------------------------------
# 6. MOBILE RESPONSIVE FIXES
# ---------------------------------------------------------------------------
MOBILE_CSS = '''\
/* Mobile responsive fixes — import this AFTER your main globals.css */

@media (max-width: 768px) {
  /* Prevent horizontal scroll from oversized decorative elements */
  html, body {
    overflow-x: hidden;
    width: 100%;
  }

  /* Scale down hero heading so it never wraps awkwardly */
  .hero-heading {
    font-size: clamp(1.8rem, 8vw, 2.6rem) !important;
    line-height: 1.15 !important;
  }

  /* Stack skills wall / physics canvas to full width, shorter height */
  .skills-wall-canvas {
    height: 320px !important;
  }

  /* Project tabs: allow horizontal scroll instead of squeezing */
  .project-tabs {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    flex-wrap: nowrap !important;
  }

  /* Tilt cards: disable heavy 3D tilt on touch devices (perf + no hover) */
  .tilt-card {
    transform: none !important;
  }

  /* Custom cursor: hide on touch devices, browsers show native cursor anyway */
  .custom-cursor,
  .custom-cursor-ring {
    display: none !important;
  }

  /* Avatar companion: shrink and move to avoid overlapping content */
  .avatar-companion {
    width: 48px !important;
    height: 48px !important;
    bottom: 12px !important;
    right: 12px !important;
  }

  /* Modals: full-width sheets instead of centered boxes */
  .ai-modal {
    width: 100vw !important;
    max-width: 100vw !important;
    height: 100vh !important;
    max-height: 100vh !important;
    border-radius: 0 !important;
    top: 0 !important;
    left: 0 !important;
    transform: none !important;
  }

  /* Timeline: switch from side-by-side to single column */
  .journey-timeline {
    flex-direction: column !important;
  }
  .journey-timeline .timeline-item {
    width: 100% !important;
    padding-left: 24px !important;
  }

  /* Guided tour card: keep inset from edges on small screens */
  .tour-card {
    width: calc(100vw - 24px) !important;
    left: 12px !important;
    right: 12px !important;
    transform: none !important;
  }

  /* Sound + language toggles: shrink and reposition to avoid stacking */
  .sound-toggle {
    bottom: 12px !important;
    left: 12px !important;
    width: 36px !important;
    height: 36px !important;
  }
  .language-toggle {
    top: 12px !important;
    right: 12px !important;
    padding: 4px 10px !important;
  }
}

@media (max-width: 400px) {
  /* Extra-small phones: further reduce heading and section padding */
  .hero-heading {
    font-size: clamp(1.5rem, 9vw, 2rem) !important;
  }
  section {
    padding-left: 16px !important;
    padding-right: 16px !important;
  }
}
'''

FILES = {
    os.path.join(COMPONENTS, "TerminalEgg.tsx"): TERMINAL_EGG,
    os.path.join(LIB, "sounds.ts"): SOUNDS_LIB,
    os.path.join(COMPONENTS, "SoundToggle.tsx"): SOUND_TOGGLE,
    os.path.join(PUBLIC_SOUNDS, "README.txt"): README_SOUNDS,
    os.path.join(COMPONENTS, "GuidedTour.tsx"): GUIDED_TOUR,
    os.path.join(CONTEXTS, "LanguageContext.tsx"): LANGUAGE_CONTEXT,
    os.path.join(COMPONENTS, "LanguageToggle.tsx"): LANGUAGE_TOGGLE_COMPONENT,
    os.path.join(COMPONENTS, "ScrollReveal.tsx"): SCROLL_REVEAL,
    os.path.join(SRC, "styles", "mobile-fixes.css"): MOBILE_CSS,
}


def main():
    check_project()
    print(f"Project found at: {FRONTEND}\n")

    print("Writing files...")
    for path, content in FILES.items():
        write_file(path, content)

    npm_install(["howler", "gsap"])
    npm_install(["-D", "@types/howler"])

    print("\n" + "=" * 60)
    print("DONE. Manual wiring steps (2 minutes):")
    print("=" * 60)
    print('''
1. In frontend/src/app/layout.tsx:
   - Wrap {children} with <LanguageProvider>...</LanguageProvider>
     (import from '@/contexts/LanguageContext')
   - Add these components inside <body>, after {children}:
       <TerminalEgg />
       <SoundToggle />
       <GuidedTour />
   - Add <LanguageToggle /> as well (place it near your nav/header)
   - Import '@/styles/mobile-fixes.css' at the bottom of your
     globals.css import chain (so it overrides, not gets overridden)

2. Add class names to existing elements so mobile-fixes.css can target
   them (only if not already present):
     hero-heading, skills-wall-canvas, project-tabs, tilt-card,
     custom-cursor, custom-cursor-ring, avatar-companion, ai-modal,
     journey-timeline + timeline-item, tour-card, sound-toggle,
     language-toggle

3. Wrap section content you want to fade in on scroll with:
     <ScrollReveal><YourSection /></ScrollReveal>

4. Drop 6 short mp3s into frontend/public/sounds/
   (see frontend/public/sounds/README.txt for the list + free sources)

5. STILL MANUAL (needs your real data, not scripted):
   - Update project live URLs in constants.ts (replace # placeholders)
   - Add a GitHub personal access token to backend/.env as
     GITHUB_TOKEN=ghp_xxx and wire it into whatever endpoint fetches
     follower/contribution stats (currently returns 0)

6. Test locally:
     cd frontend && npm run dev
   Then Ctrl+` for terminal, click the tour button bottom-right,
   DE/EN toggle top-right, sound icon bottom-left.

7. Deploy:
     git add . && git commit -m "add terminal egg, sounds, guided tour,
     language toggle, scroll reveal, mobile fixes" && git push
''')


if __name__ == "__main__":
    main()
