import { describe, it, expect, vi } from 'vitest'
import { addCaseStudy } from './case-studies-store'
import { setDoc } from 'firebase/firestore'

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
vi.mock('@/lib/utils', () => ({
  withTimeout: (p: Promise<unknown>) => p,
  omitUndefined: (obj: Record<string, unknown>) => obj,
}))

describe('case-studies-store imageUrl', () => {
  it('addCaseStudy stores case study with imageUrl', async () => {
    const data = {
      brand: 'Brand',
      title: 'Campaign',
      description: 'Desc',
      metric: '1M views',
      imageUrl: 'https://example.com/image.jpg',
      order: 0,
    }
    const result = await addCaseStudy(data)
    expect(result).toMatchObject(data)
    expect(result.id).toBeDefined()
    expect(setDoc).toHaveBeenCalled()
    const callArgs = vi.mocked(setDoc).mock.calls[0]
    expect(callArgs?.[1]).toMatchObject({ imageUrl: data.imageUrl })
  })
})
