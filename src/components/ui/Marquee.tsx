import { type ReactNode } from 'react'

interface MarqueeProps {
  speed?: number
  children: ReactNode
  className?: string
}

export function Marquee({ speed = 30, children, className = '' }: MarqueeProps) {
  return (
    <div className={`overflow-hidden ${className}`}>
      <div
        className="flex gap-8 w-max"
        style={{
          animation: `marquee ${speed}s linear infinite`,
        }}
      >
        <div className="flex gap-8 shrink-0">{children}</div>
        <div className="flex gap-8 shrink-0" aria-hidden="true">{children}</div>
      </div>
    </div>
  )
}
