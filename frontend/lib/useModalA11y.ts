'use client'
import { useEffect, useRef } from 'react'

/**
 * Basic modal accessibility: Escape closes, Tab is trapped inside the
 * modal, focus moves in on open and returns to the trigger on close.
 * Attach the returned ref to the modal's outer focusable container.
 */
export function useModalA11y<T extends HTMLElement>(open: boolean, onClose: () => void) {
  const ref = useRef<T>(null)
  const prevFocus = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (!open) return
    prevFocus.current = document.activeElement as HTMLElement | null

    const getFocusable = (): HTMLElement[] => {
      const all = ref.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), textarea, input:not([disabled]), select, [tabindex]:not([tabindex="-1"])'
      )
      if (!all) return []
      // querySelectorAll matches elements inside display:none subtrees too
      // (e.g. the two inactive AI-dock tabs) — those can never actually
      // receive focus, so including them breaks first/last wrap-around.
      // offsetParent is null for display:none (and for position:fixed in
      // some browsers), so we also accept anything with a non-empty
      // client rect as a fallback.
      return Array.from(all).filter(el => el.offsetParent !== null || el.getClientRects().length > 0)
    }

    const t = setTimeout(() => getFocusable()[0]?.focus(), 0)

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { onClose(); return }
      if (e.key !== 'Tab') return
      const els = getFocusable()
      if (els.length === 0) return
      const first = els[0]
      const last = els[els.length - 1]
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus() }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus() }
    }
    document.addEventListener('keydown', onKeyDown)

    return () => {
      clearTimeout(t)
      document.removeEventListener('keydown', onKeyDown)
      prevFocus.current?.focus()
    }
  }, [open, onClose])

  return ref
}
