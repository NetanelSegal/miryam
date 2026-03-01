import { useState, useEffect } from 'react'
import { Check, Trophy, Lock } from 'lucide-react'
import { Heading, Text, Container, Card, Badge, EmptyState, VoteBar, LoadingState } from '@/components/ui'
import { AnimateOnScroll } from '@/components/motion'
import { useRequiredParticipant } from '@/hooks'
import * as store from '@/lib/store'

export function VotingClosedView() {
  const participant = useRequiredParticipant()
  const { id: pid } = participant
  const [approvedCostumes, setApprovedCostumes] = useState<store.CostumeEntry[]>([])
  const [voteCounts, setVoteCounts] = useState<Record<string, number>>({})
  const [existingVote, setExistingVote] = useState<store.VoteRecord | undefined>(undefined)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      store.getApprovedCostumes(),
      store.getVoteCounts(),
      store.getVote(pid),
    ]).then(([costumes, counts, vote]) => {
      setApprovedCostumes(costumes)
      setVoteCounts(counts)
      setExistingVote(vote)
    }).finally(() => setLoading(false))
  }, [pid])

  const votedFor = existingVote?.candidateId ?? null
  const maxVotes = Math.max(...Object.values(voteCounts), 1)

  if (loading) {
    return (
      <Container size="md" className="py-12 flex justify-center">
        <LoadingState />
      </Container>
    )
  }

  return (
    <Container size="md" className="py-8 md:py-12">
      <AnimateOnScroll variant="fade-up" className="text-center mb-8 md:mb-10">
        <Heading level={1} gradient>תחרות התחפושות</Heading>
      </AnimateOnScroll>

      <AnimateOnScroll variant="fade-up" delay={0.1}>
        <Card variant="accent" className="p-6 mb-10 max-w-lg mx-auto text-center">
          <Lock className="w-12 h-12 text-accent-violet mx-auto mb-3" />
          <Heading level={4} className="text-white mb-2">ההצבעות נסגרו</Heading>
          <Text variant="secondary" size="sm">
            ההצבעות הסתיימו. הנה התוצאות הסופיות
          </Text>
        </Card>
      </AnimateOnScroll>

      <div className="mt-8">
        {approvedCostumes.length === 0 ? (
          <EmptyState icon={Trophy} message="לא היו תחפושות בהצבעה" />
        ) : (
          <AnimateOnScroll variant="fade-up">
            <div className="space-y-4">
              {approvedCostumes
                .map((c) => ({ ...c, votes: voteCounts[c.id] ?? 0 }))
                .sort((a, b) => b.votes - a.votes)
                .map((costume) => (
                  <div key={costume.id} className="flex items-center gap-3 md:gap-4">
                    <img
                      src={store.getCostumeImageUrl(costume)}
                      alt={costume.title}
                      className="w-10 h-10 md:w-12 md:h-12 object-cover shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1.5">
                        <Text size="sm" className="font-semibold">
                          {costume.title}
                        </Text>
                        <Text variant="muted" size="xs">
                          ({costume.participantName})
                        </Text>
                        {votedFor === costume.id && (
                          <Badge variant="success" className="gap-1">
                            <Check className="w-3 h-3" /> הבחירה שלך
                          </Badge>
                        )}
                      </div>
                      <VoteBar votes={costume.votes} maxVotes={maxVotes} size="sm" />
                    </div>
                  </div>
                ))}
            </div>
          </AnimateOnScroll>
        )}
      </div>
    </Container>
  )
}
