import { useState } from 'react'
import { Gamepad2, Settings } from 'lucide-react'
import { Heading, LeaderboardRow, EmptyState, SubTabNav } from '@/components/ui'
import { formatTime } from '@/lib/date'
import type { TriviaResult } from '@/lib/store'
import { AdminTriviaQuestions } from './AdminTriviaQuestions'

interface AdminTriviaProps {
  triviaResults: TriviaResult[]
}

type SubTab = 'leaderboard' | 'questions'

export function AdminTrivia({ triviaResults }: AdminTriviaProps) {
  const [subTab, setSubTab] = useState<SubTab>('leaderboard')

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
