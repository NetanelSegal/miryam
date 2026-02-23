import { useState, useEffect } from 'react'
import { Heading, Text, Container } from '@/components/ui'
import { AnimateOnScroll, StaggerChildren, PageTransition } from '@/components/motion'
import { Loader2 } from 'lucide-react'
import * as dictionaryStore from '@/lib/dictionary-store'

const FALLBACK_TERMS = [
  { term: 'פוב', explanation: 'Point of View — סגנון סרטונים בגוף ראשון שמרים מתמחה בו. כשאת רואה את העולם דרך העיניים של מרים.' },
  { term: 'סטורי טיים', explanation: 'כשמרים מספרת סיפור מהחיים שלה בצורה דרמטית ומשעשעת, בדרך כלל עם טוויסט בסוף.' },
  { term: 'גלאם דאון', explanation: 'המעבר מהלוק המושלם של הצילומים ללוק הביתי האמיתי. מרים מראה את שני הצדדים.' },
  { term: 'קולאב', explanation: 'שיתוף פעולה עם מותג או יוצר תוכן אחר. כשמרים עושה קולאב, זה תמיד הופך לוויראלי.' },
  { term: 'GRWM', explanation: 'Get Ready With Me — סרטון הכנה בו מרים מתארגנת לאירוע ומשתפת טיפים ומוצרים אהובים.' },
]

export function DictionaryPage() {
  const [terms, setTerms] = useState<{ term: string; explanation: string }[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    dictionaryStore.getAllTerms()
      .then(data => {
        if (!cancelled) {
          setTerms(data.length > 0 ? data.map(t => ({ term: t.term, explanation: t.explanation })) : FALLBACK_TERMS)
        }
      })
      .catch(() => {
        if (!cancelled) setTerms(FALLBACK_TERMS)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => { cancelled = true }
  }, [])
  return (
    <PageTransition>
      <Container size="sm" className="py-12">
        <AnimateOnScroll variant="fade-up">
          <Heading level={2} gradient className="text-center mb-4">
            המילון של מרים
          </Heading>
        </AnimateOnScroll>

        <AnimateOnScroll variant="fade-up" delay={0.1}>
          <Text variant="secondary" className="text-center mb-10">
            המושגים שכל מי שעוקב אחרי מרים חייב להכיר
          </Text>
        </AnimateOnScroll>

        {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-accent-violet" />
        </div>
      ) : (
        <StaggerChildren staggerDelay={0.1} className="flex flex-col gap-4">
          {terms.map((t) => (
            <div key={t.term} className="card-side rounded-none bg-bg-card p-6">
              <Heading level={4} className="mb-2 text-white">{t.term}</Heading>
              <Text variant="secondary" size="sm">{t.explanation}</Text>
            </div>
          ))}
        </StaggerChildren>
      )}
      </Container>
    </PageTransition>
  )
}
