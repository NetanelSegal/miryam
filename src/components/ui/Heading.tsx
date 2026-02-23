import { type ReactNode, type ElementType } from 'react'

type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6

interface HeadingProps {
  level?: HeadingLevel
  as?: ElementType
  gradient?: boolean
  children: ReactNode
  className?: string
}

const sizeMap: Record<HeadingLevel, string> = {
  1: 'text-4xl md:text-6xl lg:text-8xl font-bold',
  2: 'text-3xl md:text-5xl font-bold',
  3: 'text-2xl md:text-4xl font-semibold',
  4: 'text-xl md:text-2xl font-semibold',
  5: 'text-lg md:text-xl font-medium',
  6: 'text-base md:text-lg font-medium',
}

export function Heading({ level = 2, as, gradient, children, className = '' }: HeadingProps) {
  const Tag = as ?? (`h${level}` as ElementType)
  const baseClasses = `font-heading ${sizeMap[level]} tracking-tight`
  const colorClass = gradient ? 'gradient-text' : 'text-text-primary'

  return (
    <Tag className={`${baseClasses} ${colorClass} ${className}`} style={level <= 2 ? { letterSpacing: '0.02em' } : undefined}>
      {children}
    </Tag>
  )
}
