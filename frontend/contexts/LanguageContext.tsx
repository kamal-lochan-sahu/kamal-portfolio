'use client';
import { createContext, useContext, useState, ReactNode } from 'react';

export type Lang = 'en' | 'de';

const translations = {
  en: {
    // Hero
    heroGreeting: '>_ Namaste, I\'m',
    heroLead: 'I build systems that',
    heroThink: 'think',
    heroPredict: 'predict',
    heroAct: 'act',
    heroTail: '— without being told twice.',
    heroSubLine: 'Full Stack & ML Engineer · AI · Robotics · Autonomous Systems',
    viewWork: 'View My Work ↓',
    hireMe: 'Hire Me',
    currentlyBuilding: 'Currently building:',
    currentlyBuildingDesc: '— Autonomous Factory AI',

    // Skills
    skillsEyebrow: '— SKILLS —',
    skillsHeading: 'Skill Wall',
    skillsSubtitlePrefix: 'Hover to repel ·',
    skillsTechnologies: 'technologies',

    // Projects
    projectsEyebrow: '— PROJECTS —',
    projectsHeading: 'My Work',
    tabFlagship: '⭐ Flagship',
    tabAI: '🧠 AI Systems',
    tabProduction: '💼 Production',
    flagshipBadge: '★ FLAGSHIP',
    githubBtn: 'GitHub →',
    liveDemo: 'Live Demo ↗',
    comingSoon: 'Coming Soon',
    videoDemo: 'Video Demo',

    // Journey
    journeyEyebrow: '— JOURNEY —',
    journeyHeadingPrefix: 'Berhampur →',
    journeyHeadingHighlight: 'Germany',

    // About
    aboutEyebrow: '— ABOUT —',
    aboutWhoIs: 'Who is',
    aboutBio1: 'I\'m a 22-year-old self-taught engineer from Berhampur, Odisha, India. Since 2021, I chose disciplined self-learning over a traditional degree — mastering full-stack development, AI/ML, and robotics through building real production systems.',
    aboutBio2: 'I build systems that solve real problems — from predicting crop yields for 140M farmers to autonomous factory intelligence with 6 AI agents. My goal: FIAE Ausbildung in Germany by 2027, on the path to becoming a Senior Robotics AI Engineer.',
    highlightSystems: 'Production Systems',
    highlightSelfLearning: 'Self-Learning',
    highlightProjects: 'AI/ML Projects',
    highlightAge: 'Years Old',
    certificationsLabel: 'CERTIFICATIONS',
    languagesLabel: 'LANGUAGES',
    openToRelocate: '→ Open to relocate: Germany 🇩🇪 (2027)',

    // Github section
    githubEyebrow: '— GITHUB —',
    githubHeadingLead: 'Always',
    githubHeadingHighlight: 'Building',
    statRepos: 'Repositories',
    statFollowers: 'Followers',
    statFollowing: 'Following',
    loadingGithub: 'Loading GitHub data...',

    // Contact
    contactEyebrow: '— CONTACT —',
    contactHeading1: "Let's Build",
    contactHeading2: 'Something',
    contactBlurb: 'Open to FIAE Ausbildung, freelance projects, and full-time roles. Based in Berhampur, India — relocating to Germany 2027.',
    hireMeEmail: '✉️  Hire Me — Send Email',
    footerBuiltWith: 'Built with Next.js · Framer Motion · FastAPI · Gemini AI',
  },
  de: {
    // Hero
    heroGreeting: '>_ Namaste, ich bin',
    heroLead: 'Ich baue Systeme, die',
    heroThink: 'denken',
    heroPredict: 'vorhersagen',
    heroAct: 'handeln',
    heroTail: '— ohne es zweimal sagen zu müssen.',
    heroSubLine: 'Full-Stack- & ML-Ingenieur · KI · Robotik · Autonome Systeme',
    viewWork: 'Meine Arbeit ansehen ↓',
    hireMe: 'Kontaktieren',
    currentlyBuilding: 'Aktuell im Bau:',
    currentlyBuildingDesc: '— Autonome Fabrik-KI',

    // Skills
    skillsEyebrow: '— FÄHIGKEITEN —',
    skillsHeading: 'Skill Wall',
    skillsSubtitlePrefix: 'Bewegen zum Abstoßen ·',
    skillsTechnologies: 'Technologien',

    // Projects
    projectsEyebrow: '— PROJEKTE —',
    projectsHeading: 'Meine Arbeit',
    tabFlagship: '⭐ Aushängeschild',
    tabAI: '🧠 KI-Systeme',
    tabProduction: '💼 Produktion',
    flagshipBadge: '★ AUSHÄNGESCHILD',
    githubBtn: 'GitHub →',
    liveDemo: 'Live-Demo ↗',
    comingSoon: 'Demnächst',
    videoDemo: 'Video-Demo',

    // Journey
    journeyEyebrow: '— WERDEGANG —',
    journeyHeadingPrefix: 'Berhampur →',
    journeyHeadingHighlight: 'Deutschland',

    // About
    aboutEyebrow: '— ÜBER MICH —',
    aboutWhoIs: 'Wer ist',
    aboutBio1: 'Ich bin ein 22-jähriger autodidaktischer Ingenieur aus Berhampur, Odisha, Indien. Seit 2021 habe ich mich für diszipliniertes Selbststudium statt eines klassischen Studiums entschieden — und Full-Stack-Entwicklung, KI/ML und Robotik durch den Bau echter Produktionssysteme gemeistert.',
    aboutBio2: 'Ich baue Systeme, die reale Probleme lösen — von der Vorhersage von Ernteerträgen für 140 Millionen Landwirte bis hin zu autonomer Fabrikintelligenz mit 6 KI-Agenten. Mein Ziel: FIAE-Ausbildung in Deutschland bis 2027, auf dem Weg zum Senior Robotics AI Engineer.',
    highlightSystems: 'Produktionssysteme',
    highlightSelfLearning: 'Selbststudium',
    highlightProjects: 'KI/ML-Projekte',
    highlightAge: 'Jahre alt',
    certificationsLabel: 'ZERTIFIKATE',
    languagesLabel: 'SPRACHEN',
    openToRelocate: '→ Bereit zum Umzug: Deutschland 🇩🇪 (2027)',

    // Github section
    githubEyebrow: '— GITHUB —',
    githubHeadingLead: 'Immer am',
    githubHeadingHighlight: 'Bauen',
    statRepos: 'Repositories',
    statFollowers: 'Follower',
    statFollowing: 'Folge ich',
    loadingGithub: 'GitHub-Daten werden geladen...',

    // Contact
    contactEyebrow: '— KONTAKT —',
    contactHeading1: 'Lass uns etwas',
    contactHeading2: 'bauen',
    contactBlurb: 'Offen für FIAE-Ausbildung, Freelance-Projekte und Festanstellungen. Ansässig in Berhampur, Indien — Umzug nach Deutschland 2027.',
    hireMeEmail: '✉️  Kontaktieren — E-Mail senden',
    footerBuiltWith: 'Erstellt mit Next.js · Framer Motion · FastAPI · Gemini AI',
  },
} as const;

