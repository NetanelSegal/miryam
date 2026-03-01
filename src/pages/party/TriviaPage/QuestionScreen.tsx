import { motion } from 'motion/react'
import { Heading, Text } from '@/components/ui'
import type { TriviaQuestion } from '@/lib/trivia-store'

interface QuestionScreenProps {
  question: TriviaQuestion
  questionIndex: number
  totalQuestions: number
  selectedAnswer: number | null
  showFeedback: boolean
  onAnswer: (i: number) => void
}

export function QuestionScreen({
  question: q, questionIndex, totalQuestions, selectedAnswer, showFeedback, onAnswer,
}: QuestionScreenProps) {
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
