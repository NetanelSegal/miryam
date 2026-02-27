import { describe, it, expect } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useFileUpload } from './useFileUpload'

describe('useFileUpload', () => {
  it('returns ref, preview, selectedFile, handleFileChange, clearFile', () => {
    const { result } = renderHook(() => useFileUpload())
    expect(result.current.fileInputRef).toBeDefined()
    expect(result.current.preview).toBeNull()
    expect(result.current.selectedFile).toBeNull()
    expect(typeof result.current.handleFileChange).toBe('function')
    expect(typeof result.current.clearFile).toBe('function')
  })

  it('sets selectedFile on file change', async () => {
    const { result } = renderHook(() => useFileUpload())
    const file = new File(['content'], 'photo.jpg', { type: 'image/jpeg' })
    const event = {
      target: { files: [file] },
    } as unknown as React.ChangeEvent<HTMLInputElement>

    await act(async () => {
      result.current.handleFileChange(event)
    })

    expect(result.current.selectedFile).toBe(file)
  })

  it('clearFile resets state', async () => {
    const { result } = renderHook(() => useFileUpload())
    const file = new File(['x'], 'a.jpg', { type: 'image/jpeg' })
    await act(async () => {
      result.current.handleFileChange({
        target: { files: [file] },
      } as unknown as React.ChangeEvent<HTMLInputElement>)
    })
    expect(result.current.selectedFile).toBe(file)

    await act(async () => {
      result.current.clearFile()
    })
    expect(result.current.selectedFile).toBeNull()
    expect(result.current.preview).toBeNull()
  })
})
