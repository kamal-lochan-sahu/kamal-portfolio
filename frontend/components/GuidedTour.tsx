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
  { id: 'skills', title: 'Skills', message: 'Here is the physics-based skills wall — move your cursor over it to watch the nodes react.' },
  { id: 'projects', title: 'Projects', message: 'These are the flagship builds — NEXUS and CORTEX lead the pack.' },
  { id: 'journey', title: 'Journey', message: "This timeline traces Kamal's path from self-taught beginnings to freelance work today." },
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
            position: 'fixed', bottom: 20, left: 20, zIndex: 50,
            padding: '8px 14px', borderRadius: 20,
            background: '#0F1624', border: '1px solid #7B61FF', color: '#7B61FF',
            fontSize: 13, cursor: 'none',
          }}
        >
          ▶ Guided Tour
        </button>
      )}

      {active && current && (
        <div
          className="tour-card"
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
            <button onClick={stop} style={{ background: 'none', border: 'none', color: '#8A93A6', cursor: 'none', fontSize: 13 }}>
              Exit
            </button>
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                onClick={prev}
                disabled={stepIndex === 0}
                style={{ padding: '6px 12px', borderRadius: 6, border: '1px solid #1A2235', background: 'transparent', color: '#C7CEDB', cursor: 'none', opacity: stepIndex === 0 ? 0.4 : 1 }}
              >
                Back
              </button>
              <button
                onClick={next}
                style={{ padding: '6px 12px', borderRadius: 6, border: 'none', background: '#7B61FF', color: '#fff', cursor: 'none' }}
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
