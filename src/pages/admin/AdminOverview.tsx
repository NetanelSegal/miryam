import { Trophy, Crown } from 'lucide-react'
import { Heading, Text, Card, StatCard, Badge, LeaderboardRow } from '@/components/ui'
import { StaggerChildren } from '@/components/motion'
import type { TriviaResult, CostumeEntry } from '@/lib/store'

interface AdminOverviewProps {
  stats: ReturnType<typeof import('@/lib/store').getStats>
  triviaResults: TriviaResult[]
  voteCounts: Record<string, number>
  approvedCostumes: CostumeEntry[]
}

export function AdminOverview({ stats, triviaResults, voteCounts, approvedCostumes }: AdminOverviewProps) {
  const totalVotes = Object.values(voteCounts).reduce((sum, n) => sum + n, 0)
  const costumeNameMap = Object.fromEntries(
    approvedCostumes.map(c => [c.id, `${c.title} (${c.participantName})`])
  )

  return (
    <>
      <StaggerChildren staggerDelay={0.1} className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
        <StatCard value={String(stats.totalParticipants)} label="משתתפים" />
        <StatCard value={String(stats.totalTriviaPlayers)} label="שיחקו טריוויה" />
        <StatCard value={String(stats.totalVotes)} label="הצבעות" />
        <StatCard value={`${stats.totalCostumes} (${stats.pendingCostumes} ממתינות)`} label="תחפושות" />
      </StaggerChildren>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card variant="accent" className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Trophy className="w-5 h-5 text-amber-400" />
            <Heading level={5} className="text-white">מוביל הטריוויה</Heading>
          </div>
          {triviaResults.length > 0 ? (
            <div className="space-y-2">
              {triviaResults.slice(0, 3).map((r, i) => (
                <LeaderboardRow
                  key={r.participantId}
                  rank={i + 1}
                  name={r.participantName}
                  score={`${r.score}/${r.totalQuestions}`}
                  highlight={i === 0}
                />
              ))}
            </div>
          ) : (
            <Text variant="muted">עדיין אין תוצאות</Text>
          )}
        </Card>

        <Card variant="accent" className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Crown className="w-5 h-5 text-accent-violet" />
            <Heading level={5} className="text-white">תוצאות הצבעות</Heading>
          </div>
          {totalVotes > 0 ? (
            <div className="space-y-2">
              {Object.entries(voteCounts)
                .sort(([, a], [, b]) => b - a)
                .map(([candidateId, count]) => (
                  <div key={candidateId} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                    <Text>{costumeNameMap[candidateId] ?? candidateId}</Text>
                    <Badge>{count} הצבעות</Badge>
                  </div>
                ))}
            </div>
          ) : (
            <Text variant="muted">עדיין אין הצבעות</Text>
          )}
        </Card>
      </div>
    </>
  )
}
