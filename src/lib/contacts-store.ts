import { collection, doc, getDocs, setDoc, query, orderBy } from 'firebase/firestore'
import { db } from './firebase'
import { withTimeout } from './utils'

export interface ContactSubmission {
  id: string
  name: string
  company: string
  email: string
  message: string
  timestamp: number
}

const COLLECTION = 'contacts'

export async function saveContact(contact: Omit<ContactSubmission, 'id' | 'timestamp'>): Promise<ContactSubmission> {
  const id = crypto.randomUUID()
  const entry: ContactSubmission = { ...contact, id, timestamp: Date.now() }
  await withTimeout(setDoc(doc(db, COLLECTION, id), entry), 10_000, 'saveContact')
  return entry
}

export async function getAllContacts(): Promise<ContactSubmission[]> {
  const snap = await withTimeout(
    getDocs(query(collection(db, COLLECTION), orderBy('timestamp', 'desc'))),
    10_000,
    'getAllContacts',
  )
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as ContactSubmission))
}
