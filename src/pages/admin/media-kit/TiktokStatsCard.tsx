import { Text, Button, Card, Input } from '@/components/ui'
import type { SocialStats } from '@/lib/social-stats-store'

interface TiktokStatsCardProps {
  stats: SocialStats
  setStats: React.Dispatch<React.SetStateAction<SocialStats | null>>
  onSave: (updates: Partial<SocialStats>) => Promise<void>
  saving: boolean
}

export function TiktokStatsCard({ stats, setStats, onSave, saving }: TiktokStatsCardProps) {
  return (
    <Card variant="accent" className="p-5">
      <Text className="font-medium mb-3 block">טיקטוק</Text>
      <Text variant="muted" size="sm" className="mb-2">
        נתונים מ-TikTok Creator Tools → Analytics. הזן ידנית.
      </Text>
      <div className="flex flex-wrap gap-2 items-end">
        <Input
          type="number"
          value={stats.tiktok?.followers ?? ''}
          onChange={(e) => {
            const v = e.target.value ? parseInt(e.target.value, 10) : undefined
            setStats((s) => (s ? { ...s, tiktok: { ...s.tiktok, followers: v ?? 0 } } : null))
          }}
          placeholder="עוקבים"
          dir="ltr"
          className="w-28"
        />
        <Input
          type="number"
          value={stats.tiktok?.views ?? ''}
          onChange={(e) => {
            const v = e.target.value ? parseInt(e.target.value, 10) : undefined
            setStats((s) =>
              s ? { ...s, tiktok: { ...(s.tiktok ?? { followers: 0 }), views: v } } : null
            )
          }}
          placeholder="צפיות"
          dir="ltr"
          className="w-28"
        />
        <Input
          type="number"
          value={stats.tiktok?.likes ?? ''}
          onChange={(e) => {
            const v = e.target.value ? parseInt(e.target.value, 10) : undefined
            setStats((s) =>
              s ? { ...s, tiktok: { ...(s.tiktok ?? { followers: 0 }), likes: v } } : null
            )
          }}
          placeholder="לייקים"
          dir="ltr"
          className="w-28"
        />
        <Input
          type="number"
          value={stats.tiktok?.videoCount ?? ''}
          onChange={(e) => {
            const v = e.target.value ? parseInt(e.target.value, 10) : undefined
            setStats((s) =>
              s ? { ...s, tiktok: { ...(s.tiktok ?? { followers: 0 }), videoCount: v } } : null
            )
          }}
          placeholder="מספר סרטונים"
          dir="ltr"
          className="w-28"
        />
        <Button
          variant="primary"
          size="sm"
          onClick={() =>
            onSave({
              tiktok: {
                followers: stats.tiktok?.followers ?? 0,
                views: stats.tiktok?.views,
                likes: stats.tiktok?.likes,
                videoCount: stats.tiktok?.videoCount,
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
