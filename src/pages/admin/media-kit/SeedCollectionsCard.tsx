import { Database } from 'lucide-react'
import { Heading, Text, Button, Card } from '@/components/ui'

interface SeedCollectionsCardProps {
  onSeed: () => void
  seeding: boolean
}

export function SeedCollectionsCard({ onSeed, seeding }: SeedCollectionsCardProps) {
  return (
    <Card variant="accent" className="p-5 mb-6">
      <Heading level={5} className="text-white mb-2 flex items-center gap-2">
        <Database className="w-4 h-4" />
        יצירת אוספים ראשוניים
      </Heading>
      <Text variant="muted" size="sm" className="mb-4">
        אם אוספי brands ו-caseStudies עדיין לא קיימים ב-Firestore, לחצו כדי ליצור אותם עם נתוני דוגמה.
      </Text>
      <Button
        variant="secondary"
        size="sm"
        icon={<Database className="w-4 h-4" />}
        onClick={onSeed}
        disabled={seeding}
      >
        {seeding ? 'יוצר...' : 'יצירת brands ו-caseStudies'}
      </Button>
    </Card>
  )
}
