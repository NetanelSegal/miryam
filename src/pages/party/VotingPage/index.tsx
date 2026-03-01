import { useState, useEffect } from 'react'
import { Container, LoadingState } from '@/components/ui'
import { ParticipantGate } from '@/components/guards/ParticipantGate'
import { subscribeToSettings } from '@/lib/settings-store'
import { VotingClosedView } from './VotingClosedView'
import { VotingGame } from './VotingGame'

export function VotingPage() {
  const [votingOpen, setVotingOpen] = useState<boolean | null>(null)

  useEffect(() => {
    return subscribeToSettings((s) => setVotingOpen(s.votingOpen))
  }, [])

  return (
    <ParticipantGate>
      {votingOpen === null ? (
        <Container size="md" className="py-12 flex justify-center">
          <LoadingState />
        </Container>
      ) : !votingOpen ? (
        <VotingClosedView />
      ) : (
        <VotingGame />
      )}
    </ParticipantGate>
  )
}
