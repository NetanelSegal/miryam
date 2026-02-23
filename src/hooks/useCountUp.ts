import { useState, useEffect, useRef } from 'react'

interface UseCountUpOptions {
  end: number
  start?: number
  duration?: number
  decimals?: number
  enabled?: boolean
}

export function useCountUp({
  end,
  start = 0,
  duration = 2000,
  decimals = 0,
  enabled = true,
}: UseCountUpOptions) {
  const [value, setValue] = useState(start)
  const rafRef = useRef<number>(0)
  const startTimeRef = useRef<number>(0)

  useEffect(() => {
    if (!enabled) {
      setValue(start)
      return
    }

    startTimeRef.current = 0

    function animate(timestamp: number) {
      if (!startTimeRef.current) startTimeRef.current = timestamp
      const progress = Math.min((timestamp - startTimeRef.current) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      const current = start + (end - start) * eased

      setValue(Number(current.toFixed(decimals)))

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate)
      }
    }

    rafRef.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(rafRef.current)
  }, [end, start, duration, decimals, enabled])

  return value
}
