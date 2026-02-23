export interface Participant {
  id: string
  name: string
  email?: string
  photoURL?: string
  createdAt: number
}

export interface TriviaResult {
  participantId: string
  participantName: string
  score: number
  totalQuestions: number
  timestamp: number
}

export interface VoteRecord {
  participantId: string
  participantName: string
  candidateId: string
  timestamp: number
}

export interface CostumeEntry {
  id: string
  participantId: string
  participantName: string
  title: string
  imageData: string
  status: 'pending' | 'approved' | 'rejected'
  submittedAt: number
  reviewedAt?: number
}

export interface Blessing {
  id: string
  name: string
  message: string
  photoURL?: string
  timestamp: number
}

export interface ContactSubmission {
  id: string
  name: string
  company: string
  email: string
  message: string
  timestamp: number
}

const KEYS = {
  participants: 'miryam_participants',
  triviaResults: 'miryam_trivia_results',
  votes: 'miryam_votes',
  costumes: 'miryam_costumes',
  blessings: 'miryam_blessings',
  contacts: 'miryam_contacts',
} as const

function getList<T>(key: string): T[] {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : []
  } catch { return [] }
}

function setList<T>(key: string, items: T[]) {
  localStorage.setItem(key, JSON.stringify(items))
}

// --- Participants ---
export function findParticipantById(id: string): Participant | undefined {
  return getList<Participant>(KEYS.participants).find(p => p.id === id)
}

export function createParticipant(data: { id?: string; name: string; email?: string; photoURL?: string }): Participant {
  const id = data.id ?? crypto.randomUUID()
  const existing = findParticipantById(id)
  if (existing) {
    if (existing.name !== data.name || existing.photoURL !== data.photoURL) {
      const list = getList<Participant>(KEYS.participants)
      const idx = list.findIndex(p => p.id === id)
      if (idx !== -1) {
        list[idx] = { ...existing, name: data.name, email: data.email, photoURL: data.photoURL }
        setList(KEYS.participants, list)
        return list[idx]!
      }
    }
    return existing
  }

  const participant: Participant = {
    id,
    name: data.name,
    email: data.email,
    photoURL: data.photoURL,
    createdAt: Date.now(),
  }
  const list = getList<Participant>(KEYS.participants)
  list.push(participant)
  setList(KEYS.participants, list)
  return participant
}

export function getAllParticipants(): Participant[] {
  return getList<Participant>(KEYS.participants).sort((a, b) => b.createdAt - a.createdAt)
}

// --- Trivia ---
export function saveTriviaResult(result: Omit<TriviaResult, 'timestamp'>): TriviaResult {
  const list = getList<TriviaResult>(KEYS.triviaResults)
  const existing = list.find(r => r.participantId === result.participantId)
  if (existing) return existing

  const entry: TriviaResult = { ...result, timestamp: Date.now() }
  list.push(entry)
  setList(KEYS.triviaResults, list)
  return entry
}

export function getTriviaResult(participantId: string): TriviaResult | undefined {
  return getList<TriviaResult>(KEYS.triviaResults).find(r => r.participantId === participantId)
}

export function getTriviaLeaderboard(): TriviaResult[] {
  return getList<TriviaResult>(KEYS.triviaResults)
    .sort((a, b) => b.score - a.score || a.timestamp - b.timestamp)
}

// --- Votes ---
export function castVote(vote: Omit<VoteRecord, 'timestamp'>): VoteRecord {
  const entry: VoteRecord = { ...vote, timestamp: Date.now() }
  const list = getList<VoteRecord>(KEYS.votes)
  list.push(entry)
  setList(KEYS.votes, list)
  return entry
}

export function getVote(participantId: string): VoteRecord | undefined {
  return getList<VoteRecord>(KEYS.votes).find(v => v.participantId === participantId)
}

export function getVoteCounts(): Record<string, number> {
  const votes = getList<VoteRecord>(KEYS.votes)
  const counts: Record<string, number> = {}
  for (const v of votes) {
    counts[v.candidateId] = (counts[v.candidateId] ?? 0) + 1
  }
  return counts
}

