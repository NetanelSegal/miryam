import { Gamepad2, MessageSquareHeart, BookOpen, Vote, PartyPopper } from 'lucide-react'
import { Heading, Text, Card, Container, Badge } from '@/components/ui'
import { AnimateOnScroll, StaggerChildren, PageTransition } from '@/components/motion'
import { Link } from 'react-router'

const modules = [
  {
    to: 'trivia',
    icon: Gamepad2,
    title: 'טריוויה',
    description: 'כמה את/ה באמת מכירים את מרים? 10 שאלות מאתגרות',
    badge: '10 שאלות',
    color: 'text-purple-400',
  },
  {
    to: 'blessings',
    icon: MessageSquareHeart,
    title: 'קיר ברכות',
    description: 'השאירו ברכה למרים והיו חלק מהחגיגה',
    badge: 'כתבו ברכה',
    color: 'text-pink-400',
  },
  {
    to: 'dictionary',
    icon: BookOpen,
    title: 'המילון של מרים',
    description: 'המושגים שכל מי שעוקב אחרי מרים חייב להכיר',
    badge: '5 מושגים',
    color: 'text-blue-400',
  },
  {
    to: 'vote',
    icon: Vote,
    title: 'תחרות תחפושות',
    description: 'הצביעו לתחפושת הכי מגניבה במסיבה',
    badge: 'הצביעו!',
    color: 'text-amber-400',
  },
]

export function PartyHub() {
  return (
    <PageTransition>
      <Container size="md" className="py-12">
        {/* Hero intro */}
        <AnimateOnScroll variant="fade-up">
          <div className="text-center mb-16">
            <PartyPopper className="w-14 h-14 mx-auto mb-4 text-accent-violet" />
            <Heading level={1} gradient className="mb-4">
              מתחם המסיבה
            </Heading>
            <Text variant="secondary" size="lg" className="max-w-md mx-auto">
              ברוכים הבאים למסיבת יום ההולדת של מרים! בחרו הפעלה והצטרפו לחגיגה
            </Text>
          </div>
        </AnimateOnScroll>

        {/* Activity grid */}
        <StaggerChildren staggerDelay={0.12} className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {modules.map((mod) => (
            <Link key={mod.to} to={mod.to} className="block group">
              <Card variant="accent" className="p-8 h-full flex flex-col items-center text-center gap-4 transition-all duration-300 group-hover:border-accent-violet/50 group-hover:translate-y-[-2px]">
                <mod.icon className={`w-12 h-12 ${mod.color} transition-transform duration-300 group-hover:scale-110`} />
                <div>
                  <Heading level={4} className="text-white mb-2">
                    {mod.title}
                  </Heading>
                  <Text variant="secondary" size="sm" className="mb-3">
                    {mod.description}
                  </Text>
                  <Badge>{mod.badge}</Badge>
                </div>
              </Card>
            </Link>
          ))}
        </StaggerChildren>
      </Container>
    </PageTransition>
  )
}
