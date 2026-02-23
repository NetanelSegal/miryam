import { Heading, Text, Container } from '@/components/ui'
import { PageTransition } from '@/components/motion'

export function DictionaryPage() {
  return (
    <PageTransition>
      <Container size="sm" className="py-12 text-center">
        <Heading level={2} gradient className="mb-4">המילון של מרים</Heading>
        <Text variant="secondary">בקרוב...</Text>
      </Container>
    </PageTransition>
  )
}