export function getAllVotes(): VoteRecord[] {
  return getList<VoteRecord>(KEYS.votes).sort((a, b) => b.timestamp - a.timestamp)
}

// --- Costumes ---
export function submitCostume(entry: Omit<CostumeEntry, 'id' | 'status' | 'submittedAt'>): CostumeEntry {
  const costume: CostumeEntry = {
    ...entry,
    id: crypto.randomUUID(),
    status: 'pending',
    submittedAt: Date.now(),
  }
  const list = getList<CostumeEntry>(KEYS.costumes)
  list.push(costume)
  setList(KEYS.costumes, list)
  return costume
}

export function getCostumeByParticipant(participantId: string): CostumeEntry | undefined {
  return getList<CostumeEntry>(KEYS.costumes).find(c => c.participantId === participantId)
}

export function getApprovedCostumes(): CostumeEntry[] {
  return getList<CostumeEntry>(KEYS.costumes)
    .filter(c => c.status === 'approved')
    .sort((a, b) => a.submittedAt - b.submittedAt)
}

export function getPendingCostumes(): CostumeEntry[] {
  return getList<CostumeEntry>(KEYS.costumes)
    .filter(c => c.status === 'pending')
    .sort((a, b) => a.submittedAt - b.submittedAt)
}

export function getAllCostumes(): CostumeEntry[] {
  return getList<CostumeEntry>(KEYS.costumes).sort((a, b) => b.submittedAt - a.submittedAt)
}

export function reviewCostume(costumeId: string, status: 'approved' | 'rejected'): void {
  const list = getList<CostumeEntry>(KEYS.costumes)
  const idx = list.findIndex(c => c.id === costumeId)
  if (idx === -1) return
  list[idx] = { ...list[idx]!, status, reviewedAt: Date.now() }
  setList(KEYS.costumes, list)
}

// --- Blessings ---
export function saveBlessing(blessing: Omit<Blessing, 'id' | 'timestamp'>): Blessing {
  const entry: Blessing = { ...blessing, id: crypto.randomUUID(), timestamp: Date.now() }
  const list = getList<Blessing>(KEYS.blessings)
  list.push(entry)
  setList(KEYS.blessings, list)
  return entry
}

export function getAllBlessings(): Blessing[] {
  return getList<Blessing>(KEYS.blessings).sort((a, b) => b.timestamp - a.timestamp)
}

// --- Contacts ---
export function saveContact(contact: Omit<ContactSubmission, 'id' | 'timestamp'>): ContactSubmission {
  const entry: ContactSubmission = { ...contact, id: crypto.randomUUID(), timestamp: Date.now() }
  const list = getList<ContactSubmission>(KEYS.contacts)
  list.push(entry)
  setList(KEYS.contacts, list)
  return entry
}

export function getAllContacts(): ContactSubmission[] {
  return getList<ContactSubmission>(KEYS.contacts).sort((a, b) => b.timestamp - a.timestamp)
}

// --- Stats ---
export function getStats() {
  const costumes = getList<CostumeEntry>(KEYS.costumes)
  return {
    totalParticipants: getList<Participant>(KEYS.participants).length,
    totalTriviaPlayers: getList<TriviaResult>(KEYS.triviaResults).length,
    totalVotes: getList<VoteRecord>(KEYS.votes).length,
    totalBlessings: getList<Blessing>(KEYS.blessings).length,
    totalContacts: getList<ContactSubmission>(KEYS.contacts).length,
    totalCostumes: costumes.length,
    pendingCostumes: costumes.filter(c => c.status === 'pending').length,
  }
}

// --- Seed (demo data when empty) ---
const SEED_FLAG = 'miryam_seeded'

const PLACEHOLDER_IMAGE =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400' viewBox='0 0 400 400'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%236366f1'/%3E%3Cstop offset='100%25' style='stop-color:%23a855f7'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect fill='url(%23g)' width='400' height='400'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='white' font-family='sans-serif' font-size='24'%3E🎭%3C/text%3E%3C/svg%3E"

