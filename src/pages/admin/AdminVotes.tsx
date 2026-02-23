import { Vote } from 'lucide-react'
import { Heading, Text, Badge, VoteBar, EmptyState } from '@/components/ui'
import type { CostumeEntry } from '@/lib/store'

interface AdminVotesProps {
  approvedCostumes: CostumeEntry[]
  voteCounts: Record<string, number>
}

export function AdminVotes({ approvedCostumes, voteCounts }: AdminVotesProps) {
  const totalVotes = Object.values(voteCounts).reduce((sum, n) => sum + n, 0)
  const maxVotes = Math.max(...Object.values(voteCounts), 1)

  return (
    <>
      <Heading level={4} className="text-white mb-6">תוצאות הצבעות</Heading>
      {approvedCostumes.length > 0 ? (
        <>
          <div className="space-y-4 mb-8">
            {approvedCostumes
              .map(c => ({ ...c, votes: voteCounts[c.id] ?? 0 }))
              .sort((a, b) => b.votes - a.votes)
              .map((c, i) => (
                <div key={c.id} className="flex items-center gap-4">
                  <img src={c.imageData} alt={c.title} className="w-10 h-10 object-cover shrink-0" />
                  <div className="w-28 shrink-0">
                    <Text size="sm" className="font-semibold">{c.title}</Text>
                    <Text variant="muted" size="xs">{c.participantName}</Text>
                    {i === 0 && totalVotes > 0 && <Badge variant="success" className="mt-1">מובילה!</Badge>}
                  </div>
                  <div className="flex-1">
                    <VoteBar votes={c.votes} maxVotes={maxVotes} label={String(c.votes)} />
                  </div>
                </div>
              ))}
          </div>
          <Text variant="muted" size="sm">סה"כ {totalVotes} הצבעות</Text>
        </>
      ) : (
        <EmptyState icon={Vote} message="עדיין אין תחפושות מאושרות להצבעה" />
      )}
    </>
  )
}
