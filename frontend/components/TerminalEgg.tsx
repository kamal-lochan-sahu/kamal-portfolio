'use client';
import { useEffect, useState, useRef } from 'react';
import { playSound } from '@/lib/sounds';

const COMMANDS: Record<string, string> = {
  help: 'Available: help, whoami, skills, projects, contact, sudo, clear, exit',
  whoami: 'Kamal Lochan Sahu — Full-Stack & ML/AI Engineer (Business Software, Automation, AI)',
  skills: 'React . Node.js . Python/ML . AWS . FastAPI . MongoDB',
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
