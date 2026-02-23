import { useState, useEffect } from 'react'
import {
  LayoutDashboard, Gamepad2, Vote,
  Users, Trophy, Crown, RefreshCw
} from 'lucide-react'
import { Heading, Text, Container, Card, StatCard, Badge } from '@/components/ui'
import { AnimateOnScroll, StaggerChildren, PageTransition } from '@/components/motion'
import * as store from '@/lib/store'

type Tab = 'overview' | 'trivia' | 'votes' | 'participants'

const candidates: Record<string, string> = {
  '1': 'הנסיכה',
  '2': 'השודדת',
  '3': 'הכוכבת',
  '4': 'הגיבורה',
}

export function AdminPage() {
  const [tab, setTab] = useState<Tab>('overview')
  const [stats, setStats] = useState(store.getStats())
  const [triviaResults, setTriviaResults] = useState(store.getTriviaLeaderboard())
  const [voteCounts, setVoteCounts] = useState(store.getVoteCounts())
  const [participants, setParticipants] = useState(store.getAllParticipants())

  const refreshData = () => {
    setStats(store.getStats())
    setTriviaResults(store.getTriviaLeaderboard())
    setVoteCounts(store.getVoteCounts())
    setParticipants(store.getAllParticipants())
  }

  useEffect(() => {
    const interval = setInterval(refreshData, 5000)
    return () => clearInterval(interval)
  }, [])

  const totalVotes = Object.values(voteCounts).reduce((sum, n) => sum + n, 0)

  const tabItems: { id: Tab; label: string; icon: typeof Trophy }[] = [
    { id: 'overview', label: 'סקירה', icon: LayoutDashboard },
    { id: 'trivia', label: 'טריוויה', icon: Gamepad2 },
    { id: 'votes', label: 'הצבעות', icon: Vote },
    { id: 'participants', label: 'משתתפים', icon: Users },
  ]

  return (
    <PageTransition>
      <Container size="lg" className="py-12">
        <AnimateOnScroll variant="fade-up">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <LayoutDashboard className="w-8 h-8 text-accent-violet" />
              <Heading level={2} gradient>ניהול האתר</Heading>
            </div>
            <button onClick={refreshData} className="text-text-muted hover:text-white transition-colors p-2">
              <RefreshCw className="w-5 h-5" />
            </button>
          </div>
        </AnimateOnScroll>

        {/* Tabs */}
        <div className="flex gap-1 mb-8 overflow-x-auto pb-2">
          {tabItems.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-all whitespace-nowrap ${
                tab === t.id
                  ? 'bg-accent-indigo/20 text-white border border-accent-indigo/40'
                  : 'text-text-muted hover:text-white hover:bg-white/5 border border-transparent'
              }`}
            >
              <t.icon className="w-4 h-4" />
              {t.label}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {tab === 'overview' && (
          <>
            <StaggerChildren staggerDelay={0.1} className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
              <StatCard value={String(stats.totalParticipants)} label="משתתפים" />
              <StatCard value={String(stats.totalTriviaPlayers)} label="שיחקו טריוויה" />
              <StatCard value={String(stats.totalVotes)} label="הצבעות" />
              <StatCard value={String(stats.totalBlessings)} label="ברכות" />
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
                      <div key={r.participantId} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                        <div className="flex items-center gap-2">
                          <span className={`text-lg font-bold ${i === 0 ? 'text-amber-400' : i === 1 ? 'text-gray-300' : 'text-amber-600'}`}>
                            {i + 1}
                          </span>
                          <Text>{r.participantName}</Text>
                        </div>
                        <Badge>{r.score}/{r.totalQuestions}</Badge>
                      </div>
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
                          <Text>{candidates[candidateId] ?? candidateId}</Text>
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
        )}

        {/* Trivia Leaderboard Tab */}
        {tab === 'trivia' && (
          <AnimateOnScroll variant="fade-up">
            <Heading level={4} className="text-white mb-6">דירוג טריוויה</Heading>
            {triviaResults.length > 0 ? (
              <div className="space-y-2">
                {triviaResults.map((r, i) => (
                  <div key={r.participantId}
                    className={`flex items-center gap-4 p-4 border ${
                      i === 0 ? 'border-amber-500/30 bg-amber-500/5' : 'border-white/5 bg-white/[0.02]'
                    }`}
                  >
                    <span className={`text-xl font-bold w-8 text-center ${
                      i === 0 ? 'text-amber-400' : i === 1 ? 'text-gray-300' : i === 2 ? 'text-amber-600' : 'text-text-muted'
                    }`}>
                      {i + 1}
                    </span>
                    <Text className="flex-1 font-semibold">{r.participantName}</Text>
                    <Text className="font-bold gradient-text">{r.score}/{r.totalQuestions}</Text>
                    <Text variant="muted" size="xs">
                      {new Date(r.timestamp).toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' })}
                    </Text>
                  </div>
                ))}
              </div>
            ) : (
              <Card variant="accent" className="p-8 text-center">
                <Gamepad2 className="w-12 h-12 text-text-muted mx-auto mb-3" />
                <Text variant="muted">עדיין אין תוצאות טריוויה</Text>
              </Card>
            )}
          </AnimateOnScroll>
        )}

        {/* Votes Tab */}
        {tab === 'votes' && (
          <AnimateOnScroll variant="fade-up">
            <Heading level={4} className="text-white mb-6">תוצאות הצבעות</Heading>
            <div className="space-y-4 mb-8">
              {candidates && Object.entries(candidates)
                .map(([id, name]) => ({ id, name, votes: voteCounts[id] ?? 0 }))
                .sort((a, b) => b.votes - a.votes)
                .map((c, i) => (
                  <div key={c.id} className="flex items-center gap-4">
                    <div className="w-24 shrink-0">
                      <Text className="font-semibold">{c.name}</Text>
                      {i === 0 && totalVotes > 0 && <Badge variant="success" className="mt-1">מובילה!</Badge>}
                    </div>
                    <div className="flex-1 h-10 bg-white/5 relative overflow-hidden">
                      <div
                        className="absolute inset-y-0 right-0 bg-gradient-to-l from-[#6366f1] to-[#a855f7] transition-all duration-500"
                        style={{ width: totalVotes > 0 ? `${(c.votes / Math.max(...Object.values(voteCounts), 1)) * 100}%` : '0%' }}
                      />
                      <span className="absolute inset-0 flex items-center px-3 text-sm font-bold text-white z-10">
                        {c.votes}
                      </span>
                    </div>
                  </div>
                ))}
            </div>
            <Text variant="muted" size="sm">סה"כ {totalVotes} הצבעות</Text>
          </AnimateOnScroll>
        )}

        {/* Participants Tab */}
        {tab === 'participants' && (
          <AnimateOnScroll variant="fade-up">
            <Heading level={4} className="text-white mb-6">משתתפים ({participants.length})</Heading>
            {participants.length > 0 ? (
              <div className="space-y-2">
                {participants.map((p) => (
                  <div key={p.id} className="flex items-center justify-between p-3 border border-white/5 bg-white/[0.02]">
                    <div className="flex items-center gap-3">
                      <Users className="w-4 h-4 text-text-muted" />
                      <Text className="font-semibold">{p.name}</Text>
                      <Text variant="muted" size="xs">****{p.phoneDigits}</Text>
                    </div>
                    <Text variant="muted" size="xs">
                      {new Date(p.createdAt).toLocaleString('he-IL', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}
                    </Text>
                  </div>
                ))}
              </div>
            ) : (
              <Card variant="accent" className="p-8 text-center">
                <Users className="w-12 h-12 text-text-muted mx-auto mb-3" />
                <Text variant="muted">עדיין אין משתתפים רשומים</Text>
              </Card>
            )}
          </AnimateOnScroll>
        )}
      </Container>
    </PageTransition>
  )
}
