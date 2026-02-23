type SkeletonVariant = 'text' | 'circle' | 'card' | 'image'

interface SkeletonProps {
  variant?: SkeletonVariant
  lines?: number
  className?: string
}

export function Skeleton({ variant = 'text', lines = 1, className = '' }: SkeletonProps) {
  const shimmer = 'animate-pulse bg-white/5'

  if (variant === 'circle') {
    return <div className={`${shimmer} rounded-full w-12 h-12 ${className}`} />
  }

  if (variant === 'image') {
    return <div className={`${shimmer} rounded-none w-full aspect-video ${className}`} />
  }

  if (variant === 'card') {
    return (
      <div className={`rounded-none border-t-2 border-white/10 bg-white/[0.02] p-6 space-y-3 ${className}`}>
        <div className={`${shimmer} h-4 w-3/4 rounded-sm`} />
        <div className={`${shimmer} h-3 w-full rounded-sm`} />
        <div className={`${shimmer} h-3 w-2/3 rounded-sm`} />
      </div>
    )
  }

  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} className={`${shimmer} h-4 rounded-sm ${i === lines - 1 ? 'w-2/3' : 'w-full'}`} />
      ))}
    </div>
  )
}
