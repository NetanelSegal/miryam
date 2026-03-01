import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import * as store from '@/lib/store'
import { ROTATE_INTERVAL, SECTION_COUNT } from './constants'
import { VotingResultsSection } from './VotingResultsSection'
import { BlessingsSection } from './BlessingsSection'
import { LeaderboardSection } from './LeaderboardSection'
import { BirthdaySection } from './BirthdaySection'

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
    <div className="fixed inset-0 bg-bg flex flex-col overflow-hidden">
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

      <div className="flex items-center justify-center gap-4 pb-6 relative z-10">
        <button
          type="button"
          onClick={() => setActiveIndex((prev) => (prev - 1 + SECTION_COUNT) % SECTION_COUNT)}
          className="p-2 text-white/60 hover:text-white transition-colors"
          aria-label="מסך קודם"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div className="flex items-center gap-2">
          {Array.from({ length: SECTION_COUNT }).map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActiveIndex(i)}
              className={`h-1.5 rounded-none transition-all duration-500 ${
                i === activeIndex ? 'w-8 bg-gradient-brand' : 'w-3 bg-white/20 hover:bg-white/40'
              }`}
              aria-label={`מסך ${i + 1}`}
            />
          ))}
        </div>
        <button
          type="button"
          onClick={() => setActiveIndex((prev) => (prev + 1) % SECTION_COUNT)}
          className="p-2 text-white/60 hover:text-white transition-colors"
          aria-label="מסך הבא"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  )
}
