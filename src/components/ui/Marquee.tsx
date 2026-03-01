import { type ReactNode } from 'react'
import { useReducedMotion } from 'motion/react'

interface MarqueeProps {
  speed?: number
  children: ReactNode
  className?: string
}

export function Marquee({ speed = 30, children, className = '' }: MarqueeProps) {
  const shouldReduce = useReducedMotion()

  const trackClasses = 'flex gap-8 w-max'
  const trackStyle = shouldReduce ? undefined : { animation: `marquee ${speed}s linear infinite` }

  return (
    <div className={`w-full max-w-full overflow-hidden ${className}`} dir="ltr">
      <div className={trackClasses} style={trackStyle}>
        <div className="flex gap-8 shrink-0">{children}</div>
        {!shouldReduce && <div className="flex gap-8 shrink-0" aria-hidden="true">{children}</div>}
      </div>
    </div>
  )
}
