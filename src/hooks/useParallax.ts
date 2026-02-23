import { useState, useEffect, useRef, useCallback } from 'react'

export function useParallax(speed: number = 0.3) {
  const ref = useRef<HTMLDivElement>(null)
  const [offset, setOffset] = useState(0)
  const rafId = useRef(0)

  const handleScroll = useCallback(() => {
    if (rafId.current) return
    rafId.current = requestAnimationFrame(() => {
      if (ref.current) {
        const rect = ref.current.getBoundingClientRect()
        const scrolled = window.innerHeight - rect.top
        setOffset(scrolled * speed)
      }
      rafId.current = 0
    })
  }, [speed])

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => {
      window.removeEventListener('scroll', handleScroll)
      if (rafId.current) cancelAnimationFrame(rafId.current)
    }
  }, [handleScroll])

  return { ref, offset, style: { transform: `translateY(${offset}px)` } }
}
