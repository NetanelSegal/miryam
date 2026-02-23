import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore'
import { db } from './firebase'

export interface EventSettings {
  votingOpen: boolean
  partyOpen: boolean
}

const DEFAULTS: EventSettings = {
  votingOpen: true,
  partyOpen: true,
}

function docRef() {
  return doc(db, 'settings', 'event')
}

export async function getSettings(): Promise<EventSettings> {
  const snap = await getDoc(docRef())
  if (!snap.exists()) return { ...DEFAULTS }
  const data = snap.data()
  return {
    votingOpen: data.votingOpen ?? DEFAULTS.votingOpen,
    partyOpen: data.partyOpen ?? DEFAULTS.partyOpen,
  }
}

export async function updateSettings(partial: Partial<EventSettings>): Promise<void> {
  const ref = docRef()
  const snap = await getDoc(ref)
  const current = snap.exists() ? snap.data() : {}
  const next = {
    ...DEFAULTS,
    ...current,
    ...partial,
  }
  await setDoc(ref, next)
}

export function subscribeToSettings(callback: (settings: EventSettings) => void): () => void {
  const ref = docRef()
  return onSnapshot(ref, (snap) => {
    if (!snap.exists()) {
      callback({ ...DEFAULTS })
      return
    }
    const data = snap.data()
    callback({
      votingOpen: data.votingOpen ?? DEFAULTS.votingOpen,
      partyOpen: data.partyOpen ?? DEFAULTS.partyOpen,
    })
  })
}
