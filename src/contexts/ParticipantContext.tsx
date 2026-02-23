import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react'
import {
  onAuthStateChanged, signInWithPopup, signInWithRedirect,
  getRedirectResult, signOut as firebaseSignOut, type User,
} from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { auth, googleProvider, db } from '@/lib/firebase'
import { createParticipant, type Participant } from '@/lib/participants-store'

interface ParticipantState {
  participant: Participant | null
  firebaseUser: User | null
  isIdentified: boolean
  isAdmin: boolean
  adminCheckLoading: boolean
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

async function userToParticipant(user: User): Promise<Participant> {
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
  const [isAdmin, setIsAdmin] = useState(false)
  const [adminCheckLoading, setAdminCheckLoading] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getRedirectResult(auth).catch(() => {})

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setFirebaseUser(user)
      if (user) {
        userToParticipant(user)
          .then((p) => {
            setParticipant(p)
            setLoading(false)
          })
          .catch(() => setLoading(false))
      } else {
        setParticipant(null)
        setIsAdmin(false)
        setAdminCheckLoading(false)
        setLoading(false)
      }
    })
    return unsubscribe
  }, [])

  useEffect(() => {
    if (!firebaseUser?.email) {
      setIsAdmin(false)
      setAdminCheckLoading(false)
      return
    }
    let cancelled = false
    setAdminCheckLoading(true)
    getDoc(doc(db, 'admins', firebaseUser.email!))
      .then((snap) => {
        if (!cancelled) setIsAdmin(snap.exists())
      })
      .catch(() => {
        if (!cancelled) setIsAdmin(false)
      })
      .finally(() => {
        if (!cancelled) setAdminCheckLoading(false)
      })
    return () => { cancelled = true }
  }, [firebaseUser?.email])

  const signInWithGoogle = useCallback(async () => {
    try {
      await signInWithPopup(auth, googleProvider)
    } catch (err) {
      const code = (err as { code?: string }).code
      if (code === 'auth/popup-closed-by-user') throw err
      if (code === 'auth/popup-blocked' || code === 'auth/cancelled-popup-request') {
        await signInWithRedirect(auth, googleProvider)
        return
      }
      if (import.meta.env.DEV) console.error('Google sign-in error:', err)
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
      isAdmin,
      adminCheckLoading,
      loading,
      signInWithGoogle,
      signOut,
    }}>
      {children}
    </ParticipantContext.Provider>
  )
}
