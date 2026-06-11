import type { NextConfig } from 'next'
import path from 'path'

const nextConfig: NextConfig = {
  // Fix Turbopack workspace root detection
  turbopack: {
    root: path.resolve(__dirname),
  } as Record<string, unknown>,
}

export default nextConfig
