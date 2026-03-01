import { motion } from 'motion/react'
import { Crown } from 'lucide-react'
import { Text, VoteBar } from '@/components/ui'
import * as store from '@/lib/store'
import { SectionLabel } from './SectionLabel'

interface VotingResultsSectionProps {
  voteCounts: Record<string, number>
  costumes: store.CostumeEntry[]
}

export function VotingResultsSection({ voteCounts, costumes }: VotingResultsSectionProps) {
  const costumeMap = Object.fromEntries(costumes.map(c => [c.id, c]))
  const entries = Object.entries(voteCounts)
    .map(([id, votes]) => ({
      id,
      name: costumeMap[id]?.title ?? id,
      participantName: costumeMap[id]?.participantName ?? '',
      imageSrc: costumeMap[id] ? store.getCostumeImageUrl(costumeMap[id]) : '',
      votes,
    }))
    .sort((a, b) => b.votes - a.votes)
  const maxVotes = Math.max(...entries.map(e => e.votes), 1)

  return (
    <div className="w-full max-w-3xl mx-auto px-6">
      <SectionLabel icon={Crown} label="תחרות התחפושות" />
      {entries.length > 0 ? (
        <div className="space-y-6">
          {entries.map((entry, i) => (
            <motion.div key={entry.id} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.15, duration: 0.5 }} className="flex items-center gap-4">
              {entry.imageSrc && (
                <img src={entry.imageSrc} alt={entry.name} className="w-12 h-12 md:w-14 md:h-14 object-cover shrink-0" />
              )}
              <div className="w-28 md:w-36 shrink-0">
                <Text size="xl" className="font-bold">{entry.name}</Text>
                {entry.participantName && <Text variant="muted" size="xs">{entry.participantName}</Text>}
              </div>
              <div className="flex-1">
                <VoteBar votes={entry.votes} maxVotes={maxVotes} label={String(entry.votes)} size="lg" />
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <Text variant="muted" size="xl" className="text-center">ההצבעה טרם החלה</Text>
      )}
    </div>
  )
}
