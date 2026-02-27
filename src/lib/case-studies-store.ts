import { collection, doc, getDocs, setDoc, updateDoc, deleteDoc, query, orderBy, onSnapshot } from 'firebase/firestore'
import { db } from './firebase'
import { uploadImage, deleteStorageFileByUrl } from './storage-upload'
import { withTimeout, omitUndefined } from './utils'

/** Upload case study image to Storage, return download URL. */
export async function uploadCaseStudyImage(file: File): Promise<string> {
  return uploadImage('case-studies', file)
}

/** Delete case study image from Storage by URL. No-op if not a Storage URL. */
export async function deleteCaseStudyImage(url: string): Promise<void> {
  return deleteStorageFileByUrl(url)
}

/** Safe image src for display: ensures https for Storage URLs, encodes local paths. */
export function getCaseStudyImageSrc(url: string | undefined): string {
  if (!url) return ''
  try {
    if (url.startsWith('http')) return url
    if (url.includes('firebasestorage.googleapis.com') && !url.startsWith('http'))
      return `https://${url.replace(/^\/+/, '')}`
    return encodeURI(url)
  } catch {
    return ''
  }
}

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

/** Subscribe to case studies in real time. Returns unsubscribe. */
export function subscribeToCaseStudies(
  callback: (studies: CaseStudy[]) => void,
  onError?: (err: Error) => void,
): () => void {
  const col = collection(db, COLLECTION)
  return onSnapshot(
    col,
    (snap) => {
      const studies = snap.docs
        .map(d => ({ id: d.id, ...d.data() } as CaseStudy))
        .sort((a, b) => (a.order ?? 999) - (b.order ?? 999))
      callback(studies)
    },
    (err) => {
      onError?.(err)
      callback([])
    },
  )
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

export async function deleteCaseStudy(id: string, imageUrl?: string): Promise<void> {
  if (imageUrl) await deleteStorageFileByUrl(imageUrl)
  await withTimeout(deleteDoc(doc(db, COLLECTION, id)), 10_000, 'deleteCaseStudy')
}
