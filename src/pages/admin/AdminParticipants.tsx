import { Users } from 'lucide-react'
import { Heading, Text, EmptyState } from '@/components/ui'
import { formatDateTime } from '@/lib/date'
import type { Participant } from '@/lib/store'

interface AdminParticipantsProps {
  participants: Participant[]
}

export function AdminParticipants({ participants }: AdminParticipantsProps) {
  return (
    <>
      <Heading level={4} className="text-white mb-6">משתתפים ({participants.length})</Heading>
      {participants.length > 0 ? (
        <div className="space-y-2">
          {participants.map((p) => (
            <div key={p.id} className="flex items-center justify-between p-3 border border-white/5 bg-white/[0.02]">
              <div className="flex items-center gap-3">
                {p.photoURL ? (
                  <img src={p.photoURL} alt={p.name} className="w-8 h-8 rounded-full object-cover" />
                ) : (
                  <Users className="w-4 h-4 text-text-muted" />
                )}
                <div>
                  <Text className="font-semibold">{p.name}</Text>
                  {p.email && <Text variant="muted" size="xs">{p.email}</Text>}
                </div>
              </div>
              <Text variant="muted" size="xs">{formatDateTime(p.createdAt)}</Text>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState icon={Users} message="עדיין אין משתתפים רשומים" />
      )}
    </>
  )
}
