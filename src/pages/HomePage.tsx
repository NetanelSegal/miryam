import { Heading, Text, Button, Countdown } from '@/components/ui'
import { AnimateOnScroll } from '@/components/motion'

const BIRTHDAY = new Date('2026-03-05T00:00:00')

export function HomePage() {
  return (
    <div className="min-h-screen">
      <section className="relative flex flex-col items-center justify-center min-h-screen px-4 text-center">
        <AnimateOnScroll variant="fade" duration={0.8}>
          <Heading level={1} gradient className="mb-4">
            מרים סגל
          </Heading>
        </AnimateOnScroll>

        <AnimateOnScroll variant="fade-up" delay={0.2}>
          <Text variant="secondary" size="xl" className="mb-8 max-w-md">
            יוצרת תוכן · לייפסטייל · משפחה
          </Text>
        </AnimateOnScroll>

        <AnimateOnScroll variant="fade-up" delay={0.4}>
          <Countdown targetDate={BIRTHDAY} className="mb-10" />
        </AnimateOnScroll>

        <AnimateOnScroll variant="fade-up" delay={0.6}>
          <Button variant="cta" size="lg" href="/party">
            היכנסו למסיבה
          </Button>
        </AnimateOnScroll>
      </section>
    </div>
  )
}
