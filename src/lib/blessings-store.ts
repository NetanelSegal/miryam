import { collection, doc, getDocs, setDoc, updateDoc, deleteDoc, query, orderBy } from 'firebase/firestore'
import { db } from './firebase'

export interface Blessing {
  id: string
  name: string
  message: string
  photoURL?: string
  timestamp: number
}

const COLLECTION = 'blessings'

function withTimeout<T>(p: Promise<T>, ms: number, label: string): Promise<T> {
  return new Promise((resolve, reject) => {
    const t = setTimeout(() => reject(new Error(`${label}: timeout`)), ms)
    p.then(v => { clearTimeout(t); resolve(v) }).catch(e => { clearTimeout(t); reject(e) })
  })
}

function omitUndefined<T extends Record<string, unknown>>(obj: T): Record<string, unknown> {
  return Object.fromEntries(Object.entries(obj).filter(([, v]) => v !== undefined))
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

export async function updateBlessing(id: string, data: Partial<Omit<Blessing, 'id' | 'timestamp'>>): Promise<void> {
  const clean = omitUndefined(data as Record<string, unknown>) as Record<string, string>
  if (Object.keys(clean).length === 0) return
  await withTimeout(updateDoc(doc(db, COLLECTION, id), clean), 10_000, 'updateBlessing')
}

export async function deleteBlessing(id: string): Promise<void> {
  await withTimeout(deleteDoc(doc(db, COLLECTION, id)), 10_000, 'deleteBlessing')
}
