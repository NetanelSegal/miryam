import { Heading, Text, Container } from '@/components/ui'
import { PageTransition } from '@/components/motion'

export function TriviaPage() {
  return (
    <PageTransition>
      <Container size="sm" className="py-12 text-center">
        <Heading level={2} gradient className="mb-4">הטריוויה של מרים</Heading>
        <Text variant="secondary">בקרוב...</Text>
      </Container>
    </PageTransition>
  )
}
