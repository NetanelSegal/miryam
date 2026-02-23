import { type ReactNode, type ElementType } from 'react'

type TextVariant = 'body' | 'secondary' | 'muted' | 'label'
type TextSize = 'xs' | 'sm' | 'base' | 'lg' | 'xl'

interface TextProps {
  variant?: TextVariant
  size?: TextSize
  as?: ElementType
  children: ReactNode
  className?: string
}

const variantMap: Record<TextVariant, string> = {
  body: 'text-text-primary',
  secondary: 'text-text-secondary',
  muted: 'text-text-muted',
  label: 'text-text-muted uppercase tracking-widest text-xs',
}

const sizeMap: Record<TextSize, string> = {
  xs: 'text-xs',
  sm: 'text-sm',
  base: 'text-base',
  lg: 'text-lg',
  xl: 'text-xl',
}

export function Text({ variant = 'body', size = 'base', as, children, className = '' }: TextProps) {
  const Tag = as ?? (variant === 'label' ? 'span' : 'p')
  const isLabel = variant === 'label'

  return (
    <Tag className={`${variantMap[variant]} ${isLabel ? '' : sizeMap[size]} ${className}`}>
      {children}
    </Tag>
  )
}