export function seedIfEmpty(): void {
  if (typeof window === 'undefined') return
  if (localStorage.getItem(SEED_FLAG)) return

  const hasParticipants = getList<Participant>(KEYS.participants).length > 0
  const hasBlessings = getList<Blessing>(KEYS.blessings).length > 0
  const hasCostumes = getList<CostumeEntry>(KEYS.costumes).length > 0
  if (hasParticipants || hasBlessings || hasCostumes) return

  const now = Date.now()
  const baseTime = now - 86400000 * 2

  const seedParticipants: Participant[] = [
    { id: 'seed-p1', name: 'יעל כהן', email: 'yael@example.com', createdAt: baseTime },
    { id: 'seed-p2', name: 'דני לוי', email: 'dani@example.com', createdAt: baseTime + 3600000 },
    { id: 'seed-p3', name: 'שרה אברהם', createdAt: baseTime + 7200000 },
  ]
  setList(KEYS.participants, seedParticipants)

  const seedBlessings: Blessing[] = [
    { id: 'seed-b1', name: 'יעל', message: 'מרים יקרה! מזל טוב! את מדהימה ואנחנו אוהבים אותך 💜', timestamp: baseTime },
    { id: 'seed-b2', name: 'דני', message: 'יום הולדת שמח! מחכים לראות מה תעשי השנה', timestamp: baseTime + 1800000 },
    { id: 'seed-b3', name: 'שרה', message: 'כל הכבוד על כל מה שהשגת! המשך להצליח!', timestamp: baseTime + 3600000 },
    { id: 'seed-b4', name: 'מיכל', message: 'ברוכה הבאה לשנה חדשה מלאה בהצלחות 🎉', timestamp: baseTime + 5400000 },
    { id: 'seed-b5', name: 'רועי', message: 'תודה על כל התוכן המדהים! יום הולדת שמח!', timestamp: baseTime + 7200000 },
  ]
  setList(KEYS.blessings, seedBlessings)

  const seedCostumes: CostumeEntry[] = [
    {
      id: 'seed-c1',
      participantId: 'seed-p1',
      participantName: 'יעל כהן',
      title: 'הנסיכה הקסומה',
      imageData: PLACEHOLDER_IMAGE,
      status: 'approved',
      submittedAt: baseTime,
      reviewedAt: baseTime + 60000,
    },
    {
      id: 'seed-c2',
      participantId: 'seed-p2',
      participantName: 'דני לוי',
      title: 'סופרמן',
      imageData: PLACEHOLDER_IMAGE,
      status: 'approved',
      submittedAt: baseTime + 3600000,
      reviewedAt: baseTime + 3660000,
    },
    {
      id: 'seed-c3',
      participantId: 'seed-p3',
      participantName: 'שרה אברהם',
      title: 'פיית הקשת',
      imageData: PLACEHOLDER_IMAGE,
      status: 'approved',
      submittedAt: baseTime + 7200000,
      reviewedAt: baseTime + 7260000,
    },
  ]
  setList(KEYS.costumes, seedCostumes)

  const seedVotes: VoteRecord[] = [
    { participantId: 'seed-p1', participantName: 'יעל כהן', candidateId: 'seed-c2', timestamp: baseTime + 86400000 },
    { participantId: 'seed-p2', participantName: 'דני לוי', candidateId: 'seed-c1', timestamp: baseTime + 86400000 + 3600000 },
    { participantId: 'seed-p3', participantName: 'שרה אברהם', candidateId: 'seed-c1', timestamp: baseTime + 86400000 + 7200000 },
  ]
  setList(KEYS.votes, seedVotes)

  const seedTriviaResults: TriviaResult[] = [
    { participantId: 'seed-p1', participantName: 'יעל כהן', score: 9, totalQuestions: 10, timestamp: baseTime },
    { participantId: 'seed-p2', participantName: 'דני לוי', score: 7, totalQuestions: 10, timestamp: baseTime + 1800000 },
    { participantId: 'seed-p3', participantName: 'שרה אברהם', score: 10, totalQuestions: 10, timestamp: baseTime + 3600000 },
  ]
  setList(KEYS.triviaResults, seedTriviaResults)

  localStorage.setItem(SEED_FLAG, '1')
}
