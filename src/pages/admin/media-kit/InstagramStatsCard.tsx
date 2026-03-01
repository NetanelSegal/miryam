import { Text, Button, Card, Input } from '@/components/ui'
import type { SocialStats } from '@/lib/social-stats-store'

interface InstagramStatsCardProps {
  stats: SocialStats
  setStats: React.Dispatch<React.SetStateAction<SocialStats | null>>
  onSave: (updates: Partial<SocialStats>) => Promise<void>
  saving: boolean
}

export function InstagramStatsCard({ stats, setStats, onSave, saving }: InstagramStatsCardProps) {
  return (
    <Card variant="accent" className="p-5">
      <Text className="font-medium mb-3 block">אינסטגרם</Text>
      <Text variant="muted" size="sm" className="mb-2">
        נתונים מ-Instagram Insights. הזן ידנית.
      </Text>
      <div className="flex flex-wrap gap-2 items-end">
        <Input
          type="number"
          value={stats.instagram?.subscribers ?? ''}
          onChange={(e) => {
            const v = e.target.value ? parseInt(e.target.value, 10) : undefined
            setStats((s) => (s ? { ...s, instagram: { ...s.instagram, subscribers: v ?? 0 } } : null))
          }}
          placeholder="עוקבים"
          dir="ltr"
          className="w-28"
        />
        <Button
          variant="primary"
          size="sm"
          onClick={() =>
            onSave({
              instagram: { subscribers: stats.instagram?.subscribers ?? 0 },
            })
          }
          disabled={saving}
        >
          שמור
        </Button>
      </div>
    </Card>
  )
}
