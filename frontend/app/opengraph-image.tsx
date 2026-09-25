import { ImageResponse } from 'next/og'

export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%', height: '100%', display: 'flex', flexDirection: 'column',
          justifyContent: 'center', padding: '80px',
          background: '#090E1A', color: '#F5F5F5',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 28 }}>
          <div style={{ width: 14, height: 14, borderRadius: '50%', background: '#00E5FF' }} />
          <span style={{ fontSize: 28, color: '#00E5FF', letterSpacing: 4 }}>KAMAL LOCHAN SAHU</span>
        </div>
        <div style={{ fontSize: 56, fontWeight: 700, lineHeight: 1.15, maxWidth: 980 }}>
          Custom Business Software, Automation &amp; AI Engineer
        </div>
        <div style={{ fontSize: 28, color: '#8892B0', marginTop: 28 }}>
          Full-stack &amp; ML/AI — working with clients worldwide
        </div>
      </div>
    ),
    { ...size }
  )
}
