import { Text, Card } from '@/components/ui'
import { calcEngagementPercent } from '@/lib/social-stats-store'
import type { SocialStats } from '@/lib/social-stats-store'

interface EngagementPercentCardProps {
  stats: SocialStats
}

export function EngagementPercentCard({ stats }: EngagementPercentCardProps) {
  const eng = calcEngagementPercent(stats)

  return (
    <Card variant="accent" className="p-5">
      <Text className="font-medium mb-3 block">אחוז מעורבות (חישוב אוטומטי)</Text>
      <Text variant="muted" size="sm" className="mb-2">
        מחושב מטיקטוק בלבד: (לייקים ÷ צפיות) × 100. הזן צפיות ולייקים מ-Creator Tools. אינסטגרם
        ויוטיוב לא נכללים. ערך טוב: 2–6%.
      </Text>
      <div className="flex items-center gap-3">
        <span className="text-2xl font-bold text-accent-violet">{eng != null ? `${eng}%` : '—'}</span>
        {eng == null && (
          <Text variant="muted" size="xs">
            הזן צפיות ולייקים בטיקטוק כדי לראות את החישוב
          </Text>
        )}
      </div>
    </Card>
  )
}
