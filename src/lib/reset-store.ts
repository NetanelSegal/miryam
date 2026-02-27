/**
 * Reset Firestore collections and Storage.
 * Used before re-seeding to ensure clean state with Storage URLs only.
 * Does NOT touch: admins, settings/event
 */

import { collection, doc, getDocs, deleteDoc, writeBatch } from 'firebase/firestore'
import { ref, listAll, deleteObject } from 'firebase/storage'
import { db, storage } from './firebase'

const BATCH_SIZE = 500

const FIRESTORE_COLLECTIONS = [
  'brands',
  'caseStudies',
  'participants',
  'triviaResults',
  'votes',
  'costumes',
  'blessings',
  'contacts',
  'dictionary',
  'triviaQuestions',
] as const

/** Delete all documents in a Firestore collection. Uses batches of 500. */
async function deleteCollection(collPath: string): Promise<number> {
  const col = collection(db, collPath)
  let deleted = 0
  let snap = await getDocs(col)
  while (!snap.empty) {
    const batch = writeBatch(db)
    const docs = snap.docs.slice(0, BATCH_SIZE)
    for (const d of docs) {
      batch.delete(d.ref)
      deleted++
    }
    await batch.commit()
    snap = await getDocs(col)
  }
  return deleted
}

/** Delete mediaKit/socialStats document. */
async function deleteMediaKitStats(): Promise<void> {
  try {
    const docRef = doc(db, 'mediaKit', 'socialStats')
    await deleteDoc(docRef)
  } catch {
    /* doc may not exist */
  }
}

/** Delete all files under a Storage path. */
async function deleteStorageFolder(path: string): Promise<number> {
  const folderRef = ref(storage, path)
  let total = 0
  try {
    const res = await listAll(folderRef)
    await Promise.all(res.items.map((itemRef) => deleteObject(itemRef)))
    total = res.items.length
    for (const prefix of res.prefixes) {
      const sub = await deleteStorageFolder(prefix.fullPath)
      total += sub
    }
  } catch (e) {
    if ((e as { code?: string })?.code === 'storage/object-not-found') return 0
    throw e
  }
  return total
}

/** Reset all Firestore collections (except admins, settings/event). */
export async function resetAllFirestore(): Promise<void> {
  for (const coll of FIRESTORE_COLLECTIONS) {
    await deleteCollection(coll)
  }
  await deleteMediaKitStats()
}

/** Reset case-studies Storage folder. */
export async function resetCaseStudiesStorage(): Promise<number> {
  return deleteStorageFolder('case-studies')
}

/** Reset costumes Storage folder. */
export async function resetCostumesStorage(): Promise<number> {
  return deleteStorageFolder('costumes')
}

/** Reset blessings Storage folder. */
export async function resetBlessingsStorage(): Promise<number> {
  return deleteStorageFolder('blessings')
}

/** Reset all image Storage folders. */
export async function resetAllStorage(): Promise<{ caseStudies: number; costumes: number; blessings: number }> {
  const [caseStudies, costumes, blessings] = await Promise.all([
    resetCaseStudiesStorage(),
    resetCostumesStorage(),
    resetBlessingsStorage(),
  ])
  return { caseStudies, costumes, blessings }
}
