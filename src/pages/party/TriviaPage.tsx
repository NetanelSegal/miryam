import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Heading, Text, Button, Container } from '@/components/ui'
import { PageTransition } from '@/components/motion'
import { confetti } from '@/lib/confetti'
import { useParticipant } from '@/contexts/ParticipantContext'
import { ParticipantGate } from '@/components/guards/ParticipantGate'
import * as store from '@/lib/store'
import { Share2, ArrowRight, Trophy, Sparkles } from 'lucide-react'

const questions = [
  { question: 'באיזה תאריך נולדה מרים?', options: ['5 במרץ', '27 בפברואר', '15 באפריל', '1 בינואר'], correct: 0 },
  { question: 'באיזו פלטפורמה מרים התחילה את הקריירה שלה?', options: ['TikTok', 'Instagram', 'YouTube', 'Twitter'], correct: 0 },
  { question: 'עם איזה מותג מרים שיתפה פעולה בקמפיין שקיבל מעל 2.7M צפיות?', options: ["L'Oréal", 'MAC', 'Dior', 'Chanel'], correct: 0 },
  { question: 'מה המזל של מרים?', options: ['דגים', 'מאזניים', 'בתולה', 'טלה'], correct: 0 },
  { question: 'איזו יוצרת תוכן ישראלית חברה של מרים?', options: ['נועה בוגוסלבסקי', 'נועה קירל', 'אגם בוחבוט', 'ליהיא גרינר'], correct: 0 },
  { question: 'באיזו תוכנית טלוויזיה מרים הופיעה?', options: ['אז ככה', 'האח הגדול', 'הישרדות', "נינג'ה ישראל"], correct: 0 },
  { question: 'מתי מרים פרסמה את הפוסט הראשון שלה באינסטגרם?', options: ['ספטמבר 2020', 'ינואר 2019', 'יוני 2021', 'מרץ 2018'], correct: 0 },
  { question: 'באיזו מדינה מרים נולדה?', options: ['ישראל', 'ארה"ב', 'צרפת', 'אנגליה'], correct: 0 },
  { question: 'על איזה נושא מרים העלתה מודעות ציבורית?', options: ['שימוש לרעה ב-AI', 'זכויות בעלי חיים', 'איכות הסביבה', 'חינוך'], correct: 0 },
  { question: 'כמה עוקבים יש למרים בטיקטוק?', options: ['600K+', '100K', '1M+', '300K'], correct: 0 },
] as const

type Phase = 'start' | 'playing' | 'result'

function getScoreMessage(score: number): string {
  if (score === 10) return 'מושלם! את/ה מכירים את מרים הכי טוב!'
  if (score >= 7) return 'כל הכבוד! את/ה ממש מכירים את מרים'
  if (score >= 4) return 'לא רע! יש עוד מה ללמוד על מרים'
  return 'אופס... אולי תעקבו אחרי מרים ברשתות?'
}

function TriviaGame() {
  const { participant } = useParticipant()
  const participantId = participant!.id
  const participantName = participant!.name

  const [phase, setPhase] = useState<Phase>(() => {
    const existing = store.getTriviaResult(participantId)
    return existing ? 'result' : 'start'
  })
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [score, setScore] = useState(() => {
    const existing = store.getTriviaResult(participantId)
    return existing?.score ?? 0
  })
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showFeedback, setShowFeedback] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (phase === 'result' && score === 10) {
      const timer = setTimeout(() => confetti(), 300)
      return () => clearTimeout(timer)
    }
  }, [phase, score])

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

    setTimeout(() => {
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
  }, [showFeedback, currentQuestion, score, participantId, participantName])

  const handleShare = useCallback(async () => {
    const text = `קיבלתי ${score}/10 בטריוויה של מרים! 🎉 נסו גם: ${window.location.origin}/party/trivia`
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch { /* silent */ }
  }, [score])

  return (
    <PageTransition>
      <Container size="sm" className="py-12 min-h-[60vh] flex flex-col items-center justify-center">
        <AnimatePresence mode="wait">
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
                  שלום {participantName}! 10 שאלות, ניסיון אחד. מוכנים?
                </Text>
              </div>
              <div className="max-w-xs mx-auto">
                <Button variant="primary" size="lg" onClick={handleStart} className="w-full">
                  התחילו
                </Button>
              </div>
            </motion.div>
          )}

          {phase === 'playing' && (
            <QuestionScreen
              key={`q-${currentQuestion}`}
              questionIndex={currentQuestion}
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
                <Text variant="secondary" size="lg">{getScoreMessage(score)}</Text>
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
  questionIndex, selectedAnswer, showFeedback, onAnswer,
}: {
  questionIndex: number; selectedAnswer: number | null; showFeedback: boolean; onAnswer: (i: number) => void
}) {
  const q = questions[questionIndex]
  if (!q) return null
  const progress = ((questionIndex + 1) / questions.length) * 100

  return (
    <motion.div
      initial={{ opacity: 0, x: -40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 40 }}
      transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
      className="w-full space-y-6"
    >
      <div className="flex items-center justify-between mb-2">
        <Text variant="muted" size="sm">{questionIndex + 1} / {questions.length}</Text>
      </div>
      <div className="w-full h-1.5 bg-white/10 overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-l from-accent-violet to-accent-indigo"
          initial={{ width: `${(questionIndex / questions.length) * 100}%` }}
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
