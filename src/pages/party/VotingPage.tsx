import { useState, useCallback } from 'react'
import { motion } from 'motion/react'
import { Check } from 'lucide-react'
import { Heading, Text, Badge, Container } from '@/components/ui'
import { AnimateOnScroll, StaggerChildren } from '@/components/motion'
import { useToast } from '@/components/ui/Toast'
import { confetti } from '@/lib/confetti'

const STORAGE_KEY = 'miryam_vote_done'
const VOTED_FOR_KEY = 'miryam_voted_for'

interface Candidate {
  id: string
  name: string
  image: string
  votes: number
}

const initialCandidates: Candidate[] = [
  { id: '1', name: 'הנסיכה', image: '/images/WhatsApp Image 2026-02-23 at 10.39.45.jpeg', votes: 42 },
  { id: '2', name: 'השודדת', image: '/images/WhatsApp Image 2026-02-23 at 10.39.47.jpeg', votes: 38 },
  { id: '3', name: 'הכוכבת', image: '/images/WhatsApp Image 2026-02-23 at 10.39.50.jpeg', votes: 55 },
  { id: '4', name: 'הגיבורה', image: '/images/WhatsApp Image 2026-02-23 at 10.39.55.jpeg', votes: 31 },
]

function getStoredVote(): { hasVoted: boolean; votedFor: string | null } {
  const hasVoted = localStorage.getItem(STORAGE_KEY) === 'true'
  const votedFor = localStorage.getItem(VOTED_FOR_KEY)
  return { hasVoted, votedFor }
}

export function VotingPage() {
  const { toast } = useToast()
  const [candidates, setCandidates] = useState<Candidate[]>(initialCandidates)
  const [hasVoted, setHasVoted] = useState(() => getStoredVote().hasVoted)
  const [votedFor, setVotedFor] = useState<string | null>(() => getStoredVote().votedFor)

  const maxVotes = Math.max(...candidates.map(c => c.votes))

  const handleVote = useCallback((candidateId: string) => {
    if (hasVoted) return

    setCandidates(prev =>
      prev.map(c => c.id === candidateId ? { ...c, votes: c.votes + 1 } : c)
    )
    setHasVoted(true)
    setVotedFor(candidateId)
    localStorage.setItem(STORAGE_KEY, 'true')
    localStorage.setItem(VOTED_FOR_KEY, candidateId)

    confetti()
    toast('success', 'ההצבעה נרשמה! תודה 🎉')
  }, [hasVoted, toast])

  return (
    <Container size="md" className="py-8 md:py-12">
      <AnimateOnScroll variant="fade-up" className="text-center mb-8 md:mb-12">
        <Heading level={1} gradient>תחרות התחפושות</Heading>
        <Text variant="secondary" size="lg" className="mt-3">
          {hasVoted ? 'תודה שהצבעתם! הנה התוצאות עד כה' : 'בחרו את התחפושת האהובה עליכם'}
        </Text>
      </AnimateOnScroll>

      {!hasVoted ? (
        <StaggerChildren className="grid grid-cols-2 gap-4 md:gap-6">
          {candidates.map(candidate => (
            <motion.button
              key={candidate.id}
              onClick={() => handleVote(candidate.id)}
              className="group relative bg-bg-card border border-white/5 rounded-none overflow-hidden text-right transition-colors hover:border-accent-indigo/50"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="aspect-[3/4] overflow-hidden">
                <img
                  src={candidate.image}
                  alt={candidate.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <span className="bg-gradient-to-l from-[#6366f1] to-[#a855f7] text-white px-4 py-2 text-sm font-bold translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    הצביעו לי!
                  </span>
                </div>
              </div>
              <div className="p-3 md:p-4">
                <Text size="lg" className="font-semibold">{candidate.name}</Text>
              </div>
            </motion.button>
          ))}
        </StaggerChildren>
      ) : (
        <AnimateOnScroll variant="fade-up">
          <div className="space-y-4 md:space-y-5">
            {candidates
              .sort((a, b) => b.votes - a.votes)
              .map(candidate => (
                <div key={candidate.id} className="flex items-center gap-3 md:gap-4">
                  <img
                    src={candidate.image}
                    alt={candidate.name}
                    className="w-10 h-10 md:w-12 md:h-12 object-cover rounded-none shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5">
                      <Text size="sm" className="font-semibold">{candidate.name}</Text>
                      {votedFor === candidate.id && (
                        <Badge variant="success" className="gap-1">
                          <Check className="w-3 h-3" />
                          הבחירה שלך
                        </Badge>
                      )}
                    </div>
                    <div className="relative h-7 md:h-8 bg-white/5 rounded-none overflow-hidden">
                      <motion.div
                        className="absolute inset-y-0 right-0 bg-gradient-to-l from-[#6366f1] to-[#a855f7]"
                        initial={{ width: 0 }}
                        animate={{ width: `${(candidate.votes / maxVotes) * 100}%` }}
                        transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1], delay: 0.2 }}
                      />
                      <span className="absolute inset-0 flex items-center px-3 text-xs md:text-sm font-bold text-white z-10">
                        {candidate.votes} הצבעות
                      </span>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </AnimateOnScroll>
      )}
    </Container>
  )
}
