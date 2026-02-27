import { Database, RotateCcw } from 'lucide-react'
import { Heading, Text, Button, Card } from '@/components/ui'

interface SeedCollectionsCardProps {
  onSeed: () => void
  seeding: boolean
  onResetAndReseed?: () => void
  resetting?: boolean
}

export function SeedCollectionsCard({
  onSeed,
  seeding,
  onResetAndReseed,
  resetting = false,
}: SeedCollectionsCardProps) {
  const busy = seeding || resetting
  return (
    <Card variant="accent" className="p-5 mb-6">
      <Heading level={5} className="text-white mb-2 flex items-center gap-2">
        <Database className="w-4 h-4" />
        יצירת אוספים ראשוניים
      </Heading>
      <Text variant="muted" size="sm" className="mb-4">
        אם אוספי brands ו-caseStudies עדיין לא קיימים ב-Firestore, לחצו כדי ליצור אותם עם נתוני דוגמה.
      </Text>
      <div className="flex flex-wrap gap-2">
        <Button
          variant="secondary"
          size="sm"
          icon={<Database className="w-4 h-4" />}
          onClick={onSeed}
          disabled={busy}
        >
          {seeding ? 'יוצר...' : 'יצירת brands ו-caseStudies'}
        </Button>
        {onResetAndReseed && (
          <Button
            variant="ghost"
            size="sm"
            icon={<RotateCcw className="w-4 h-4" />}
            onClick={onResetAndReseed}
            disabled={busy}
            className="border-red-500/40 text-red-400 hover:bg-red-500/10"
          >
            {resetting ? 'מאפס...' : 'איפוס מלא ויצירה מחדש'}
          </Button>
        )}
      </div>
    </Card>
  )
}
