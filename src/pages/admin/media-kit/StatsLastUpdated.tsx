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
      <Text variant="muted" size="xs" className="mt-1 block">
        כל השמירות מתפרסמות ישירות לאתר — ללא Cloud Functions
      </Text>
    </Card>
  )
}
