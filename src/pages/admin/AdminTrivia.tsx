import { useState } from 'react'
import { Gamepad2, Settings, Trash2 } from 'lucide-react'
import { Heading, LeaderboardRow, EmptyState, SubTabNav } from '@/components/ui'
import { formatTime } from '@/lib/date'
import type { TriviaResult } from '@/lib/store'
import { AdminTriviaQuestions } from './AdminTriviaQuestions'

interface AdminTriviaProps {
  triviaResults: TriviaResult[]
  onDeleteResult: (result: TriviaResult) => Promise<void>
}

type SubTab = 'leaderboard' | 'questions'

export function AdminTrivia({ triviaResults, onDeleteResult }: AdminTriviaProps) {
  const [subTab, setSubTab] = useState<SubTab>('leaderboard')
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const handleDelete = async (r: TriviaResult) => {
    if (!r.id) return
    if (!confirm('למחוק את תוצאת הטריוויה?')) return
    setDeletingId(r.id)
    try {
      await onDeleteResult(r)
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <>
      <SubTabNav
        tabs={[
          { id: 'leaderboard', label: 'דירוג', icon: Gamepad2 },
          { id: 'questions', label: 'ניהול שאלות', icon: Settings },
        ]}
        activeId={subTab}
        onChange={(id) => setSubTab(id as SubTab)}
      />

      {subTab === 'leaderboard' && (
        <>
          <Heading level={4} className="text-white mb-6">דירוג טריוויה</Heading>
          {triviaResults.length > 0 ? (
            <div className="space-y-2">
              {triviaResults.map((r, i) => (
                <LeaderboardRow
                  key={r.id ?? r.participantId}
                  rank={i + 1}
                  name={r.participantName}
                  score={`${r.score}/${r.totalQuestions}`}
                  detail={formatTime(r.timestamp)}
                  highlight={i === 0}
                  action={
                    r.id ? (
                      <button
                        type="button"
                        onClick={() => handleDelete(r)}
                        className="p-2 text-red-400 hover:text-red-300 disabled:opacity-50"
                        disabled={!!deletingId}
                        title="מחיקה"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    ) : null
                  }
                />
              ))}
            </div>
          ) : (
            <EmptyState icon={Gamepad2} message="עדיין אין תוצאות טריוויה" />
          )}
        </>
      )}

      {subTab === 'questions' && <AdminTriviaQuestions />}
    </>
  )
}
