import { useParticipant } from '@/contexts/ParticipantContext'
import type { Participant } from '@/lib/store'

export function useRequiredParticipant(): Participant {
  const { participant } = useParticipant()
  if (!participant) {
    throw new Error('useRequiredParticipant must be used inside ParticipantGate')
  }
  return participant
}
