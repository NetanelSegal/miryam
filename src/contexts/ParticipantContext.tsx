import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react'
import { onAuthStateChanged, signInWithPopup, signOut as firebaseSignOut, type User } from 'firebase/auth'
import { auth, googleProvider } from '@/lib/firebase'
import { createParticipant, type Participant } from '@/lib/store'

interface ParticipantState {
  participant: Participant | null
  firebaseUser: User | null
  isIdentified: boolean
  loading: boolean
  signInWithGoogle: () => Promise<void>
  signOut: () => Promise<void>
}

const ParticipantContext = createContext<ParticipantState | null>(null)

export function useParticipant() {
  const ctx = useContext(ParticipantContext)
  if (!ctx) throw new Error('useParticipant must be used within ParticipantProvider')
  return ctx
}

function userToParticipant(user: User): Participant {
  return createParticipant({
    id: user.uid,
    name: user.displayName ?? 'אורח',
    email: user.email ?? undefined,
    photoURL: user.photoURL ?? undefined,
  })
}

export function ParticipantProvider({ children }: { children: ReactNode }) {
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null)
  const [participant, setParticipant] = useState<Participant | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setFirebaseUser(user)
      if (user) {
        const p = userToParticipant(user)
        setParticipant(p)
      } else {
        setParticipant(null)
      }
      setLoading(false)
    })
    return unsubscribe
  }, [])

  const signInWithGoogle = useCallback(async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider)
      const p = userToParticipant(result.user)
      setParticipant(p)
    } catch (err) {
      if ((err as { code?: string }).code !== 'auth/popup-closed-by-user') {
        console.error('Google sign-in error:', err)
      }
      throw err
    }
  }, [])

  const signOut = useCallback(async () => {
    await firebaseSignOut(auth)
    setParticipant(null)
    setFirebaseUser(null)
  }, [])

  return (
    <ParticipantContext.Provider value={{
      participant,
      firebaseUser,
      isIdentified: participant !== null,
      loading,
      signInWithGoogle,
      signOut,
    }}>
      {children}
    </ParticipantContext.Provider>
  )
}
