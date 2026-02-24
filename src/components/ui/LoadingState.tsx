import { Spinner } from './Spinner'

interface LoadingStateProps {
  /** Optional spinner size. Default: md */
  size?: 'sm' | 'md' | 'lg'
  /** Optional additional class names for the container */
  className?: string
}

/**
 * Centered loading state with spinner. Use for full-section loading (e.g. Admin panels).
 */
export function LoadingState({ size = 'md', className = '' }: LoadingStateProps) {
  return (
    <div
      className={`flex justify-center py-12 ${className}`}
    >
      <Spinner size={size} />
    </div>
  )
}
