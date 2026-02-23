import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Trophy, MessageSquareHeart, Crown, Cake } from 'lucide-react'
import { Heading, Text, Countdown } from '@/components/ui'

const ROTATE_INTERVAL = 8000
const SECTION_COUNT = 4

const voteResults = [
  { name: 'הכוכבת', votes: 55 },
  { name: 'הנסיכה', votes: 42 },
  { name: 'השודדת', votes: 38 },
  { name: 'הגיבורה', votes: 31 },
]

const latestBlessings = [
  'מרים המלכה! יום הולדת שמח מותק 💕',
  'מזל טוב מרים!! תמיד שמחה לראות את התוכן שלך 🎉',
  'יום הולדת שמח! את השראה אמיתית 🌟',
]

const leaderboard = [
  { rank: 1, name: 'נועה', score: 10 },
  { rank: 2, name: 'אור', score: 9 },
  { rank: 3, name: 'שירה', score: 8 },
  { rank: 4, name: 'דניאל', score: 7 },
  { rank: 5, name: 'מיכל', score: 6 },
]

const maxVotes = Math.max(...voteResults.map(v => v.votes))

const birthdayTarget = new Date('2026-03-15T18:00:00')

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

function VotingResultsSection() {
  return (
    <div className="w-full max-w-3xl mx-auto px-6">
      <SectionLabel icon={Crown} label="תחרות התחפושות" />
      <div className="space-y-6">
        {voteResults.map((entry, i) => (
          <motion.div
            key={entry.name}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.15, duration: 0.5 }}
            className="flex items-center gap-4"
          >
            <Text size="xl" className="font-bold w-28 md:w-36 text-left shrink-0">
              {entry.name}
            </Text>
            <div className="flex-1 h-12 md:h-14 bg-white/5 relative overflow-hidden">
              <motion.div
                className="absolute inset-y-0 right-0 bg-gradient-to-l from-[#6366f1] to-[#a855f7]"
                initial={{ width: 0 }}
                animate={{ width: `${(entry.votes / maxVotes) * 100}%` }}
                transition={{ duration: 1, delay: 0.3 + i * 0.15, ease: [0.25, 0.1, 0.25, 1] }}
              />
              <span className="absolute inset-0 flex items-center px-4 text-lg font-bold text-white z-10">
                {entry.votes}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

function BlessingsSection() {
  return (
    <div className="w-full max-w-3xl mx-auto px-6">
      <SectionLabel icon={MessageSquareHeart} label="ברכות אחרונות" />
      <div className="space-y-6">
        {latestBlessings.map((blessing, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.3, duration: 0.6 }}
            className="bg-white/5 border border-white/10 p-6 md:p-8"
          >
            <Text size="xl" className="leading-relaxed">{blessing}</Text>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

function LeaderboardSection() {
  return (
    <div className="w-full max-w-2xl mx-auto px-6">
      <SectionLabel icon={Trophy} label="טבלת הטריוויה" />
      <div className="space-y-3">
        {leaderboard.map((entry, i) => (
          <motion.div
            key={entry.name}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.12, duration: 0.4 }}
            className={`flex items-center gap-4 p-4 md:p-5 border ${
              entry.rank === 1
                ? 'border-amber-500/30 bg-amber-500/5'
                : 'border-white/5 bg-white/[0.02]'
            }`}
          >
            <span className={`text-2xl md:text-3xl font-heading font-bold w-10 text-center ${
              entry.rank === 1 ? 'text-amber-400' : entry.rank === 2 ? 'text-gray-300' : entry.rank === 3 ? 'text-amber-600' : 'text-text-muted'
            }`}>
              {entry.rank}
            </span>
            <Text size="xl" className="flex-1 font-semibold">{entry.name}</Text>
            <Text size="xl" className="font-bold gradient-text">{entry.score}/10</Text>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

function BirthdaySection() {
  return (
    <div className="flex flex-col items-center justify-center text-center px-6">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
      >
        <Cake className="w-16 h-16 md:w-20 md:h-20 text-accent-purple mx-auto mb-6" />
        <Heading level={1} gradient className="mb-4">
          יום הולדת שמח מרים!
        </Heading>
        <Text variant="secondary" size="xl" className="mb-10 md:mb-14">
          החגיגה בעיצומה ✨
        </Text>
        <Countdown targetDate={birthdayTarget} className="justify-center" />
      </motion.div>
    </div>
  )
}

const sections = [VotingResultsSection, BlessingsSection, LeaderboardSection, BirthdaySection]

export function LivePage() {
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex(prev => (prev + 1) % SECTION_COUNT)
    }, ROTATE_INTERVAL)
    return () => clearInterval(timer)
  }, [])

  const ActiveSection = sections[activeIndex]!

  return (
    <div className="fixed inset-0 bg-[#0a0a0a] flex flex-col overflow-hidden">
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-accent-indigo/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-accent-purple/5 blur-[100px] pointer-events-none" />

      <div className="flex-1 flex items-center justify-center relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
            className="w-full"
          >
            <ActiveSection />
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex items-center justify-center gap-2 pb-6 relative z-10">
        {Array.from({ length: SECTION_COUNT }).map((_, i) => (
          <div
            key={i}
            className={`h-1.5 rounded-none transition-all duration-500 ${
              i === activeIndex ? 'w-8 bg-gradient-to-l from-[#6366f1] to-[#a855f7]' : 'w-3 bg-white/20'
            }`}
          />
        ))}
      </div>
    </div>
  )
}
