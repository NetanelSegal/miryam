import { ParticipantGate } from '@/components/guards/ParticipantGate'
import { TriviaGame } from './TriviaGame'

export function TriviaPage() {
  return (
    <ParticipantGate>
      <TriviaGame />
    </ParticipantGate>
  )
}
