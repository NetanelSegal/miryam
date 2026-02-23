import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import { createParticipant, type Participant } from '@/lib/store'

interface ParticipantState {
  participant: Participant | null
  isIdentified: boolean
  identify: (name: string) => Participant
  clear: () => void
}

const ParticipantContext = createContext<ParticipantState | null>(null)

const DEVICE_KEY = 'miryam_device_participant'

function getDeviceParticipant(): Participant | null {
  try {
    const raw = localStorage.getItem(DEVICE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch { return null }
}

export function useParticipant() {
  const ctx = useContext(ParticipantContext)
  if (!ctx) throw new Error('useParticipant must be used within ParticipantProvider')
  return ctx
}

export function ParticipantProvider({ children }: { children: ReactNode }) {
  const [participant, setParticipant] = useState<Participant | null>(getDeviceParticipant)

  const identify = useCallback((name: string): Participant => {
    const existing = getDeviceParticipant()
    if (existing) return existing

    const p = createParticipant(name)
    setParticipant(p)
    localStorage.setItem(DEVICE_KEY, JSON.stringify(p))
    return p
  }, [])

  const clear = useCallback(() => {
    setParticipant(null)
    localStorage.removeItem(DEVICE_KEY)
  }, [])

  return (
    <ParticipantContext.Provider value={{ participant, isIdentified: participant !== null, identify, clear }}>
      {children}
    </ParticipantContext.Provider>
  )
}
