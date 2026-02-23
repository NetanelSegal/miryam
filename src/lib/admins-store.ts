import { collection, getDocs, doc, setDoc, deleteDoc } from 'firebase/firestore'
import { db } from './firebase'

const COLLECTION = 'admins'

function colRef() {
  return collection(db, COLLECTION)
}

export async function getAdmins(): Promise<string[]> {
  const snap = await getDocs(colRef())
  return snap.docs.map((d) => d.id)
}

export async function addAdmin(email: string): Promise<void> {
  const normalized = email.trim().toLowerCase()
  if (!normalized) throw new Error('אימייל ריק')
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized)) {
    throw new Error('פורמט אימייל לא תקין')
  }
  await setDoc(doc(db, COLLECTION, normalized), { role: 'admin', addedAt: Date.now() })
}

export async function removeAdmin(email: string): Promise<void> {
  await deleteDoc(doc(db, COLLECTION, email))
}
