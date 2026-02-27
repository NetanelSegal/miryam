/**
 * Unit tests for storage-upload uploadImage.
 * NOTE: Firebase Storage is MOCKED — no real uploads.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { uploadImage } from './storage-upload'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { compressImage } from './image'

vi.mock('@/lib/firebase', () => ({ storage: {} }))
vi.mock('firebase/storage', () => ({
  ref: vi.fn(() => ({})),
  uploadBytes: vi.fn().mockResolvedValue(undefined),
  getDownloadURL: vi.fn().mockResolvedValue('https://storage.example.com/path/uuid'),
}))
vi.mock('@/lib/image', () => ({
  compressImage: vi.fn().mockResolvedValue('data:image/jpeg;base64,fake'),
}))

describe('storage-upload', () => {
  beforeEach(() => {
    vi.mocked(compressImage).mockClear()
  })

  it('uploadImage compresses and uploads to path/{uuid}', async () => {
    const file = new File(['x'], 'test.jpg', { type: 'image/jpeg' })

    const url = await uploadImage('blessings', file)

    expect(compressImage).toHaveBeenCalledWith(file)
    expect(ref).toHaveBeenCalled()
    expect(uploadBytes).toHaveBeenCalled()
    expect(getDownloadURL).toHaveBeenCalled()
    expect(url).toBe('https://storage.example.com/path/uuid')
  })
})
