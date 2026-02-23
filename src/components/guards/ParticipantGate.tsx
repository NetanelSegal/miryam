import { useState, type FormEvent, type ReactNode } from 'react'
import { motion } from 'motion/react'
import { UserCircle } from 'lucide-react'
import { Heading, Text, Button, Input, Container } from '@/components/ui'
import { useParticipant } from '@/contexts/ParticipantContext'

export function ParticipantGate({ children }: { children: ReactNode }) {
  const { isIdentified, identify } = useParticipant()
  const [name, setName] = useState('')

  if (isIdentified) return <>{children}</>

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return
    identify(name.trim())
  }

  return (
    <Container size="sm" className="py-12 min-h-[60vh] flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-sm text-center"
      >
        <UserCircle className="w-16 h-16 mx-auto mb-4 text-accent-violet" />
        <Heading level={3} gradient className="mb-2">
          מי את/ה?
        </Heading>
        <Text variant="secondary" className="mb-8">
          הכניסו את השם שלכם כדי להשתתף
        </Text>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="השם שלך"
            placeholder="למשל: נועה"
            value={name}
            onChange={(e) => setName((e.target as HTMLInputElement).value)}
            onKeyDown={(e) => { if (e.key === 'Enter') handleSubmit(e) }}
            required
          />

          <Button
            variant="primary"
            size="lg"
            type="submit"
            className="w-full"
            disabled={!name.trim()}
          >
            בואו נתחיל!
          </Button>
        </form>
      </motion.div>
    </Container>
  )
}
