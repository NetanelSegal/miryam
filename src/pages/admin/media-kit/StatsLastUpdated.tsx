import { Text, Card } from '@/components/ui'

interface StatsLastUpdatedProps {
  updatedAt: number
}

export function StatsLastUpdated({ updatedAt }: StatsLastUpdatedProps) {
  return (
    <Card variant="accent" className="p-5 mb-6">
      <Text variant="muted" size="sm">
        עודכן לאחרונה: {updatedAt ? new Date(updatedAt).toLocaleString('he-IL') : '—'}
      </Text>
    </Card>
  )
}
