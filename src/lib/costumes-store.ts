import {
  collection, doc, getDocs, setDoc, updateDoc, query, orderBy, where,
} from 'firebase/firestore'
import { db } from './firebase'
import { uploadImage } from './storage-upload'
import { withTimeout } from './utils'

export interface CostumeEntry {
  id: string
  participantId: string
  participantName: string
  title: string
  /** Storage URL (new). Use getCostumeImageUrl() for display (handles legacy imageData). */
  imageUrl?: string
  /** @deprecated Legacy base64. Display: imageUrl ?? imageData */
  imageData?: string
  status: 'pending' | 'approved' | 'rejected'
  submittedAt: number
  reviewedAt?: number
}

/** Get image src for display. Handles both Storage URL (imageUrl) and legacy base64 (imageData). */
export function getCostumeImageUrl(c: CostumeEntry): string {
  return c.imageUrl ?? c.imageData ?? ''
}

const COLLECTION = 'costumes'

function mapDoc(d: { id: string; data: () => Record<string, unknown> }): CostumeEntry {
  return { id: d.id, ...d.data() } as CostumeEntry
}

/** Upload costume image to Storage, return download URL. */
export async function uploadCostumeImage(file: File): Promise<string> {
  return uploadImage('costumes', file)
}

export async function submitCostume(entry: Omit<CostumeEntry, 'id' | 'status' | 'submittedAt'> & { imageUrl: string }): Promise<CostumeEntry> {
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
