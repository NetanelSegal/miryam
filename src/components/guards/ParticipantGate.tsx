import { useState, type ReactNode } from 'react'
import { motion } from 'motion/react'
import { LogIn, Loader2 } from 'lucide-react'
import { Heading, Text, Container, LoadingState } from '@/components/ui'
import { useParticipant } from '@/contexts/ParticipantContext'
import { GoogleIcon } from '@/components/icons/GoogleIcon'

export function ParticipantGate({ children }: { children: ReactNode }) {
  const { isIdentified, loading, signInWithGoogle } = useParticipant()
  const [signingIn, setSigningIn] = useState(false)
  const [error, setError] = useState('')

  if (loading) {
    return (
      <Container size="sm" className="py-12 min-h-[60vh] flex items-center justify-center">
        <LoadingState />
      </Container>
    )
  }

  if (isIdentified) return <>{children}</>

  const handleSignIn = async () => {
    setError('')
    setSigningIn(true)
    try {
      await signInWithGoogle()
    } catch (err) {
      const code = (err as { code?: string }).code
      if (code === 'auth/popup-closed-by-user') {
        setSigningIn(false)
        return
      }
      if (code === 'auth/popup-blocked' || code === 'auth/cancelled-popup-request') {
        return
      }
      setError('שגיאה בהתחברות. נסו שנית.')
    } finally {
      setSigningIn(false)
    }
  }

  return (
    <Container size="sm" className="py-12 min-h-[60vh] flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-sm text-center"
      >
        <LogIn className="w-16 h-16 mx-auto mb-4 text-accent-violet" />
        <Heading level={3} gradient className="mb-2">
          התחברות
        </Heading>
        <Text variant="secondary" className="mb-8">
          התחברו עם חשבון Google כדי להשתתף בפעילויות
        </Text>

        <button
          onClick={handleSignIn}
          disabled={signingIn}
          className="w-full flex items-center justify-center gap-3 bg-white text-gray-800 font-medium px-6 py-3.5 hover:bg-gray-100 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {signingIn ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <GoogleIcon className="w-5 h-5" />
          )}
          {signingIn ? 'מתחבר...' : 'התחברות עם Google'}
        </button>

        {error && (
          <Text variant="muted" size="sm" className="text-red-400 mt-4">{error}</Text>
        )}

        <Text variant="muted" size="xs" className="mt-6">
          ההתחברות מאפשרת לנו לזהות אתכם בצורה מאובטחת ולמנוע הצבעות כפולות
        </Text>
      </motion.div>
    </Container>
  )
}
