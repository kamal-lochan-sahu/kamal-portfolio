import type { Metadata } from 'next'
import { Space_Grotesk, Inter, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import '@/styles/mobile-fixes.css'
import { LanguageProvider } from '@/contexts/LanguageContext'
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

export const metadata: Metadata = {
  metadataBase: new URL('https://kamal-portfolio-ten.vercel.app'),
  title: 'Kamal Lochan Sahu — AI & Robotics Engineer',
  description: 'I build systems that think, predict, and act — without being told twice.',
  keywords: ['AI Engineer', 'Robotics', 'Full Stack', 'ML', 'NEXUS', 'CORTEX', 'Germany'],
  authors: [{ name: 'Kamal Lochan Sahu' }],
  openGraph: {
    title: 'Kamal Lochan Sahu — AI & Robotics Engineer',
    description: 'I build systems that think, predict, and act — without being told twice.',
    url: 'https://kamal-portfolio-ten.vercel.app',
    siteName: 'Kamal Lochan Sahu',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Kamal Lochan Sahu — AI & Robotics Engineer',
    description: 'I build systems that think, predict, and act — without being told twice.',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sg.variable} ${inter.variable} ${jb.variable}`}>
      <body>
        <LanguageProvider>
          {children}
          <TerminalEgg />
          <GuidedTour />
        </LanguageProvider>
      </body>
    </html>
  )
}
