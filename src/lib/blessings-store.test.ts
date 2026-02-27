/**
 * Unit tests for blessings photo upload.
 * NOTE: Firebase is MOCKED. These tests verify code logic only — they do NOT
 * perform real uploads to Firebase Storage. Real uploads require CORS config
 * on the Storage bucket (see docs/04-Architecture/STORAGE-CORS.md).
 */
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { uploadBlessingPhoto } from './blessings-store'
import { uploadImage } from '@/lib/storage-upload'

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
vi.mock('@/lib/storage-upload', () => ({
  uploadImage: vi.fn().mockResolvedValue('https://storage.example.com/blessings/abc'),
}))

describe('blessings-store image upload', () => {
  beforeEach(() => {
    vi.mocked(uploadImage).mockClear()
  })

  it('uploadBlessingPhoto uploads and returns download URL', async () => {
    const file = new File(['x'], 'photo.jpg', { type: 'image/jpeg' })
    const url = await uploadBlessingPhoto(file)
    expect(url).toBe('https://storage.example.com/blessings/abc')
    expect(uploadImage).toHaveBeenCalledWith('blessings', file)
  })
})
