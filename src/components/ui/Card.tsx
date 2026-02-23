import { type ReactNode } from 'react'
import { Link } from 'react-router'

type CardVariant = 'top' | 'accent' | 'side'

interface CardProps {
  variant?: CardVariant
  hoverable?: boolean
  href?: string
  children: ReactNode
  className?: string
}

const variantMap: Record<CardVariant, string> = {
  top: 'card-top',
  accent: 'card-accent',
  side: 'card-side',
}

export function Card({ variant = 'top', hoverable = true, href, children, className = '' }: CardProps) {
  const base = `${variantMap[variant]} rounded-none bg-bg-card ${hoverable ? 'hover:bg-bg-card-hover' : ''} ${className}`

  if (href) {
    return <Link to={href} className={`block ${base}`}>{children}</Link>
  }

  return <div className={base}>{children}</div>
}
