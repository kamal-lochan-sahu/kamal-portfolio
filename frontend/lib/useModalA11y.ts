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

    const getFocusable = () =>
      ref.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), textarea, input:not([disabled]), select, [tabindex]:not([tabindex="-1"])'
      )

    const t = setTimeout(() => getFocusable()?.[0]?.focus(), 0)

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { onClose(); return }
      if (e.key !== 'Tab') return
      const els = getFocusable()
      if (!els || els.length === 0) return
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
