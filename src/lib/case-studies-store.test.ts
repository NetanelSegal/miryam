/**
 * Unit tests for case-studies-store addCaseStudy, uploadCaseStudyImage, deleteCaseStudy.
 * NOTE: Firestore/Storage are MOCKED — these tests verify logic only.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { addCaseStudy, uploadCaseStudyImage, deleteCaseStudy } from './case-studies-store'
import { setDoc, deleteDoc } from 'firebase/firestore'

vi.mock('@/lib/firebase', () => ({ db: {} }))
vi.mock('firebase/firestore', () => ({
  collection: vi.fn(),
  doc: vi.fn(),
  getDocs: vi.fn(),
  setDoc: vi.fn().mockResolvedValue(undefined),
  updateDoc: vi.fn().mockResolvedValue(undefined),
  deleteDoc: vi.fn().mockResolvedValue(undefined),
  query: vi.fn(),
  orderBy: vi.fn(),
}))
vi.mock('@/lib/storage-upload', () => ({
  uploadImage: vi.fn().mockResolvedValue('https://storage.example.com/case-studies/xyz'),
  deleteStorageFileByUrl: vi.fn().mockResolvedValue(undefined),
}))
vi.mock('@/lib/utils', () => ({
  withTimeout: (p: Promise<unknown>) => p,
  omitUndefined: (obj: Record<string, unknown>) => obj,
}))

describe('case-studies-store', () => {
  beforeEach(() => {
    vi.mocked(deleteDoc).mockClear()
  })

  it('uploadCaseStudyImage returns Storage URL', async () => {
    const { uploadImage } = await import('@/lib/storage-upload')
    const file = new File(['x'], 'study.jpg', { type: 'image/jpeg' })
    const url = await uploadCaseStudyImage(file)
    expect(url).toBe('https://storage.example.com/case-studies/xyz')
    expect(uploadImage).toHaveBeenCalledWith('case-studies', file)
  })

  it('addCaseStudy stores case study with imageUrl', async () => {
    const data = {
      brand: 'Brand',
      title: 'Campaign',
      description: 'Desc',
      metric: '1M views',
      imageUrl: 'https://storage.example.com/case-studies/xyz',
      order: 0,
    }
    const result = await addCaseStudy(data)
    expect(result).toMatchObject(data)
    expect(result.id).toBeDefined()
    expect(setDoc).toHaveBeenCalled()
    const callArgs = vi.mocked(setDoc).mock.calls[0]
    expect(callArgs?.[1]).toMatchObject({ imageUrl: data.imageUrl })
  })

  it('deleteCaseStudy deletes Storage image when imageUrl provided', async () => {
    const { deleteStorageFileByUrl } = await import('@/lib/storage-upload')
    const imageUrl = 'https://firebasestorage.googleapis.com/v0/b/bucket/o/old.jpg'
    await deleteCaseStudy('id-123', imageUrl)
    expect(deleteStorageFileByUrl).toHaveBeenCalledWith(imageUrl)
    expect(deleteDoc).toHaveBeenCalled()
  })

  it('deleteCaseStudy skips Storage delete when no imageUrl', async () => {
    const { deleteStorageFileByUrl } = await import('@/lib/storage-upload')
    vi.mocked(deleteStorageFileByUrl).mockClear()
    await deleteCaseStudy('id-123')
    expect(deleteStorageFileByUrl).not.toHaveBeenCalled()
    expect(deleteDoc).toHaveBeenCalled()
  })
})
