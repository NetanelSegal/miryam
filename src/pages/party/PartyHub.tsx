import { Gamepad2, MessageSquareHeart, BookOpen, Vote } from 'lucide-react'
import { Heading, Text, Card, Container } from '@/components/ui'
import { AnimateOnScroll, StaggerChildren } from '@/components/motion'
import { PageTransition } from '@/components/motion'
import { Link } from 'react-router'

const modules = [
  { to: 'trivia', icon: Gamepad2, title: 'טריוויה', description: 'כמה את/ה באמת מכירים את מרים?' },
  { to: 'blessings', icon: MessageSquareHeart, title: 'קיר ברכות', description: 'כתבו ברכה למרים' },
  { to: 'dictionary', icon: BookOpen, title: 'מילון', description: 'המושגים של מרים' },
  { to: 'vote', icon: Vote, title: 'הצבעות', description: 'התחפושת הכי טובה' },
]

export function PartyHub() {
  return (
    <PageTransition>
      <Container size="md" className="py-12">
        <AnimateOnScroll variant="fade-up">
          <Heading level={1} gradient className="text-center mb-4">
            מתחם המסיבה
          </Heading>
        </AnimateOnScroll>

        <AnimateOnScroll variant="fade-up" delay={0.1}>
          <Text variant="secondary" className="text-center mb-12">
            בחרו הפעלה והצטרפו לחגיגה
          </Text>
        </AnimateOnScroll>

        <StaggerChildren staggerDelay={0.1} className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {modules.map((mod) => (
            <Link key={mod.to} to={mod.to} className="block">
              <Card variant="accent" className="p-8 flex flex-col items-center text-center gap-4">
                <mod.icon className="w-10 h-10 text-accent-violet" />
                <Heading level={4} className="text-white">
                  {mod.title}
                </Heading>
                <Text variant="secondary" size="sm">
                  {mod.description}
                </Text>
              </Card>
            </Link>
          ))}
        </StaggerChildren>
      </Container>
    </PageTransition>
  )
}
