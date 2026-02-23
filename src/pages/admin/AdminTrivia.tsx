import { useState } from 'react'
import { Gamepad2, Settings } from 'lucide-react'
import { Heading, LeaderboardRow, EmptyState } from '@/components/ui'
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
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setSubTab('leaderboard')}
          className={`flex items-center gap-2 px-3 py-1.5 text-sm font-medium transition-all ${
            subTab === 'leaderboard'
              ? 'bg-white/10 text-white border border-white/20'
              : 'text-text-muted hover:text-white border border-transparent'
          }`}
        >
          <Gamepad2 className="w-3.5 h-3.5" />
          דירוג
        </button>
        <button
          onClick={() => setSubTab('questions')}
          className={`flex items-center gap-2 px-3 py-1.5 text-sm font-medium transition-all ${
            subTab === 'questions'
              ? 'bg-white/10 text-white border border-white/20'
              : 'text-text-muted hover:text-white border border-transparent'
          }`}
        >
          <Settings className="w-3.5 h-3.5" />
          ניהול שאלות
        </button>
      </div>

      {subTab === 'leaderboard' && (
        <>
          <Heading level={4} className="text-white mb-6">דירוג טריוויה</Heading>
          {triviaResults.length > 0 ? (
            <div className="space-y-2">
              {triviaResults.map((r, i) => (
                <LeaderboardRow
                  key={r.participantId}
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
