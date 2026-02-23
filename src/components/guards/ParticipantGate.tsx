import { useState, type FormEvent, type ReactNode } from 'react'
import { motion } from 'motion/react'
import { UserCircle } from 'lucide-react'
import { Heading, Text, Button, Input, Container } from '@/components/ui'
import { useParticipant } from '@/contexts/ParticipantContext'

export function ParticipantGate({ children }: { children: ReactNode }) {
  const { isIdentified, identify } = useParticipant()
  const [name, setName] = useState('')
  const [phoneDigits, setPhoneDigits] = useState('')
  const [error, setError] = useState('')

  if (isIdentified) return <>{children}</>

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    setError('')

    if (!name.trim()) {
      setError('אנא הכניסו את השם שלכם')
      return
    }
    if (phoneDigits.length !== 4 || !/^\d{4}$/.test(phoneDigits)) {
      setError('אנא הכניסו 4 ספרות')
      return
    }

    identify(name.trim(), phoneDigits)
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
          הזדהות משתתף
        </Heading>
        <Text variant="secondary" className="mb-8">
          כדי להשתתף בפעילויות, הכניסו את הפרטים שלכם
        </Text>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="השם שלך"
            placeholder="למשל: נועה"
            value={name}
            onChange={(e) => setName((e.target as HTMLInputElement).value)}
            required
          />
          <Input
            label="4 ספרות אחרונות של הטלפון"
            placeholder="1234"
            value={phoneDigits}
            onChange={(e) => {
              const val = (e.target as HTMLInputElement).value.replace(/\D/g, '').slice(0, 4)
              setPhoneDigits(val)
            }}
            inputMode="numeric"
            maxLength={4}
            dir="ltr"
            required
            helperText="של אמא, אבא או שלכם"
          />

          {error && <Text variant="muted" size="sm" className="text-red-400">{error}</Text>}

          <Button
            variant="primary"
            size="lg"
            type="submit"
            className="w-full"
            disabled={!name.trim() || phoneDigits.length !== 4}
          >
            בואו נתחיל!
          </Button>
        </form>
      </motion.div>
    </Container>
  )
}
