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
          value={stats.instagram?.followers ?? ''}
          onChange={(e) => {
            const v = e.target.value ? parseInt(e.target.value, 10) : undefined
            setStats((s) => (s ? { ...s, instagram: { ...s.instagram, followers: v ?? 0 } } : null))
          }}
          placeholder="עוקבים"
          dir="ltr"
          className="w-28"
        />
        <Input
          type="number"
          value={stats.instagram?.views ?? ''}
          onChange={(e) => {
            const v = e.target.value ? parseInt(e.target.value, 10) : undefined
            setStats((s) =>
              s ? { ...s, instagram: { ...(s.instagram ?? { followers: 0 }), views: v } } : null
            )
          }}
          placeholder="צפיות"
          dir="ltr"
          className="w-28"
        />
        <Input
          type="number"
          value={stats.instagram?.likes ?? ''}
          onChange={(e) => {
            const v = e.target.value ? parseInt(e.target.value, 10) : undefined
            setStats((s) =>
              s ? { ...s, instagram: { ...(s.instagram ?? { followers: 0 }), likes: v } } : null
            )
          }}
          placeholder="לייקים"
          dir="ltr"
          className="w-28"
        />
        <Button
          variant="primary"
          size="sm"
          onClick={() =>
            onSave({
              instagram: {
                followers: stats.instagram?.followers ?? 0,
                views: stats.instagram?.views,
                likes: stats.instagram?.likes,
              },
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
