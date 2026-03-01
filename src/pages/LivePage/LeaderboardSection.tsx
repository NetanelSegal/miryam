import { motion } from 'motion/react'
import { Trophy } from 'lucide-react'
import { Text } from '@/components/ui'
import { getRankColor } from '@/lib/utils'
import * as store from '@/lib/store'
import { SectionLabel } from './SectionLabel'

interface LeaderboardSectionProps {
  leaderboard: store.TriviaResult[]
}

export function LeaderboardSection({ leaderboard }: LeaderboardSectionProps) {
  const top5 = leaderboard.slice(0, 5)
  return (
    <div className="w-full max-w-2xl mx-auto px-6">
      <SectionLabel icon={Trophy} label="טבלת הטריוויה" />
      {top5.length > 0 ? (
        <div className="space-y-3">
          {top5.map((entry, i) => (
            <motion.div key={entry.participantId} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.12, duration: 0.4 }}
              className={`flex items-center gap-4 p-4 md:p-5 border ${
                i === 0 ? 'border-amber-500/30 bg-amber-500/5' : 'border-white/5 bg-white/[0.02]'
              }`}>
              <span className={`text-2xl md:text-3xl font-heading font-bold w-10 text-center ${getRankColor(i)}`}>
                {i + 1}
              </span>
              <Text size="xl" className="flex-1 font-semibold">{entry.participantName}</Text>
              <Text size="xl" className="font-bold gradient-text">{entry.score}/{entry.totalQuestions}</Text>
            </motion.div>
          ))}
        </div>
      ) : (
        <Text variant="muted" size="xl" className="text-center">עדיין אין תוצאות</Text>
      )}
    </div>
  )
}
