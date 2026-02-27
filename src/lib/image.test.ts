import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { compressImage } from './image'

describe('compressImage', () => {
  const createImageFile = (content: string, type: string): File =>
    new File([new Blob([content], { type })], 'test.jpg', { type })

  beforeEach(() => {
    vi.stubGlobal(
      'Image',
      vi.fn().mockImplementation(function (this: HTMLImageElement) {
        setTimeout(() => {
          Object.defineProperty(this, 'width', { value: 100 })
          Object.defineProperty(this, 'height', { value: 100 })
          this.onload?.(new Event('load'))
        })
        return this
      }),
    )

    // Mock canvas getContext and toDataURL
    HTMLCanvasElement.prototype.getContext = vi.fn().mockReturnValue({
      drawImage: vi.fn(),
    })
    HTMLCanvasElement.prototype.toDataURL = vi.fn().mockReturnValue('data:image/jpeg;base64,fake')
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('rejects non-image files', async () => {
    const file = createImageFile('not image', 'text/plain')
    await expect(compressImage(file)).rejects.toThrow('הקובץ אינו תמונה')
  })

  it('rejects files over 10MB', async () => {
    const bigContent = new Uint8Array(11 * 1024 * 1024)
    const file = new File([bigContent], 'large.jpg', { type: 'image/jpeg' })
    await expect(compressImage(file)).rejects.toThrow('מקסימום 10MB')
  })

  it('resolves with data URL for valid image', async () => {
    const file = createImageFile('fake', 'image/jpeg')
    const result = await compressImage(file)
    expect(result).toMatch(/^data:image\/jpeg;base64,/)
  })
})
