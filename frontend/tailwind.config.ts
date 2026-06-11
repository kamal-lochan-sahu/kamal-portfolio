// Tailwind v4: theme config is in app/globals.css using @theme {}
// This file only needed for content paths (v4 auto-detects anyway)
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
}
export default config
