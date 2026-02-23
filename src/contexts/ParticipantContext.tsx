import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import { createParticipant, findParticipant, type Participant } from '@/lib/store'

interface ParticipantState {
  participant: Participant | null
  isIdentified: boolean
  identify: (name: string, phoneDigits: string) => Participant
  clear: () => void
}

const ParticipantContext = createContext<ParticipantState | null>(null)

const SESSION_KEY = 'miryam_participant'

function getSessionParticipant(): Participant | null {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY)
    return raw ? JSON.parse(raw) : null
  } catch { return null }
}

export function useParticipant() {
  const ctx = useContext(ParticipantContext)
  if (!ctx) throw new Error('useParticipant must be used within ParticipantProvider')
  return ctx
}

export function ParticipantProvider({ children }: { children: ReactNode }) {
  const [participant, setParticipant] = useState<Participant | null>(getSessionParticipant)

  const identify = useCallback((name: string, phoneDigits: string): Participant => {
    const existing = findParticipant(name, phoneDigits)
    const p = existing ?? createParticipant(name, phoneDigits)
    setParticipant(p)
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(p))
    return p
  }, [])

  const clear = useCallback(() => {
    setParticipant(null)
    sessionStorage.removeItem(SESSION_KEY)
  }, [])

  return (
    <ParticipantContext.Provider value={{ participant, isIdentified: participant !== null, identify, clear }}>
      {children}
    </ParticipantContext.Provider>
  )
}
