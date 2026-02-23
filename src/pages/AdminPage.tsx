import { useState, useCallback } from 'react'
import {
  LayoutDashboard, Gamepad2, Vote,
  Users, Camera, RefreshCw, LogOut, Shield,
} from 'lucide-react'
import { Heading, Container, Button } from '@/components/ui'
import { useParticipant } from '@/contexts/ParticipantContext'
import { AnimateOnScroll, PageTransition } from '@/components/motion'
import { useAutoRefresh } from '@/hooks'
import * as store from '@/lib/store'
import { AdminOverview } from './admin/AdminOverview'
import { AdminCostumes } from './admin/AdminCostumes'
import { AdminTrivia } from './admin/AdminTrivia'
import { AdminVotes } from './admin/AdminVotes'
import { AdminParticipants } from './admin/AdminParticipants'
import { AdminAdmins } from './admin/AdminAdmins'

type Tab = 'overview' | 'trivia' | 'votes' | 'costumes' | 'participants' | 'admins'

function getAllData() {
  return {
    stats: store.getStats(),
    triviaResults: store.getTriviaLeaderboard(),
    voteCounts: store.getVoteCounts(),
    participants: store.getAllParticipants(),
    pendingCostumes: store.getPendingCostumes(),
    approvedCostumes: store.getApprovedCostumes(),
    allCostumes: store.getAllCostumes(),
  }
}

export function AdminPage() {
  const { signOut } = useParticipant()
  const [tab, setTab] = useState<Tab>('overview')
  const [data, refreshData] = useAutoRefresh(getAllData, 5000)

  const handleReview = useCallback((costumeId: string, status: 'approved' | 'rejected') => {
    store.reviewCostume(costumeId, status)
    refreshData()
  }, [refreshData])

  const tabItems: { id: Tab; label: string; icon: typeof Camera; badge?: number }[] = [
    { id: 'overview', label: 'סקירה', icon: LayoutDashboard },
    { id: 'costumes', label: 'תחפושות', icon: Camera, badge: data.stats.pendingCostumes || undefined },
    { id: 'trivia', label: 'טריוויה', icon: Gamepad2 },
    { id: 'votes', label: 'הצבעות', icon: Vote },
    { id: 'participants', label: 'משתתפים', icon: Users },
    { id: 'admins', label: 'אדמינים', icon: Shield },
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
            <div className="flex items-center gap-2">
              <button onClick={refreshData} className="text-text-muted hover:text-white transition-colors p-2" title="רענון">
                <RefreshCw className="w-5 h-5" />
              </button>
              <Button variant="ghost" size="sm" icon={<LogOut className="w-4 h-4" />} onClick={signOut}>
                התנתקות
              </Button>
            </div>
          </div>
        </AnimateOnScroll>

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

        <AnimateOnScroll variant="fade-up">
          {tab === 'overview' && (
            <AdminOverview
              stats={data.stats}
              triviaResults={data.triviaResults}
              voteCounts={data.voteCounts}
              approvedCostumes={data.approvedCostumes}
            />
          )}
          {tab === 'costumes' && (
            <AdminCostumes
              pendingCostumes={data.pendingCostumes}
              approvedCostumes={data.approvedCostumes}
              allCostumes={data.allCostumes}
              onReview={handleReview}
            />
          )}
          {tab === 'trivia' && <AdminTrivia triviaResults={data.triviaResults} />}
          {tab === 'votes' && <AdminVotes approvedCostumes={data.approvedCostumes} voteCounts={data.voteCounts} />}
          {tab === 'participants' && <AdminParticipants participants={data.participants} />}
          {tab === 'admins' && <AdminAdmins />}
        </AnimateOnScroll>
      </Container>
    </PageTransition>
  )
}
