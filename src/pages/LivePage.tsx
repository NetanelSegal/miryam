import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Trophy, MessageSquareHeart, Crown, Cake } from 'lucide-react'
import { Heading, Text, Countdown, VoteBar } from '@/components/ui'
import { getRankColor } from '@/lib/utils'
import * as store from '@/lib/store'

const ROTATE_INTERVAL = 8000
const SECTION_COUNT = 4

const birthdayTarget = new Date('2026-03-05T00:00:00')

function SectionLabel({ icon: Icon, label }: { icon: typeof Trophy; label: string }) {
  return (
    <div className="flex items-center gap-3 mb-8 md:mb-12">
      <Icon className="w-6 h-6 md:w-8 md:h-8 text-accent-indigo" />
      <Text size="xl" className="font-heading font-bold tracking-wide text-text-muted uppercase">
        {label}
      </Text>
    </div>
  )
}

function VotingResultsSection({ voteCounts, costumes }: { voteCounts: Record<string, number>; costumes: store.CostumeEntry[] }) {
  const costumeMap = Object.fromEntries(costumes.map(c => [c.id, c]))
  const entries = Object.entries(voteCounts)
    .map(([id, votes]) => ({
      id,
      name: costumeMap[id]?.title ?? id,
      participantName: costumeMap[id]?.participantName ?? '',
      imageData: costumeMap[id]?.imageData,
      votes,
    }))
    .sort((a, b) => b.votes - a.votes)
  const maxVotes = Math.max(...entries.map(e => e.votes), 1)

  return (
    <div className="w-full max-w-3xl mx-auto px-6">
      <SectionLabel icon={Crown} label="תחרות התחפושות" />
      {entries.length > 0 ? (
        <div className="space-y-6">
          {entries.map((entry, i) => (
            <motion.div key={entry.id} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.15, duration: 0.5 }} className="flex items-center gap-4">
              {entry.imageData && (
                <img src={entry.imageData} alt={entry.name} className="w-12 h-12 md:w-14 md:h-14 object-cover shrink-0" />
              )}
              <div className="w-28 md:w-36 shrink-0">
                <Text size="xl" className="font-bold">{entry.name}</Text>
                {entry.participantName && <Text variant="muted" size="xs">{entry.participantName}</Text>}
              </div>
              <div className="flex-1">
                <VoteBar votes={entry.votes} maxVotes={maxVotes} label={String(entry.votes)} size="lg" />
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <Text variant="muted" size="xl" className="text-center">ההצבעה טרם החלה</Text>
      )}
    </div>
  )
}

function BlessingsSection({ blessings }: { blessings: store.Blessing[] }) {
  const latest = blessings.slice(0, 3)
  return (
    <div className="w-full max-w-3xl mx-auto px-6">
      <SectionLabel icon={MessageSquareHeart} label="ברכות אחרונות" />
      {latest.length > 0 ? (
        <div className="space-y-6">
          {latest.map((b, i) => (
            <motion.div key={b.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.3, duration: 0.6 }} className="bg-white/5 border border-white/10 p-6 md:p-8">
              <Text size="xl" className="leading-relaxed mb-2">{b.message}</Text>
              <Text variant="muted" size="sm">— {b.name}</Text>
            </motion.div>
          ))}
        </div>
      ) : (
        <Text variant="muted" size="xl" className="text-center">עדיין אין ברכות</Text>
      )}
    </div>
  )
}

function LeaderboardSection({ leaderboard }: { leaderboard: store.TriviaResult[] }) {
  const top5 = leaderboard.slice(0, 5)
  return (
    <div className="w-full max-w-2xl mx-auto px-6">
      <SectionLabel icon={Trophy} label="טבלת הטריוויה" />
      {top5.length > 0 ? (
        <div className="space-y-3">
          {top5.map((entry, i) => (
            <motion.div key={entry.participantId} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.12, duration: 0.4 }}
              className={`flex items-center gap-4 p-4 md:p-5 border ${
                i === 0 ? 'border-amber-500/30 bg-amber-500/5' : 'border-white/5 bg-white/[0.02]'
              }`}>
              <span className={`text-2xl md:text-3xl font-heading font-bold w-10 text-center ${getRankColor(i)}`}>
                {i + 1}
              </span>
              <Text size="xl" className="flex-1 font-semibold">{entry.participantName}</Text>
              <Text size="xl" className="font-bold gradient-text">{entry.score}/{entry.totalQuestions}</Text>
            </motion.div>
          ))}
        </div>
      ) : (
        <Text variant="muted" size="xl" className="text-center">עדיין אין תוצאות</Text>
      )}
    </div>
  )
}

function BirthdaySection() {
  return (
    <div className="flex flex-col items-center justify-center text-center px-6">
      <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}>
        <Cake className="w-16 h-16 md:w-20 md:h-20 text-accent-purple mx-auto mb-6" />
        <Heading level={1} gradient className="mb-4">יום הולדת שמח מרים!</Heading>
        <Text variant="secondary" size="xl" className="mb-10 md:mb-14">החגיגה בעיצומה</Text>
        <Countdown targetDate={birthdayTarget} className="justify-center" />
      </motion.div>
    </div>
  )
}

export function LivePage() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [voteCounts, setVoteCounts] = useState<Record<string, number>>({})
  const [blessings, setBlessings] = useState<store.Blessing[]>([])
  const [leaderboard, setLeaderboard] = useState<store.TriviaResult[]>([])
  const [costumes, setCostumes] = useState<store.CostumeEntry[]>([])

  const refreshData = useCallback(async () => {
    const [counts, b, lb, c] = await Promise.all([
      store.getVoteCounts(),
      store.getAllBlessings(),
      store.getTriviaLeaderboard(),
      store.getApprovedCostumes(),
    ])
    setVoteCounts(counts)
    setBlessings(b)
    setLeaderboard(lb)
    setCostumes(c)
  }, [])

  useEffect(() => {
    refreshData()
  }, [refreshData])

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex(prev => {
        const next = (prev + 1) % SECTION_COUNT
        if (next === 0) refreshData()
        return next
      })
    }, ROTATE_INTERVAL)
    return () => clearInterval(timer)
  }, [refreshData])

  return (
    <div className="fixed inset-0 bg-[#0a0a0a] flex flex-col overflow-hidden">
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-accent-indigo/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-accent-purple/5 blur-[100px] pointer-events-none" />

      <div className="flex-1 flex items-center justify-center relative z-10">
        <AnimatePresence mode="wait">
          <motion.div key={activeIndex} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }} className="w-full">
            {activeIndex === 0 && <VotingResultsSection voteCounts={voteCounts} costumes={costumes} />}
            {activeIndex === 1 && <BlessingsSection blessings={blessings} />}
            {activeIndex === 2 && <LeaderboardSection leaderboard={leaderboard} />}
            {activeIndex === 3 && <BirthdaySection />}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex items-center justify-center gap-2 pb-6 relative z-10">
        {Array.from({ length: SECTION_COUNT }).map((_, i) => (
          <div key={i} className={`h-1.5 rounded-none transition-all duration-500 ${
            i === activeIndex ? 'w-8 bg-gradient-brand' : 'w-3 bg-white/20'
          }`} />
        ))}
      </div>
    </div>
  )
}
