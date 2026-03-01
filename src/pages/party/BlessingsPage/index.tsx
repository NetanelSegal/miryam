import { ParticipantGate } from '@/components/guards/ParticipantGate'
import { BlessingsContent } from './BlessingsContent'

export function BlessingsPage() {
  return (
    <ParticipantGate>
      <BlessingsContent />
    </ParticipantGate>
  )
}
