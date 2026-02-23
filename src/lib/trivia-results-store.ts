import { collection, doc, getDocs, setDoc, query, orderBy, where } from 'firebase/firestore'
import { db } from './firebase'

export interface TriviaResult {
  participantId: string
  participantName: string
  score: number
  totalQuestions: number
  timestamp: number
}

const COLLECTION = 'triviaResults'

function withTimeout<T>(p: Promise<T>, ms: number, label: string): Promise<T> {
  return new Promise((resolve, reject) => {
    const t = setTimeout(() => reject(new Error(`${label}: timeout`)), ms)
    p.then(v => { clearTimeout(t); resolve(v) }).catch(e => { clearTimeout(t); reject(e) })
  })
}

export async function getTriviaResult(participantId: string): Promise<TriviaResult | undefined> {
  const snap = await withTimeout(
    getDocs(query(collection(db, COLLECTION), where('participantId', '==', participantId))),
    10_000,
    'getTriviaResult',
  )
  const d = snap.docs[0]
  return d ? ({ ...d.data() } as TriviaResult) : undefined
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
  const results = snap.docs.map(d => ({ ...d.data() } as TriviaResult))
  return results.sort((a, b) => (b.score !== a.score ? b.score - a.score : a.timestamp - b.timestamp))
}