export type TranslationKey = keyof typeof translations['en'];

// Per-project tagline overrides (id -> German text). Everything else about a
// project (tags, metric, links, stack names) stays in English since those
// are proper nouns / tech terms that don't meaningfully translate.
export const PROJECT_TAGLINE_DE: Record<string, string> = {
  nexus: 'Wo Mensch und Roboter wirklich zusammenarbeiten.',
  cortex: 'Sechs KI-Köpfe. Ein Fabrikgehirn.',
  biosignal: 'Sechs Stunden früher. Der Unterschied zwischen Leben und Tod.',
  gridsense: 'Das Netz vorhersagen, bevor es ausfällt.',
  earthwatch: 'Der Planet sendet Signale. EarthWatch hört zu.',
  truthlens: 'Falschmeldungen verstecken sich in Text UND Bildern. TruthLens erkennt beides.',
  cropsense: 'Dem Boden sagen, was er anbauen soll — bevor du auch nur ein Samenkorn pflanzt.',
};

// Per-milestone translations (matched by index, same order as Journey.tsx's
// MILESTONES array).
export const MILESTONES_DE: { title: string; sub: string }[] = [
  { title: 'Klasse 10 — Bester im Bezirk', sub: 'Starke mathematische Grundlage · 81,3%' },
  { title: 'Klasse 12 — Naturwissenschaften', sub: 'Höhere Sekundarstufe · 80% · Puri, Odisha' },
  { title: 'Selbststudium beginnt', sub: 'Praktisches Lernen statt traditionellem Studium gewählt' },
  { title: 'Unabhängiger Entwickler', sub: 'Erste Produktionssysteme · Open-Source-Beiträge' },
  { title: 'AWS Cloud Practitioner', sub: 'Zertifiziert · Cloud-Architektur-Expertise' },
  { title: 'Freelance — 10+ Systeme geliefert', sub: 'E-Commerce · Gesundheitswesen · Bildung · Einzelhandel' },
  { title: 'NEXUS + CORTEX', sub: 'Industrie-5.0-Robotik + Autonome Fabrik-KI' },
  { title: 'Goethe C1 Deutsch', sub: 'Portfolio fertig · Bewerbungen beginnen' },
  { title: 'FIAE-Ausbildung — Deutschland 🇩🇪', sub: 'IT & Robotik · Fachinformatiker Anwendungsentwicklung' },
];

interface LanguageContextValue {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: TranslationKey) => string;
  tProjectTagline: (id: string, fallback: string) => string;
  tMilestone: (index: number, fallback: { title: string; sub: string }) => { title: string; sub: string };
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>('en');
  const t = (key: TranslationKey) => translations[lang][key];
  const tProjectTagline = (id: string, fallback: string) =>
    lang === 'de' ? (PROJECT_TAGLINE_DE[id] ?? fallback) : fallback;
  const tMilestone = (index: number, fallback: { title: string; sub: string }) =>
    lang === 'de' ? (MILESTONES_DE[index] ?? fallback) : fallback;

  return (
    <LanguageContext.Provider value={{ lang, setLang, t, tProjectTagline, tMilestone }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used inside LanguageProvider');
  return ctx;
}
