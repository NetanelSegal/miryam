import { describe, it, expect, vi, beforeEach } from 'vitest'
import { uploadBlessingPhoto } from './blessings-store'
import { compressImage } from '@/lib/image'

vi.mock('@/lib/firebase', () => ({
  db: {},
  storage: {},
}))
vi.mock('firebase/storage', () => ({
  ref: vi.fn(() => ({})),
  uploadBytes: vi.fn().mockResolvedValue(undefined),
  getDownloadURL: vi.fn().mockResolvedValue('https://storage.example.com/blessings/abc'),
}))
vi.mock('firebase/firestore', () => ({
  collection: vi.fn(),
  doc: vi.fn(),
  getDocs: vi.fn(),
  setDoc: vi.fn().mockResolvedValue(undefined),
  updateDoc: vi.fn().mockResolvedValue(undefined),
  deleteDoc: vi.fn().mockResolvedValue(undefined),
  query: vi.fn(),
  orderBy: vi.fn(),
  onSnapshot: vi.fn(() => vi.fn()),
}))
vi.mock('@/lib/image', () => ({
  compressImage: vi.fn().mockResolvedValue('data:image/jpeg;base64,fake'),
}))

describe('blessings-store image upload', () => {
  beforeEach(() => {
    vi.mocked(compressImage).mockClear()
  })

  it('uploadBlessingPhoto compresses and returns download URL', async () => {
    const file = new File(['x'], 'photo.jpg', { type: 'image/jpeg' })
    const url = await uploadBlessingPhoto(file)
    expect(url).toBe('https://storage.example.com/blessings/abc')
    expect(compressImage).toHaveBeenCalledWith(file)
  })
})
