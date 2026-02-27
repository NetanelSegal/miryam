/**
 * Unit tests for costume submission with imageUrl (Storage) and legacy imageData.
 * NOTE: Firestore/Storage are MOCKED. These tests verify code logic only.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { submitCostume, uploadCostumeImage, getCostumeImageUrl } from './costumes-store'
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
vi.mock('@/lib/storage-upload', () => ({
  uploadImage: vi.fn().mockResolvedValue('https://storage.example.com/costumes/abc'),
}))
vi.mock('@/lib/utils', () => ({
  withTimeout: (p: Promise<unknown>) => p,
}))

describe('costumes-store', () => {
  beforeEach(() => {
    vi.mocked(setDoc).mockClear()
  })

  it('uploadCostumeImage returns Storage URL', async () => {
    const { uploadImage } = await import('@/lib/storage-upload')
    const file = new File(['x'], 'costume.jpg', { type: 'image/jpeg' })
    const url = await uploadCostumeImage(file)
    expect(url).toBe('https://storage.example.com/costumes/abc')
    expect(uploadImage).toHaveBeenCalledWith('costumes', file)
  })

  it('submitCostume stores entry with imageUrl in Firestore', async () => {
    const imageUrl = 'https://storage.example.com/costumes/abc'
    const result = await submitCostume({
      participantId: 'user-123',
      participantName: 'Test User',
      title: 'My Costume',
      imageUrl,
    })
    expect(result).toMatchObject({
      participantId: 'user-123',
      participantName: 'Test User',
      title: 'My Costume',
      imageUrl,
      status: 'pending',
    })
    expect(result.id).toBeDefined()
    expect(setDoc).toHaveBeenCalled()
    expect(vi.mocked(setDoc).mock.calls[0]?.[1]).toMatchObject({ imageUrl })
  })

  it('getCostumeImageUrl prefers imageUrl over imageData', () => {
    expect(getCostumeImageUrl({ imageUrl: 'https://a.com/x', imageData: 'data:...' } as never)).toBe('https://a.com/x')
    expect(getCostumeImageUrl({ imageData: 'data:image/base64' } as never)).toBe('data:image/base64')
    expect(getCostumeImageUrl({} as never)).toBe('')
  })
})
