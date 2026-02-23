import { Heading, Text, Container } from '@/components/ui'
import { PageTransition } from '@/components/motion'

export function BlessingsPage() {
  return (
    <PageTransition>
      <Container size="md" className="py-12 text-center">
        <Heading level={2} gradient className="mb-4">קיר ברכות</Heading>
        <Text variant="secondary">בקרוב...</Text>
      </Container>
    </PageTransition>
  )
}
