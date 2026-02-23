import { useState, useEffect, useCallback } from 'react'
import {
  LayoutDashboard, Gamepad2, Vote,
  Users, Trophy, Crown, RefreshCw,
  ShieldCheck, ShieldX, Camera
} from 'lucide-react'
import { Heading, Text, Button, Container, Card, StatCard, Badge } from '@/components/ui'
import { AnimateOnScroll, StaggerChildren, PageTransition } from '@/components/motion'
import * as store from '@/lib/store'

type Tab = 'overview' | 'trivia' | 'votes' | 'costumes' | 'participants'

export function AdminPage() {
  const [tab, setTab] = useState<Tab>('overview')
  const [stats, setStats] = useState(store.getStats())
  const [triviaResults, setTriviaResults] = useState(store.getTriviaLeaderboard())
  const [voteCounts, setVoteCounts] = useState(store.getVoteCounts())
  const [participants, setParticipants] = useState(store.getAllParticipants())
  const [pendingCostumes, setPendingCostumes] = useState(store.getPendingCostumes())
  const [approvedCostumes, setApprovedCostumes] = useState(store.getApprovedCostumes())
  const [allCostumes, setAllCostumes] = useState(store.getAllCostumes())

  const refreshData = useCallback(() => {
    setStats(store.getStats())
    setTriviaResults(store.getTriviaLeaderboard())
    setVoteCounts(store.getVoteCounts())
    setParticipants(store.getAllParticipants())
    setPendingCostumes(store.getPendingCostumes())
    setApprovedCostumes(store.getApprovedCostumes())
    setAllCostumes(store.getAllCostumes())
  }, [])

  useEffect(() => {
    const interval = setInterval(refreshData, 5000)
    return () => clearInterval(interval)
  }, [refreshData])

  const totalVotes = Object.values(voteCounts).reduce((sum, n) => sum + n, 0)

  const handleReview = (costumeId: string, status: 'approved' | 'rejected') => {
    store.reviewCostume(costumeId, status)
    refreshData()
  }

  const costumeNameMap = Object.fromEntries(
    approvedCostumes.map(c => [c.id, `${c.title} (${c.participantName})`])
  )

  const tabItems: { id: Tab; label: string; icon: typeof Trophy; badge?: number }[] = [
    { id: 'overview', label: 'סקירה', icon: LayoutDashboard },
    { id: 'costumes', label: 'תחפושות', icon: Camera, badge: stats.pendingCostumes },
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
              {t.badge ? (
                <span className="bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full min-w-[20px] text-center">
                  {t.badge}
                </span>
              ) : null}
            </button>
          ))}
        </div>

        {/* Overview */}
        {tab === 'overview' && (
          <>
            <StaggerChildren staggerDelay={0.1} className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
              <StatCard value={String(stats.totalParticipants)} label="משתתפים" />
              <StatCard value={String(stats.totalTriviaPlayers)} label="שיחקו טריוויה" />
              <StatCard value={String(stats.totalVotes)} label="הצבעות" />
              <StatCard value={`${stats.totalCostumes} (${stats.pendingCostumes} ממתינות)`} label="תחפושות" />
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
                          <Text>{costumeNameMap[candidateId] ?? candidateId}</Text>
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

        {/* Costumes Moderation */}
        {tab === 'costumes' && (
          <AnimateOnScroll variant="fade-up">
            {/* Pending */}
            <Heading level={4} className="text-white mb-4">
              ממתינות לאישור ({pendingCostumes.length})
            </Heading>
            {pendingCostumes.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
                {pendingCostumes.map(c => (
                  <Card key={c.id} variant="top" className="overflow-hidden">
                    <div className="aspect-[3/4] overflow-hidden">
                      <img src={c.imageData} alt={c.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="p-4">
                      <Text className="font-semibold mb-1">{c.title}</Text>
                      <Text variant="muted" size="xs" className="mb-3">מאת: {c.participantName}</Text>
                      <div className="flex gap-2">
                        <Button
                          variant="primary"
                          size="sm"
                          icon={<ShieldCheck className="w-4 h-4" />}
                          onClick={() => handleReview(c.id, 'approved')}
                          className="flex-1"
                        >
                          אישור
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          icon={<ShieldX className="w-4 h-4" />}
                          onClick={() => handleReview(c.id, 'rejected')}
                          className="flex-1 text-red-400 hover:text-red-300"
                        >
                          דחייה
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <Card variant="accent" className="p-6 text-center mb-10">
                <Text variant="muted">אין תחפושות ממתינות</Text>
              </Card>
            )}

            {/* Approved */}
            <Heading level={4} className="text-white mb-4">
              מאושרות ({approvedCostumes.length})
            </Heading>
            {approvedCostumes.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mb-10">
                {approvedCostumes.map(c => (
                  <div key={c.id} className="border border-emerald-500/20 bg-emerald-500/5 overflow-hidden">
                    <div className="aspect-square overflow-hidden">
                      <img src={c.imageData} alt={c.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="p-2">
                      <Text size="xs" className="font-semibold">{c.title}</Text>
                      <Text variant="muted" size="xs">{c.participantName}</Text>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <Text variant="muted" className="mb-10">אין תחפושות מאושרות עדיין</Text>
            )}

            {/* Rejected */}
            {allCostumes.filter(c => c.status === 'rejected').length > 0 && (
              <>
                <Heading level={4} className="text-white mb-4">
                  נדחו ({allCostumes.filter(c => c.status === 'rejected').length})
                </Heading>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                  {allCostumes.filter(c => c.status === 'rejected').map(c => (
                    <div key={c.id} className="border border-red-500/20 bg-red-500/5 overflow-hidden opacity-60">
                      <div className="aspect-square overflow-hidden">
                        <img src={c.imageData} alt={c.title} className="w-full h-full object-cover" />
                      </div>
                      <div className="p-2">
                        <Text size="xs" className="font-semibold">{c.title}</Text>
                        <Text variant="muted" size="xs">{c.participantName}</Text>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </AnimateOnScroll>
        )}

        {/* Trivia */}
        {tab === 'trivia' && (
          <AnimateOnScroll variant="fade-up">
            <Heading level={4} className="text-white mb-6">דירוג טריוויה</Heading>
            {triviaResults.length > 0 ? (
              <div className="space-y-2">
                {triviaResults.map((r, i) => (
                  <div key={r.participantId}
                    className={`flex items-center gap-4 p-4 border ${
                      i === 0 ? 'border-amber-500/30 bg-amber-500/5' : 'border-white/5 bg-white/[0.02]'
                    }`}>
                    <span className={`text-xl font-bold w-8 text-center ${
                      i === 0 ? 'text-amber-400' : i === 1 ? 'text-gray-300' : i === 2 ? 'text-amber-600' : 'text-text-muted'
                    }`}>{i + 1}</span>
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

        {/* Votes */}
        {tab === 'votes' && (
          <AnimateOnScroll variant="fade-up">
            <Heading level={4} className="text-white mb-6">תוצאות הצבעות</Heading>
            {approvedCostumes.length > 0 ? (
              <>
                <div className="space-y-4 mb-8">
                  {approvedCostumes
                    .map(c => ({ ...c, votes: voteCounts[c.id] ?? 0 }))
                    .sort((a, b) => b.votes - a.votes)
                    .map((c, i) => (
                      <div key={c.id} className="flex items-center gap-4">
                        <img src={c.imageData} alt={c.title} className="w-10 h-10 object-cover shrink-0" />
                        <div className="w-28 shrink-0">
                          <Text size="sm" className="font-semibold">{c.title}</Text>
                          <Text variant="muted" size="xs">{c.participantName}</Text>
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
              </>
            ) : (
              <Card variant="accent" className="p-8 text-center">
                <Vote className="w-12 h-12 text-text-muted mx-auto mb-3" />
                <Text variant="muted">עדיין אין תחפושות מאושרות להצבעה</Text>
              </Card>
            )}
          </AnimateOnScroll>
        )}

        {/* Participants */}
        {tab === 'participants' && (
          <AnimateOnScroll variant="fade-up">
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
