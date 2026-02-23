import {
  collection, doc, getDocs, setDoc, updateDoc, deleteDoc,
  query, orderBy, writeBatch,
} from 'firebase/firestore'
import { db } from './firebase'

export interface DictionaryTerm {
  id: string
  term: string
  explanation: string
  order: number
}

const COLLECTION = 'dictionary'

function colRef() {
  return collection(db, COLLECTION)
}

function withTimeout<T>(promise: Promise<T>, ms: number, label: string): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error(`${label}: timeout after ${ms}ms`)), ms)
    promise
      .then(val => { clearTimeout(timer); resolve(val) })
      .catch(err => { clearTimeout(timer); reject(err) })
  })
}

export async function getAllTerms(): Promise<DictionaryTerm[]> {
  const snap = await withTimeout(
    getDocs(query(colRef(), orderBy('order', 'asc'))),
    10_000,
    'getAllTerms',
  )
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as DictionaryTerm))
}

export async function addTerm(data: Omit<DictionaryTerm, 'id'>): Promise<DictionaryTerm> {
  const id = crypto.randomUUID()
  await withTimeout(setDoc(doc(db, COLLECTION, id), data), 10_000, 'addTerm')
  return { id, ...data }
}

export async function updateTerm(id: string, data: Partial<Omit<DictionaryTerm, 'id'>>): Promise<void> {
  await withTimeout(updateDoc(doc(db, COLLECTION, id), data), 10_000, 'updateTerm')
}

export async function deleteTerm(id: string): Promise<void> {
  await withTimeout(deleteDoc(doc(db, COLLECTION, id)), 10_000, 'deleteTerm')
}

export async function reorderTerms(terms: DictionaryTerm[]): Promise<void> {
  const batch = writeBatch(db)
  terms.forEach((t, i) => {
    batch.update(doc(db, COLLECTION, t.id), { order: i })
  })
  await withTimeout(batch.commit(), 15_000, 'reorderTerms')
}

const DEFAULT_TERMS: Omit<DictionaryTerm, 'id'>[] = [
  { term: 'פוב', explanation: 'Point of View — סגנון סרטונים בגוף ראשון שמרים מתמחה בו. כשאת רואה את העולם דרך העיניים של מרים.', order: 0 },
  { term: 'סטורי טיים', explanation: 'כשמרים מספרת סיפור מהחיים שלה בצורה דרמטית ומשעשעת, בדרך כלל עם טוויסט בסוף.', order: 1 },
  { term: 'גלאם דאון', explanation: 'המעבר מהלוק המושלם של הצילומים ללוק הביתי האמיתי. מרים מראה את שני הצדדים.', order: 2 },
  { term: 'קולאב', explanation: 'שיתוף פעולה עם מותג או יוצר תוכן אחר. כשמרים עושה קולאב, זה תמיד הופך לוויראלי.', order: 3 },
  { term: 'GRWM', explanation: 'Get Ready With Me — סרטון הכנה בו מרים מתארגנת לאירוע ומשתפת טיפים ומוצרים אהובים.', order: 4 },
]

export async function seedDefaultTerms(): Promise<DictionaryTerm[]> {
  const existing = await getAllTerms()
  if (existing.length > 0) return existing

  const batch = writeBatch(db)
  const results: DictionaryTerm[] = []

  for (const t of DEFAULT_TERMS) {
    const id = crypto.randomUUID()
    batch.set(doc(db, COLLECTION, id), t)
    results.push({ id, ...t })
  }

  await withTimeout(batch.commit(), 15_000, 'seedDefaultTerms')
  return results
}
