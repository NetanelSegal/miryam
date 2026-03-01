import { Text } from '@/components/ui'
import type { LucideIcon } from 'lucide-react'

interface SectionLabelProps {
  icon: LucideIcon
  label: string
}

export function SectionLabel({ icon: Icon, label }: SectionLabelProps) {
  return (
    <div className="flex items-center gap-3 mb-8 md:mb-12">
      <Icon className="w-6 h-6 md:w-8 md:h-8 text-accent-indigo" />
      <Text size="xl" className="font-heading font-bold tracking-wide text-text-muted uppercase">
        {label}
      </Text>
    </div>
  )
}
