import { collection, doc, getDocs, setDoc, deleteDoc, query, orderBy, where } from 'firebase/firestore'
import { db } from './firebase'
import { withTimeout } from './utils'

export interface TriviaResult {
  id?: string
  participantId: string
  participantName: string
  score: number
  totalQuestions: number
  timestamp: number
}

const COLLECTION = 'triviaResults'

export async function getTriviaResult(participantId: string): Promise<TriviaResult | undefined> {
  const snap = await withTimeout(
    getDocs(query(collection(db, COLLECTION), where('participantId', '==', participantId))),
    10_000,
    'getTriviaResult',
  )
  const d = snap.docs[0]
  return d ? ({ id: d.id, ...d.data() } as TriviaResult) : undefined
}

export async function saveTriviaResult(result: Omit<TriviaResult, 'timestamp'>): Promise<TriviaResult> {
  const entry: TriviaResult = { ...result, timestamp: Date.now() }
  const id = crypto.randomUUID()
  await withTimeout(setDoc(doc(db, COLLECTION, id), entry), 10_000, 'saveTriviaResult')
  return entry
}

export async function getTriviaLeaderboard(): Promise<TriviaResult[]> {
  const snap = await withTimeout(
    getDocs(query(collection(db, COLLECTION), orderBy('score', 'desc'))),
    10_000,
    'getTriviaLeaderboard',
  )
  const results = snap.docs.map(d => ({ id: d.id, ...d.data() } as TriviaResult))
  return results.sort((a, b) => (b.score !== a.score ? b.score - a.score : a.timestamp - b.timestamp))
}

export async function deleteTriviaResult(id: string): Promise<void> {
  await withTimeout(deleteDoc(doc(db, COLLECTION, id)), 10_000, 'deleteTriviaResult')
}
