import { describe, it, expect, vi, beforeEach } from 'vitest'
import { submitCostume } from './costumes-store'
import { setDoc } from 'firebase/firestore'

vi.mock('@/lib/firebase', () => ({ db: {} }))
vi.mock('firebase/firestore', () => ({
  collection: vi.fn(),
  doc: vi.fn(),
  getDocs: vi.fn(),
  setDoc: vi.fn().mockResolvedValue(undefined),
  updateDoc: vi.fn().mockResolvedValue(undefined),
  query: vi.fn(),
  orderBy: vi.fn(),
  where: vi.fn(),
}))
vi.mock('@/lib/utils', () => ({
  withTimeout: (p: Promise<unknown>) => p,
}))

describe('costumes-store image upload', () => {
  beforeEach(() => {
    vi.mocked(setDoc).mockClear()
  })

  it('submitCostume stores entry with imageData in Firestore', async () => {
    const imageData = 'data:image/jpeg;base64,/9j/4AAQ'
    const result = await submitCostume({
      participantId: 'user-123',
      participantName: 'Test User',
      title: 'My Costume',
      imageData,
    })
    expect(result).toMatchObject({
      participantId: 'user-123',
      participantName: 'Test User',
      title: 'My Costume',
      imageData,
      status: 'pending',
    })
    expect(result.id).toBeDefined()
    expect(result.submittedAt).toBeDefined()
    expect(setDoc).toHaveBeenCalled()
  })

  it('imageData is base64 data URL string', async () => {
    const imageData = 'data:image/jpeg;base64,fakeBase64Content'
    await submitCostume({
      participantId: 'p1',
      participantName: 'Name',
      title: 'Title',
      imageData,
    })
    expect(vi.mocked(setDoc).mock.calls[0]?.[1]).toMatchObject({ imageData })
  })
})
