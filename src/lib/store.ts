export interface Participant {
  id: string
  name: string
  phoneDigits: string
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
export function findParticipant(name: string, phoneDigits: string): Participant | undefined {
  return getList<Participant>(KEYS.participants).find(
    p => p.name === name && p.phoneDigits === phoneDigits
  )
}

export function createParticipant(name: string, phoneDigits: string): Participant {
  const existing = findParticipant(name, phoneDigits)
  if (existing) return existing

  const participant: Participant = {
    id: crypto.randomUUID(),
    name,
    phoneDigits,
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
  const entry: TriviaResult = { ...result, timestamp: Date.now() }
  const list = getList<TriviaResult>(KEYS.triviaResults)
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

// --- Stats (for admin + live display) ---
export function getStats() {
  return {
    totalParticipants: getList<Participant>(KEYS.participants).length,
    totalTriviaPlayers: getList<TriviaResult>(KEYS.triviaResults).length,
    totalVotes: getList<VoteRecord>(KEYS.votes).length,
    totalBlessings: getList<Blessing>(KEYS.blessings).length,
    totalContacts: getList<ContactSubmission>(KEYS.contacts).length,
  }
}
