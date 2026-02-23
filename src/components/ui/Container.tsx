import { type ReactNode } from 'react'

type ContainerSize = 'sm' | 'md' | 'lg' | 'xl' | 'full'

interface ContainerProps {
  size?: ContainerSize
  padding?: boolean
  children: ReactNode
  className?: string
}

const sizeMap: Record<ContainerSize, string> = {
  sm: 'max-w-2xl',
  md: 'max-w-4xl',
  lg: 'max-w-6xl',
  xl: 'max-w-7xl',
  full: 'max-w-none',
}

export function Container({ size = 'lg', padding = true, children, className = '' }: ContainerProps) {
  return (
    <div className={`mx-auto ${sizeMap[size]} ${padding ? 'px-4 md:px-6' : ''} ${className}`}>
      {children}
    </div>
  )
}
