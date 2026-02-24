import { Text, Button, Card, Input } from '@/components/ui'
import type { SocialStats } from '@/lib/social-stats-store'

interface YouTubeStatsCardProps {
  stats: SocialStats
  setStats: React.Dispatch<React.SetStateAction<SocialStats | null>>
  onSave: (updates: Partial<SocialStats>) => Promise<void>
  saving: boolean
}

export function YouTubeStatsCard({ stats, setStats, onSave, saving }: YouTubeStatsCardProps) {
  return (
    <Card variant="accent" className="p-5">
      <Text className="font-medium mb-3 block">YouTube</Text>
      <Text variant="muted" size="sm" className="mb-2">
        נתונים מ-YouTube Studio → Analytics. הזן ידנית.
      </Text>
      <div className="flex flex-wrap gap-2 items-end">
        <Input
          type="number"
          value={stats.youtube?.subscribers ?? ''}
          onChange={(e) => {
            const v = e.target.value ? parseInt(e.target.value, 10) : undefined
            setStats((s) => (s ? { ...s, youtube: { ...s.youtube, subscribers: v ?? 0 } } : null))
          }}
          placeholder="מנויים"
          dir="ltr"
          className="w-28"
        />
        <Input
          type="number"
          value={stats.youtube?.views ?? ''}
          onChange={(e) => {
            const v = e.target.value ? parseInt(e.target.value, 10) : undefined
            setStats((s) =>
              s ? { ...s, youtube: { ...(s.youtube ?? { subscribers: 0 }), views: v } } : null
            )
          }}
          placeholder="צפיות"
          dir="ltr"
          className="w-28"
        />
        <Input
          type="number"
          value={stats.youtube?.likes ?? ''}
          onChange={(e) => {
            const v = e.target.value ? parseInt(e.target.value, 10) : undefined
            setStats((s) =>
              s ? { ...s, youtube: { ...(s.youtube ?? { subscribers: 0 }), likes: v } } : null
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
              youtube: {
                subscribers: stats.youtube?.subscribers ?? 0,
                views: stats.youtube?.views,
                likes: stats.youtube?.likes,
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
