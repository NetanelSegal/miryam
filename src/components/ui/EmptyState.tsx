import type { LucideIcon } from 'lucide-react'
import { Card } from './Card'
import { Text } from './Text'

interface EmptyStateProps {
  icon: LucideIcon
  message: string
  className?: string
}

export function EmptyState({ icon: Icon, message, className = '' }: EmptyStateProps) {
  return (
    <Card variant="accent" className={`p-8 text-center ${className}`}>
      <Icon className="w-12 h-12 text-text-muted mx-auto mb-3" />
      <Text variant="muted">{message}</Text>
    </Card>
  )
}
