import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Heading, Text, Button, Container } from '@/components/ui'
import { PageTransition } from '@/components/motion'
import { confetti } from '@/lib/confetti'
import { useRequiredParticipant } from '@/hooks'
import { ParticipantGate } from '@/components/guards/ParticipantGate'
import * as store from '@/lib/store'
import * as triviaStore from '@/lib/trivia-store'
import type { TriviaQuestion } from '@/lib/trivia-store'
import { Share2, ArrowRight, Trophy, Sparkles, Loader2, AlertCircle } from 'lucide-react'

type Phase = 'loading' | 'error' | 'start' | 'playing' | 'result'

function getScoreMessage(score: number, total: number): string {
  const pct = total > 0 ? score / total : 0
  if (pct === 1) return 'מושלם! את/ה מכירים את מרים הכי טוב!'
  if (pct >= 0.7) return 'כל הכבוד! את/ה ממש מכירים את מרים'
  if (pct >= 0.4) return 'לא רע! יש עוד מה ללמוד על מרים'
  return 'אופס... אולי תעקבו אחרי מרים ברשתות?'
}

function TriviaGame() {
  const participant = useRequiredParticipant()
  const { id: participantId, name: participantName } = participant
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const [questions, setQuestions] = useState<TriviaQuestion[]>([])
  const [phase, setPhase] = useState<Phase>('loading')
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [score, setScore] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showFeedback, setShowFeedback] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        const existing = store.getTriviaResult(participantId)
        const qs = await triviaStore.getAllQuestions()

        if (cancelled) return

        setQuestions(qs)

        if (existing) {
          setScore(existing.score)
          setPhase('result')
        } else if (qs.length === 0) {
          setPhase('error')
        } else {
          setPhase('start')
        }
      } catch {
        if (!cancelled) setPhase('error')
      }
    }

    load()
    return () => { cancelled = true }
  }, [participantId])

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [])

  useEffect(() => {
    if (phase === 'result' && questions.length > 0 && score === questions.length) {
      const timer = setTimeout(() => confetti(), 300)
      return () => clearTimeout(timer)
    }
  }, [phase, score, questions.length])

  const handleStart = useCallback(() => {
    setPhase('playing')
    setCurrentQuestion(0)
    setScore(0)
    setSelectedAnswer(null)
    setShowFeedback(false)
  }, [])

  const handleAnswer = useCallback((index: number) => {
    if (showFeedback) return
    const q = questions[currentQuestion]
    if (!q) return

    setSelectedAnswer(index)
    setShowFeedback(true)

    const isCorrect = index === q.correct
    const newScore = isCorrect ? score + 1 : score
    if (isCorrect) setScore(newScore)

    timeoutRef.current = setTimeout(() => {
      const next = currentQuestion + 1
      if (next >= questions.length) {
        store.saveTriviaResult({
          participantId,
          participantName,
          score: newScore,
          totalQuestions: questions.length,
        })
        setPhase('result')
      } else {
        setCurrentQuestion(next)
        setSelectedAnswer(null)
        setShowFeedback(false)
      }
    }, 1500)
  }, [showFeedback, currentQuestion, score, participantId, participantName, questions])

  const handleShare = useCallback(async () => {
    const text = `קיבלתי ${score}/${questions.length} בטריוויה של מרים! 🎉 נסו גם: ${window.location.origin}/party/trivia`
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      timeoutRef.current = setTimeout(() => setCopied(false), 2000)
    } catch { /* silent */ }
  }, [score, questions.length])

  return (
    <PageTransition>
      <Container size="sm" className="py-12 min-h-[60vh] flex flex-col items-center justify-center">
        <AnimatePresence mode="wait">
          {phase === 'loading' && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center"
            >
              <Loader2 className="w-10 h-10 mx-auto animate-spin text-accent-violet" />
              <Text variant="muted" className="mt-4">טוען שאלות...</Text>
            </motion.div>
          )}

          {phase === 'error' && (
            <motion.div
              key="error"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="w-full text-center space-y-6"
            >
              <AlertCircle className="w-12 h-12 mx-auto text-red-400" />
              <Heading level={4} className="text-white">לא ניתן לטעון את הטריוויה</Heading>
              <Text variant="secondary">אין שאלות זמינות כרגע. נסו שוב מאוחר יותר.</Text>
              <Button variant="secondary" href="/party" icon={<ArrowRight className="w-4 h-4" />}>
                חזרה למתחם
              </Button>
            </motion.div>
          )}

          {phase === 'start' && (
            <motion.div
              key="start"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="w-full text-center space-y-8"
            >
              <div className="space-y-3">
                <Sparkles className="w-10 h-10 mx-auto text-accent-violet" />
                <Heading level={2} gradient>הטריוויה של מרים</Heading>
                <Text variant="secondary" size="lg">
                  שלום {participantName}! {questions.length} שאלות, ניסיון אחד. מוכנים?
                </Text>
              </div>
              <div className="max-w-xs mx-auto">
                <Button variant="primary" size="lg" onClick={handleStart} className="w-full">
                  התחילו
                </Button>
              </div>
            </motion.div>
          )}

          {phase === 'playing' && questions[currentQuestion] && (
            <QuestionScreen
              key={`q-${currentQuestion}`}
              question={questions[currentQuestion]}
              questionIndex={currentQuestion}
              totalQuestions={questions.length}
              selectedAnswer={selectedAnswer}
              showFeedback={showFeedback}
              onAnswer={handleAnswer}
            />
          )}

          {phase === 'result' && (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="w-full text-center space-y-8"
            >
              <div className="space-y-2">
                <Trophy className="w-12 h-12 mx-auto text-accent-violet" />
                <Text variant="secondary" size="lg">{participantName},</Text>
              </div>
              <div className="space-y-4">
                <div className="text-7xl md:text-9xl font-bold font-heading gradient-text leading-none">
                  {score}/{questions.length}
                </div>
                <Text variant="secondary" size="lg">{getScoreMessage(score, questions.length)}</Text>
              </div>
              <div className="flex flex-col gap-3 max-w-xs mx-auto">
                <Button variant="primary" size="md" icon={<Share2 className="w-4 h-4" />} onClick={handleShare}>
                  {copied ? 'הועתק!' : 'שתפו תוצאה'}
                </Button>
                <Button variant="secondary" size="md" href="/party" icon={<ArrowRight className="w-4 h-4" />}>
                  חזרה למתחם
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Container>
    </PageTransition>
  )
}

