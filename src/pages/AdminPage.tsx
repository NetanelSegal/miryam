import { useState, useCallback, useEffect } from 'react'
import { useSearchParams } from 'react-router'
import {
  LayoutDashboard, Gamepad2, Vote,
  Users, Camera, RefreshCw, LogOut, Shield, Settings, BarChart3, BookOpen, MessageSquareHeart,
} from 'lucide-react'
import { Heading, Container, Button, LoadingState } from '@/components/ui'
import { useParticipant } from '@/contexts/ParticipantContext'
import { AnimateOnScroll, PageTransition } from '@/components/motion'
import { useAsyncAutoRefresh } from '@/hooks'
import * as store from '@/lib/store'
import { AdminOverview } from './admin/AdminOverview'
import { AdminCostumes } from './admin/AdminCostumes'
import { AdminTrivia } from './admin/AdminTrivia'
import { AdminVotes } from './admin/AdminVotes'
import { AdminParticipants } from './admin/AdminParticipants'
import { AdminAdmins } from './admin/AdminAdmins'
import { AdminSettings } from './admin/AdminSettings'
import { AdminMediaKit } from './admin/AdminMediaKit'
import { AdminDictionary } from './admin/AdminDictionary'
import { AdminBlessings } from './admin/AdminBlessings'

type Tab = 'overview' | 'trivia' | 'votes' | 'costumes' | 'blessings' | 'participants' | 'dictionary' | 'admins' | 'settings' | 'mediakit'

async function getAllData() {
  const [stats, triviaResults, voteCounts, participants, pendingCostumes, approvedCostumes, allCostumes] =
    await Promise.all([
      store.getStats(),
      store.getTriviaLeaderboard(),
      store.getVoteCounts(),
      store.getAllParticipants(),
      store.getPendingCostumes(),
      store.getApprovedCostumes(),
      store.getAllCostumes(),
    ])
  return {
    stats,
    triviaResults,
    voteCounts,
    participants,
    pendingCostumes,
    approvedCostumes,
    allCostumes,
  }
}

const VALID_TABS: Tab[] = ['overview', 'costumes', 'trivia', 'votes', 'blessings', 'participants', 'dictionary', 'admins', 'settings', 'mediakit']

export function AdminPage() {
  const { signOut } = useParticipant()
  const [searchParams, setSearchParams] = useSearchParams()
  const tabParam = searchParams.get('tab') as Tab | null
  const initialTab = tabParam && VALID_TABS.includes(tabParam) ? tabParam : 'overview'
  const [tab, setTab] = useState<Tab>(initialTab)
  const [data, loading, error, refreshData] = useAsyncAutoRefresh(getAllData, 5000)

  useEffect(() => {
    const t = searchParams.get('tab') as Tab | null
    if (t && VALID_TABS.includes(t)) setTab(t)
  }, [searchParams])

  const setTabAndUrl = useCallback((t: Tab) => {
    setTab(t)
    setSearchParams({ tab: t }, { replace: true })
  }, [setSearchParams])

  const handleReview = useCallback(async (costumeId: string, status: 'approved' | 'rejected') => {
    await store.reviewCostume(costumeId, status)
    refreshData()
  }, [refreshData])

  const handleDeleteCostume = useCallback(async (costume: { id: string; imageUrl?: string }) => {
    await store.deleteCostume(costume.id, costume.imageUrl)
    refreshData()
  }, [refreshData])

  const handleDeleteTriviaResult = useCallback(async (result: { id?: string }) => {
    if (!result.id) return
    await store.deleteTriviaResult(result.id)
    refreshData()
  }, [refreshData])

  const tabItems: { id: Tab; label: string; icon: typeof Camera; badge?: number }[] = [
    { id: 'overview', label: 'סקירה', icon: LayoutDashboard },
    { id: 'costumes', label: 'תחפושות', icon: Camera, badge: data?.stats.pendingCostumes || undefined },
    { id: 'trivia', label: 'טריוויה', icon: Gamepad2 },
    { id: 'votes', label: 'הצבעות', icon: Vote },
    { id: 'blessings', label: 'ברכות', icon: MessageSquareHeart },
    { id: 'participants', label: 'משתתפים', icon: Users },
    { id: 'dictionary', label: 'מילון', icon: BookOpen },
    { id: 'admins', label: 'אדמינים', icon: Shield },
    { id: 'settings', label: 'הגדרות', icon: Settings },
    { id: 'mediakit', label: 'Media Kit', icon: BarChart3 },
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
              onClick={() => setTabAndUrl(t.id)}
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
          {loading && !data ? (
            <LoadingState />
          ) : error ? (
            <div className="text-red-400 text-center py-8">{error.message}</div>
          ) : data ? (
            <>
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
                  onDelete={handleDeleteCostume}
                />
              )}
              {tab === 'trivia' && (
                <AdminTrivia
                  triviaResults={data.triviaResults}
                  onDeleteResult={handleDeleteTriviaResult}
                />
              )}
              {tab === 'votes' && <AdminVotes approvedCostumes={data.approvedCostumes} voteCounts={data.voteCounts} />}
              {tab === 'blessings' && <AdminBlessings />}
              {tab === 'participants' && <AdminParticipants participants={data.participants} />}
          {tab === 'dictionary' && <AdminDictionary />}
          {tab === 'admins' && <AdminAdmins />}
          {tab === 'settings' && <AdminSettings />}
          {tab === 'mediakit' && <AdminMediaKit />}
            </>
          ) : null}
        </AnimateOnScroll>
      </Container>
    </PageTransition>
  )
}
