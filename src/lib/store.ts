/**
 * Store facade — Firebase/Firestore is the SSOT.
 * All functions are async. Re-exports from *-store modules.
 */

export type { Participant } from './participants-store'
export type { TriviaResult } from './trivia-results-store'
export type { VoteRecord } from './votes-store'
export type { CostumeEntry } from './costumes-store'
export type { Blessing } from './blessings-store'
export type { ContactSubmission } from './contacts-store'

export {
  findParticipantById,
  createParticipant,
  getAllParticipants,
} from './participants-store'

export {
  getTriviaResult,
  saveTriviaResult,
  getTriviaLeaderboard,
} from './trivia-results-store'

export {
  castVote,
  getVote,
  getVoteCounts,
  getAllVotes,
} from './votes-store'

export {
  submitCostume,
  getCostumeByParticipant,
  getApprovedCostumes,
  getPendingCostumes,
  getAllCostumes,
  reviewCostume,
} from './costumes-store'

export { saveBlessing, getAllBlessings, updateBlessing, deleteBlessing, subscribeToBlessings } from './blessings-store'
export { saveContact, getAllContacts } from './contacts-store'

import * as participantsStore from './participants-store'
import * as triviaStore from './trivia-results-store'
import * as votesStore from './votes-store'
import * as costumesStore from './costumes-store'
import * as blessingsStore from './blessings-store'
import * as contactsStore from './contacts-store'

export interface Stats {
  totalParticipants: number
  totalTriviaPlayers: number
  totalVotes: number
  totalBlessings: number
  totalContacts: number
  totalCostumes: number
  pendingCostumes: number
}

export async function getStats(): Promise<Stats> {
  const [participants, triviaResults, votes, blessings, contacts, costumes] = await Promise.all([
    participantsStore.getAllParticipants(),
    triviaStore.getTriviaLeaderboard(),
    votesStore.getAllVotes(),
    blessingsStore.getAllBlessings(),
    contactsStore.getAllContacts(),
    costumesStore.getAllCostumes(),
  ])
  return {
    totalParticipants: participants.length,
    totalTriviaPlayers: triviaResults.length,
    totalVotes: votes.length,
    totalBlessings: blessings.length,
    totalContacts: contacts.length,
    totalCostumes: costumes.length,
    pendingCostumes: costumes.filter(c => c.status === 'pending').length,
  }
}
