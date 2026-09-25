import type { Metadata } from 'next'
import { Space_Grotesk, Inter, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import '@/styles/mobile-fixes.css'
import TerminalEgg from '@/components/TerminalEgg'
import GuidedTour from '@/components/GuidedTour'

// Variable names: --sg, --inter, --jb
// (avoids conflict with Tailwind v4 --font-* namespace)
const sg = Space_Grotesk({
  subsets: ['latin'],
  variable: '--sg',
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
})
const inter = Inter({
  subsets: ['latin'],
  variable: '--inter',
  display: 'swap',
})
const jb = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--jb',
  weight: ['400', '500'],
  display: 'swap',
})

const TITLE = 'Kamal Lochan Sahu — Custom Business Software, Automation & AI Engineer'
const DESCRIPTION = 'I build custom management systems, web/mobile apps, AI integrations and workflow automation for businesses. Full-stack & ML/AI engineer based in India, working with clients worldwide.'

export const metadata: Metadata = {
  metadataBase: new URL('https://kamal-portfolio-ten.vercel.app'),
  title: TITLE,
  description: DESCRIPTION,
  keywords: ['business software', 'management system development', 'workflow automation', 'AI integration', 'full-stack developer India', 'custom software'],
  authors: [{ name: 'Kamal Lochan Sahu' }],
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: 'https://kamal-portfolio-ten.vercel.app',
    siteName: 'Kamal Lochan Sahu',
    locale: 'en_US',
    type: 'website',
    images: ['/opengraph-image'],
  },
  twitter: {
    card: 'summary',
    title: TITLE,
    description: DESCRIPTION,
  },
}

const PERSON_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Kamal Lochan Sahu',
  jobTitle: 'Full-Stack & ML/AI Engineer',
  description: DESCRIPTION,
  url: 'https://kamal-portfolio-ten.vercel.app',
  sameAs: [
    'https://github.com/kamal-lochan-sahu',
    'https://linkedin.com/in/kamallochansahu',
  ],
  knowsAbout: [
    'Custom business software', 'Workflow automation', 'AI integration',
    'Full-stack web development', 'Machine learning',
  ],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sg.variable} ${inter.variable} ${jb.variable}`}>
      <body>
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(PERSON_JSON_LD) }}
        />
        {children}
        <TerminalEgg />
        <GuidedTour />
      </body>
    </html>
  )
}
