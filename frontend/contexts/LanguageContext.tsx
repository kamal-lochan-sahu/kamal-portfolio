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
