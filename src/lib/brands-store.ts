import { collection, doc, getDocs, setDoc, updateDoc, deleteDoc, query, orderBy } from 'firebase/firestore'
import { db } from './firebase'
import { withTimeout, omitUndefined } from './utils'

export interface Brand {
  id: string
  name: string
  order: number
}

const COLLECTION = 'brands'

export async function getAllBrands(): Promise<Brand[]> {
  const snap = await withTimeout(
    getDocs(query(collection(db, COLLECTION), orderBy('order', 'asc'))),
    10_000,
    'getAllBrands',
  )
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as Brand))
}

export async function addBrand(data: Omit<Brand, 'id'>): Promise<Brand> {
  const id = crypto.randomUUID()
  await withTimeout(setDoc(doc(db, COLLECTION, id), data), 10_000, 'addBrand')
  return { id, ...data }
}

export async function updateBrand(id: string, data: Partial<Omit<Brand, 'id'>>): Promise<void> {
  const clean = omitUndefined(data as Record<string, unknown>) as Record<string, string | number>
  if (Object.keys(clean).length === 0) return
  await withTimeout(updateDoc(doc(db, COLLECTION, id), clean), 10_000, 'updateBrand')
}

export async function deleteBrand(id: string): Promise<void> {
  await withTimeout(deleteDoc(doc(db, COLLECTION, id)), 10_000, 'deleteBrand')
}
