import { motion } from 'motion/react'
import { MessageSquareHeart } from 'lucide-react'
import { Text } from '@/components/ui'
import type { Blessing } from '@/lib/store'
import { SectionLabel } from './SectionLabel'

interface BlessingsSectionProps {
  blessings: Blessing[]
}

export function BlessingsSection({ blessings }: BlessingsSectionProps) {
  const latest = blessings.slice(0, 3)
  return (
    <div className="w-full max-w-3xl mx-auto px-6">
      <SectionLabel icon={MessageSquareHeart} label="ברכות אחרונות" />
      {latest.length > 0 ? (
        <div className="space-y-6">
          {latest.map((b, i) => (
            <motion.div key={b.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.3, duration: 0.6 }} className="bg-white/5 border border-white/10 p-6 md:p-8">
              <Text size="xl" className="leading-relaxed mb-2">{b.message}</Text>
              <Text variant="muted" size="sm">— {b.name}</Text>
            </motion.div>
          ))}
        </div>
      ) : (
        <Text variant="muted" size="xl" className="text-center">עדיין אין ברכות</Text>
      )}
    </div>
  )
}
