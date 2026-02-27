import { collection, doc, getDocs, setDoc, updateDoc, deleteDoc, query, orderBy, onSnapshot } from 'firebase/firestore'
import { db } from './firebase'
import { uploadImage, deleteStorageFileByUrl } from './storage-upload'
import { withTimeout, omitUndefined } from './utils'

export interface Blessing {
  id: string
  name: string
  message: string
  photoURL?: string
  timestamp: number
}

const COLLECTION = 'blessings'

/** Upload photo to Storage, return download URL. Compresses before upload. */
export async function uploadBlessingPhoto(file: File): Promise<string> {
  return uploadImage('blessings', file)
}

export async function saveBlessing(blessing: Omit<Blessing, 'id' | 'timestamp'>): Promise<Blessing> {
  const id = crypto.randomUUID()
  const entry: Blessing = { ...blessing, id, timestamp: Date.now() }
  const data = omitUndefined(entry as unknown as Record<string, unknown>) as Record<string, string | number>
  await withTimeout(setDoc(doc(db, COLLECTION, id), data), 10_000, 'saveBlessing')
  return entry
}

export async function getAllBlessings(): Promise<Blessing[]> {
  const snap = await withTimeout(
    getDocs(query(collection(db, COLLECTION), orderBy('timestamp', 'desc'))),
    10_000,
    'getAllBlessings',
  )
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as Blessing))
}

/** Subscribe to blessings in real time. Returns unsubscribe. */
export function subscribeToBlessings(callback: (blessings: Blessing[]) => void): () => void {
  const q = query(collection(db, COLLECTION), orderBy('timestamp', 'desc'))
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map(d => ({ id: d.id, ...d.data() } as Blessing)))
  })
}

export async function updateBlessing(id: string, data: Partial<Omit<Blessing, 'id' | 'timestamp'>>): Promise<void> {
  const clean = omitUndefined(data as Record<string, unknown>) as Record<string, string>
  if (Object.keys(clean).length === 0) return
  await withTimeout(updateDoc(doc(db, COLLECTION, id), clean), 10_000, 'updateBlessing')
}

export async function deleteBlessing(id: string, photoURL?: string): Promise<void> {
  if (photoURL) await deleteStorageFileByUrl(photoURL)
  await withTimeout(deleteDoc(doc(db, COLLECTION, id)), 10_000, 'deleteBlessing')
}
