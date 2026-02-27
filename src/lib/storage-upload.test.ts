/**
 * Unit tests for storage-upload uploadImage and deleteStorageFileByUrl.
 * NOTE: Firebase Storage is MOCKED — no real uploads.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { uploadImage, deleteStorageFileByUrl } from './storage-upload'
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage'
import { compressImage } from './image'

vi.mock('@/lib/firebase', () => ({ storage: {} }))
vi.mock('firebase/storage', () => ({
  ref: vi.fn(() => ({})),
  uploadBytes: vi.fn().mockResolvedValue(undefined),
  getDownloadURL: vi.fn().mockResolvedValue('https://storage.example.com/path/uuid'),
  deleteObject: vi.fn().mockResolvedValue(undefined),
}))
vi.mock('@/lib/image', () => ({
  compressImage: vi.fn().mockResolvedValue('data:image/jpeg;base64,fake'),
}))

describe('storage-upload', () => {
  beforeEach(() => {
    vi.mocked(compressImage).mockClear()
    vi.mocked(deleteObject).mockClear()
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

  describe('deleteStorageFileByUrl', () => {
    it('calls deleteObject for Firebase Storage URLs', async () => {
      const url =
        'https://firebasestorage.googleapis.com/v0/b/bucket/o/path%2Fid?alt=media&token=x'
      await deleteStorageFileByUrl(url)
      expect(ref).toHaveBeenCalled()
      expect(deleteObject).toHaveBeenCalled()
    })

    it('does nothing for empty or non-Storage URLs', async () => {
      await deleteStorageFileByUrl('')
      await deleteStorageFileByUrl('https://example.com/image.jpg')
      await deleteStorageFileByUrl('/local/path.jpg')
      expect(deleteObject).not.toHaveBeenCalled()
    })
  })
})
