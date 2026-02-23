import {
  collection, doc, getDocs, setDoc, updateDoc, query, orderBy, where,
} from 'firebase/firestore'
import { db } from './firebase'

export interface CostumeEntry {
  id: string
  participantId: string
  participantName: string
  title: string
  imageData: string
  status: 'pending' | 'approved' | 'rejected'
  submittedAt: number
  reviewedAt?: number
}

const COLLECTION = 'costumes'

function withTimeout<T>(p: Promise<T>, ms: number, label: string): Promise<T> {
  return new Promise((resolve, reject) => {
    const t = setTimeout(() => reject(new Error(`${label}: timeout`)), ms)
    p.then(v => { clearTimeout(t); resolve(v) }).catch(e => { clearTimeout(t); reject(e) })
  })
}

function mapDoc(d: { id: string; data: () => Record<string, unknown> }): CostumeEntry {
  return { id: d.id, ...d.data() } as CostumeEntry
}

export async function submitCostume(entry: Omit<CostumeEntry, 'id' | 'status' | 'submittedAt'>): Promise<CostumeEntry> {
  const id = crypto.randomUUID()
  const costume: CostumeEntry = {
    ...entry,
    id,
    status: 'pending',
    submittedAt: Date.now(),
  }
  await withTimeout(setDoc(doc(db, COLLECTION, id), costume), 15_000, 'submitCostume')
  return costume
}

export async function getCostumeByParticipant(participantId: string): Promise<CostumeEntry | undefined> {
  const snap = await withTimeout(
    getDocs(query(collection(db, COLLECTION), where('participantId', '==', participantId))),
    10_000,
    'getCostumeByParticipant',
  )
  const d = snap.docs[0]
  return d ? mapDoc(d) : undefined
}

export async function getApprovedCostumes(): Promise<CostumeEntry[]> {
  const snap = await withTimeout(
    getDocs(query(collection(db, COLLECTION), where('status', '==', 'approved'), orderBy('submittedAt', 'asc'))),
    10_000,
    'getApprovedCostumes',
  )
  return snap.docs.map(mapDoc)
}

export async function getPendingCostumes(): Promise<CostumeEntry[]> {
  const snap = await withTimeout(
    getDocs(query(collection(db, COLLECTION), where('status', '==', 'pending'), orderBy('submittedAt', 'asc'))),
    10_000,
    'getPendingCostumes',
  )
  return snap.docs.map(mapDoc)
}

export async function getAllCostumes(): Promise<CostumeEntry[]> {
  const snap = await withTimeout(
    getDocs(query(collection(db, COLLECTION), orderBy('submittedAt', 'desc'))),
    10_000,
    'getAllCostumes',
  )
  return snap.docs.map(mapDoc)
}

export async function reviewCostume(costumeId: string, status: 'approved' | 'rejected'): Promise<void> {
  await withTimeout(
    updateDoc(doc(db, COLLECTION, costumeId), { status, reviewedAt: Date.now() }),
    10_000,
    'reviewCostume',
  )
}