function QuestionScreen({
  question: q, questionIndex, totalQuestions, selectedAnswer, showFeedback, onAnswer,
}: {
  question: TriviaQuestion
  questionIndex: number
  totalQuestions: number
  selectedAnswer: number | null
  showFeedback: boolean
  onAnswer: (i: number) => void
}) {
  const progress = ((questionIndex + 1) / totalQuestions) * 100

  return (
    <motion.div
      initial={{ opacity: 0, x: -40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 40 }}
      transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
      className="w-full space-y-6"
    >
      <div className="flex items-center justify-between mb-2">
        <Text variant="muted" size="sm">{questionIndex + 1} / {totalQuestions}</Text>
      </div>
      <div className="w-full h-1.5 bg-white/10 overflow-hidden">
        <motion.div
          className="h-full bg-gradient-brand"
          initial={{ width: `${(questionIndex / totalQuestions) * 100}%` }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.4 }}
        />
      </div>
      <Heading level={4} className="text-center py-4">{q.question}</Heading>
      <div className="grid gap-3">
        {q.options.map((option, i) => {
          let cls = 'border-2 border-border-neutral bg-white/5 hover:border-accent-indigo hover:bg-white/10'
          if (showFeedback) {
            if (i === q.correct) cls = 'border-2 border-emerald-500 bg-emerald-500/15 text-emerald-300'
            else if (i === selectedAnswer && i !== q.correct) cls = 'border-2 border-red-500 bg-red-500/15 text-red-300'
            else cls = 'border-2 border-border-neutral bg-white/5 opacity-50'
          }
          return (
            <button key={i} onClick={() => onAnswer(i)} disabled={showFeedback}
              className={`w-full px-5 py-4 text-right text-white transition-all duration-200 disabled:cursor-default ${cls}`}>
              {option}
            </button>
          )
        })}
      </div>
    </motion.div>
  )
}

export function TriviaPage() {
  return (
    <ParticipantGate>
      <TriviaGame />
    </ParticipantGate>
  )
}
