import { type ReactNode } from 'react'

type BadgeVariant = 'default' | 'success' | 'warning' | 'error'

interface BadgeProps {
  variant?: BadgeVariant
  children: ReactNode
  className?: string
}

const variantMap: Record<BadgeVariant, string> = {
  default: 'bg-accent-indigo/20 text-accent-indigo',
  success: 'bg-emerald-500/20 text-emerald-400',
  warning: 'bg-amber-500/20 text-amber-400',
  error: 'bg-red-500/20 text-red-400',
}

export function Badge({ variant = 'default', children, className = '' }: BadgeProps) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 text-xs font-medium rounded-none ${variantMap[variant]} ${className}`}>
      {children}
    </span>
  )
}
