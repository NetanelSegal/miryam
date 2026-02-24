import {
  collection, doc, getDocs, setDoc, updateDoc, deleteDoc,
  query, orderBy, writeBatch,
} from 'firebase/firestore'
import { db } from './firebase'
import { withTimeout } from './utils'

export interface TriviaQuestion {
  id: string
  question: string
  options: string[]
  correct: number
  order: number
}

const COLLECTION = 'triviaQuestions'

function colRef() {
  return collection(db, COLLECTION)
}

export async function getAllQuestions(): Promise<TriviaQuestion[]> {
  const snap = await withTimeout(
    getDocs(query(colRef(), orderBy('order', 'asc'))),
    10_000,
    'getAllQuestions',
  )
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as TriviaQuestion))
}

export async function addQuestion(data: Omit<TriviaQuestion, 'id'>): Promise<TriviaQuestion> {
  const id = crypto.randomUUID()
  await withTimeout(setDoc(doc(db, COLLECTION, id), data), 10_000, 'addQuestion')
  return { id, ...data }
}

export async function updateQuestion(id: string, data: Partial<Omit<TriviaQuestion, 'id'>>): Promise<void> {
  await withTimeout(updateDoc(doc(db, COLLECTION, id), data), 10_000, 'updateQuestion')
}

export async function deleteQuestion(id: string): Promise<void> {
  await withTimeout(deleteDoc(doc(db, COLLECTION, id)), 10_000, 'deleteQuestion')
}

export async function reorderQuestions(questions: TriviaQuestion[]): Promise<void> {
  const batch = writeBatch(db)
  questions.forEach((q, i) => {
    batch.update(doc(db, COLLECTION, q.id), { order: i })
  })
  await withTimeout(batch.commit(), 15_000, 'reorderQuestions')
}

const DEFAULT_QUESTIONS: Omit<TriviaQuestion, 'id'>[] = [
  { question: 'באיזה תאריך נולדה מרים?', options: ['5 במרץ', '27 בפברואר', '15 באפריל', '1 בינואר'], correct: 0, order: 0 },
  { question: 'באיזו פלטפורמה מרים התחילה את הקריירה שלה?', options: ['TikTok', 'Instagram', 'YouTube', 'Twitter'], correct: 0, order: 1 },
  { question: 'עם איזה מותג מרים שיתפה פעולה בקמפיין שקיבל מעל 2.7M צפיות?', options: ["L'Oréal", 'MAC', 'Dior', 'Chanel'], correct: 0, order: 2 },
  { question: 'מה המזל של מרים?', options: ['דגים', 'מאזניים', 'בתולה', 'טלה'], correct: 0, order: 3 },
  { question: 'איזו יוצרת תוכן ישראלית חברה של מרים?', options: ['נועה בוגוסלבסקי', 'נועה קירל', 'אגם בוחבוט', 'ליהיא גרינר'], correct: 0, order: 4 },
  { question: 'באיזו תוכנית טלוויזיה מרים הופיעה?', options: ['אז ככה', 'האח הגדול', 'הישרדות', "נינג'ה ישראל"], correct: 0, order: 5 },
  { question: 'מתי מרים פרסמה את הפוסט הראשון שלה באינסטגרם?', options: ['ספטמבר 2020', 'ינואר 2019', 'יוני 2021', 'מרץ 2018'], correct: 0, order: 6 },
  { question: 'באיזו מדינה מרים נולדה?', options: ['ישראל', 'ארה"ב', 'צרפת', 'אנגליה'], correct: 0, order: 7 },
  { question: 'על איזה נושא מרים העלתה מודעות ציבורית?', options: ['שימוש לרעה ב-AI', 'זכויות בעלי חיים', 'איכות הסביבה', 'חינוך'], correct: 0, order: 8 },
  { question: 'כמה עוקבים יש למרים בטיקטוק?', options: ['600K+', '100K', '1M+', '300K'], correct: 0, order: 9 },
]

export async function seedDefaultQuestions(): Promise<TriviaQuestion[]> {
  const existing = await getAllQuestions()
  if (existing.length > 0) return existing

  const batch = writeBatch(db)
  const results: TriviaQuestion[] = []

  for (const q of DEFAULT_QUESTIONS) {
    const id = crypto.randomUUID()
    batch.set(doc(db, COLLECTION, id), q)
    results.push({ id, ...q })
  }

  await withTimeout(batch.commit(), 15_000, 'seedDefaultQuestions')
  return results
}
