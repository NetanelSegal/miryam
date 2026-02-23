import { LayoutDashboard, MessageSquareHeart, Gamepad2, Vote, Mail, Settings } from 'lucide-react'
import { Heading, Text, Container, Card, StatCard } from '@/components/ui'
import { AnimateOnScroll, StaggerChildren, PageTransition } from '@/components/motion'

const stats = [
  { value: '127', label: 'ברכות', icon: MessageSquareHeart },
  { value: '89', label: 'שיחקו טריוויה', icon: Gamepad2 },
  { value: '166', label: 'הצבעות', icon: Vote },
  { value: '12', label: 'פניות B2B', icon: Mail },
]

const quickLinks = [
  { title: 'ניהול ברכות', description: 'סינון, אישור ומחיקת ברכות', icon: MessageSquareHeart },
  { title: 'ניהול טריוויה', description: 'עריכת שאלות ותשובות', icon: Gamepad2 },
  { title: 'ניהול הצבעות', description: 'הוספת מועמדים וצפייה בתוצאות', icon: Vote },
  { title: 'פניות ליצירת קשר', description: 'צפייה ומענה לפניות B2B', icon: Mail },
  { title: 'הגדרות', description: 'הגדרות כלליות של האתר', icon: Settings },
]

export function AdminPage() {
  return (
    <PageTransition>
      <Container size="lg" className="py-12">
        <AnimateOnScroll variant="fade-up">
          <div className="flex items-center gap-3 mb-8">
            <LayoutDashboard className="w-8 h-8 text-accent-violet" />
            <Heading level={2} gradient>ניהול האתר</Heading>
          </div>
        </AnimateOnScroll>

        {/* Stats Overview */}
        <StaggerChildren staggerDelay={0.1} className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {stats.map((stat) => (
            <StatCard key={stat.label} value={stat.value} label={stat.label} />
          ))}
        </StaggerChildren>

        {/* Quick Links */}
        <AnimateOnScroll variant="fade-up">
          <Heading level={4} className="text-white mb-6">ניהול מהיר</Heading>
        </AnimateOnScroll>

        <StaggerChildren staggerDelay={0.08} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickLinks.map((link) => (
            <Card key={link.title} variant="accent" className="p-6 cursor-pointer hover:border-accent-violet/50 transition-all duration-300">
              <link.icon className="w-8 h-8 text-accent-violet mb-3" />
              <Heading level={5} className="text-white mb-1">{link.title}</Heading>
              <Text variant="secondary" size="sm">{link.description}</Text>
            </Card>
          ))}
        </StaggerChildren>
      </Container>
    </PageTransition>
  )
}
