import { collection, doc, getDoc, getDocs, setDoc, query, orderBy } from 'firebase/firestore'
import { db } from './firebase'
import { withTimeout } from './utils'

export interface Participant {
  id: string
  name: string
  email?: string
  photoURL?: string
  createdAt: number
}

const COLLECTION = 'participants'

export async function findParticipantById(id: string): Promise<Participant | undefined> {
  const snap = await withTimeout(getDoc(doc(db, COLLECTION, id)), 10_000, 'findParticipant')
  if (!snap.exists()) return undefined
  return { id: snap.id, ...snap.data() } as Participant
}

export async function createParticipant(data: { id?: string; name: string; email?: string; photoURL?: string }): Promise<Participant> {
  const id = data.id ?? crypto.randomUUID()
  const existing = await findParticipantById(id)
  if (existing) {
    if (existing.name !== data.name || existing.photoURL !== data.photoURL) {
      await withTimeout(setDoc(doc(db, COLLECTION, id), { ...existing, ...data }), 10_000, 'updateParticipant')
      return { ...existing, ...data }
    }
    return existing
  }
  const participant: Participant = { id, name: data.name, email: data.email, photoURL: data.photoURL, createdAt: Date.now() }
  await withTimeout(setDoc(doc(db, COLLECTION, id), participant), 10_000, 'createParticipant')
  return participant
}

export async function getAllParticipants(): Promise<Participant[]> {
  const snap = await withTimeout(
    getDocs(query(collection(db, COLLECTION), orderBy('createdAt', 'desc'))),
    10_000,
    'getAllParticipants',
  )
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as Participant))
}
