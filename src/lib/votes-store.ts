import { collection, doc, getDocs, setDoc, query, orderBy } from 'firebase/firestore'
import { db } from './firebase'

export interface VoteRecord {
  participantId: string
  participantName: string
  candidateId: string
  timestamp: number
}

const COLLECTION = 'votes'

function withTimeout<T>(p: Promise<T>, ms: number, label: string): Promise<T> {
  return new Promise((resolve, reject) => {
    const t = setTimeout(() => reject(new Error(`${label}: timeout`)), ms)
    p.then(v => { clearTimeout(t); resolve(v) }).catch(e => { clearTimeout(t); reject(e) })
  })
}

export async function castVote(vote: Omit<VoteRecord, 'timestamp'>): Promise<VoteRecord> {
  const entry: VoteRecord = { ...vote, timestamp: Date.now() }
  const id = crypto.randomUUID()
  await withTimeout(setDoc(doc(db, COLLECTION, id), entry), 10_000, 'castVote')
  return entry
}

export async function getVote(participantId: string): Promise<VoteRecord | undefined> {
  const snap = await withTimeout(getDocs(collection(db, COLLECTION)), 10_000, 'getVotes')
  return snap.docs
    .map(d => ({ ...d.data() } as VoteRecord))
    .find(v => v.participantId === participantId)
}

export async function getVoteCounts(): Promise<Record<string, number>> {
  const snap = await withTimeout(getDocs(collection(db, COLLECTION)), 10_000, 'getVoteCounts')
  const counts: Record<string, number> = {}
  snap.docs.forEach(d => {
    const v = d.data() as VoteRecord
    counts[v.candidateId] = (counts[v.candidateId] ?? 0) + 1
  })
  return counts
}

export async function getAllVotes(): Promise<VoteRecord[]> {
  const snap = await withTimeout(
    getDocs(query(collection(db, COLLECTION), orderBy('timestamp', 'desc'))),
    10_000,
    'getAllVotes',
  )
  return snap.docs.map(d => ({ ...d.data() } as VoteRecord))
}
