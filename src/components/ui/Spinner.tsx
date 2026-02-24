import { Loader2 } from 'lucide-react'

const sizeMap = {
  sm: 'w-4 h-4',
  md: 'w-8 h-8',
  lg: 'w-10 h-10',
}

export function Spinner({
  size = 'md',
  className = '',
}: {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}) {
  return (
    <Loader2
      className={`animate-spin text-accent-violet ${sizeMap[size]} ${className}`}
    />
  )
}
