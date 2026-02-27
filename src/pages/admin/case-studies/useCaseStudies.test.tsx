/**
 * Unit tests for useCaseStudies hook.
 * Verifies that old image is deleted when replacing with a new one.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'
import { useCaseStudies } from './useCaseStudies'
import * as caseStudiesStore from '@/lib/case-studies-store'

vi.mock('@/lib/case-studies-store', () => ({
  getAllCaseStudies: vi.fn().mockResolvedValue([]),
  uploadCaseStudyImage: vi.fn().mockResolvedValue('https://storage.example.com/new.jpg'),
  deleteCaseStudyImage: vi.fn().mockResolvedValue(undefined),
  addCaseStudy: vi.fn().mockResolvedValue({}),
  updateCaseStudy: vi.fn().mockResolvedValue(undefined),
  deleteCaseStudy: vi.fn().mockResolvedValue(undefined),
}))

const OLD_IMAGE_URL = 'https://firebasestorage.googleapis.com/v0/b/bucket/o/case-studies/old-id'

describe('useCaseStudies', () => {
  const toast = vi.fn()

  beforeEach(() => {
    vi.mocked(caseStudiesStore.getAllCaseStudies).mockResolvedValue([])
    vi.mocked(caseStudiesStore.uploadCaseStudyImage).mockResolvedValue(
      'https://storage.example.com/new.jpg',
    )
    vi.mocked(caseStudiesStore.deleteCaseStudyImage).mockResolvedValue(undefined)
    vi.mocked(caseStudiesStore.deleteCaseStudyImage).mockClear()
    vi.mocked(caseStudiesStore.uploadCaseStudyImage).mockClear()
    toast.mockClear()
  })

  it('deletes old image when replacing with a new one during edit', async () => {
    const { result } = renderHook(() => useCaseStudies(toast))

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    const caseStudy = {
      id: 'cs-1',
      brand: 'Brand',
      title: 'Campaign',
      description: 'Desc',
      metric: '1M',
      imageUrl: OLD_IMAGE_URL,
      order: 0,
    }

    await act(async () => {
      result.current.startEdit(caseStudy)
    })

    const newFile = new File(['new-image'], 'new.jpg', { type: 'image/jpeg' })
    const event = {
      target: { files: [newFile] },
    } as unknown as React.ChangeEvent<HTMLInputElement>

    await act(async () => {
      result.current.handleEditFileChange(event)
    })

    await waitFor(() => {
      expect(caseStudiesStore.deleteCaseStudyImage).toHaveBeenCalledWith(OLD_IMAGE_URL)
    })

    expect(caseStudiesStore.uploadCaseStudyImage).toHaveBeenCalledWith(newFile)
    const deleteOrder = vi.mocked(caseStudiesStore.deleteCaseStudyImage).mock.invocationCallOrder[0]
    const uploadOrder = vi.mocked(caseStudiesStore.uploadCaseStudyImage).mock.invocationCallOrder[0]
    expect(deleteOrder).toBeDefined()
    expect(uploadOrder).toBeDefined()
    expect(deleteOrder as number).toBeLessThan(uploadOrder as number)
  })

  it('does not call deleteCaseStudyImage when replacing and no old image', async () => {
    const { result } = renderHook(() => useCaseStudies(toast))

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    const caseStudyNoImage = {
      id: 'cs-2',
      brand: 'Brand',
      title: 'Campaign',
      description: 'Desc',
      metric: '1M',
      imageUrl: '',
      order: 0,
    }

    await act(async () => {
      result.current.startEdit(caseStudyNoImage)
    })

    const newFile = new File(['new'], 'new.jpg', { type: 'image/jpeg' })
    const event = {
      target: { files: [newFile] },
    } as unknown as React.ChangeEvent<HTMLInputElement>

    await act(async () => {
      result.current.handleEditFileChange(event)
    })

    await waitFor(() => {
      expect(caseStudiesStore.uploadCaseStudyImage).toHaveBeenCalledWith(newFile)
    })

    expect(caseStudiesStore.deleteCaseStudyImage).not.toHaveBeenCalled()
  })
})
