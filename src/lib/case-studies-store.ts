import { collection, doc, getDocs, setDoc, updateDoc, deleteDoc, query, orderBy } from 'firebase/firestore'
import { db } from './firebase'
import { withTimeout, omitUndefined } from './utils'

export interface CaseStudy {
  id: string
  brand: string
  title: string
  description: string
  metric: string
  imageUrl: string
  order: number
}

const COLLECTION = 'caseStudies'

export async function getAllCaseStudies(): Promise<CaseStudy[]> {
  const snap = await withTimeout(
    getDocs(query(collection(db, COLLECTION), orderBy('order', 'asc'))),
    10_000,
    'getAllCaseStudies',
  )
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as CaseStudy))
}

export async function addCaseStudy(data: Omit<CaseStudy, 'id'>): Promise<CaseStudy> {
  const id = crypto.randomUUID()
  await withTimeout(setDoc(doc(db, COLLECTION, id), data), 10_000, 'addCaseStudy')
  return { id, ...data }
}

export async function updateCaseStudy(id: string, data: Partial<Omit<CaseStudy, 'id'>>): Promise<void> {
  const clean = omitUndefined(data as Record<string, unknown>) as Record<string, string | number>
  if (Object.keys(clean).length === 0) return
  await withTimeout(updateDoc(doc(db, COLLECTION, id), clean), 10_000, 'updateCaseStudy')
}

export async function deleteCaseStudy(id: string): Promise<void> {
  await withTimeout(deleteDoc(doc(db, COLLECTION, id)), 10_000, 'deleteCaseStudy')
}
