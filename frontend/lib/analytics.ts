export const GA_MEASUREMENT_ID = 'G-1L42X3LPJG'

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
  }
}

/**
 * Fire a GA4 custom event. Safe to call even before gtag has loaded (e.g.
 * ad blockers, slow network) — it just silently no-ops.
 */
export function trackEvent(name: string, params: Record<string, unknown> = {}) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', name, params)
  }
}
