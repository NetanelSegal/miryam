import { useState } from 'react'
import { LogIn, Loader2, ShieldX } from 'lucide-react'
import { Heading, Text, Button, Container, LoadingState } from '@/components/ui'
import { useParticipant } from '@/contexts/ParticipantContext'
import { GoogleIcon } from '@/components/icons/GoogleIcon'

interface AdminGuardProps {
  children: React.ReactNode
}

const SKIP_ADMIN_AUTH = import.meta.env.VITE_SKIP_ADMIN_AUTH === 'true'

export function AdminGuard({ children }: AdminGuardProps) {
  const { firebaseUser, isAdmin, adminCheckLoading, loading, signInWithGoogle, signOut } = useParticipant()
  const [signingIn, setSigningIn] = useState(false)

  if (SKIP_ADMIN_AUTH) {
    return <>{children}</>
  }

  if (loading || adminCheckLoading) {
    return <LoadingState className="min-h-screen items-center justify-center bg-bg px-4" />
  }

  if (isAdmin) {
    return <>{children}</>
  }

  if (!firebaseUser) {
    const handleSignIn = async () => {
      setSigningIn(true)
      try {
        await signInWithGoogle()
      } finally {
        setSigningIn(false)
      }
    }

    return (
      <div className="min-h-screen flex items-center justify-center bg-bg px-4">
        <Container size="sm" className="text-center">
          <LogIn className="w-16 h-16 mx-auto mb-4 text-accent-violet" />
          <Heading level={3} className="text-white mb-2">Admin Login</Heading>
          <Text variant="secondary" className="mb-6">
            התחברו עם חשבון Google מאושר כדי לגשת לאזור הניהול
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
        </Container>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg px-4">
      <Container size="sm" className="text-center">
        <ShieldX className="w-16 h-16 mx-auto mb-4 text-red-400" />
        <Heading level={3} className="text-white mb-2">אין הרשאה</Heading>
        <Text variant="secondary" className="mb-6">
          החשבון שלכם אינו מאושר כמנהל. להתחברות עם חשבון אחר, התנתקו תחילה.
        </Text>
        <Button variant="primary" onClick={signOut}>
          התנתקות
        </Button>
      </Container>
    </div>
  )
}
