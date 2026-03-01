/**
 * Tests BlessingsContent form with useBlessingForm (RHF + Zod).
 * Mocks store.saveBlessing, subscribeToBlessings, and uploadBlessingPhoto.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import { BlessingsContent } from './BlessingsContent'
import { ToastProvider } from '@/components/ui/Toast'
import * as store from '@/lib/store'
import type { Blessing } from '@/lib/store'

vi.mock('@/lib/store', () => ({
  saveBlessing: vi.fn(),
  subscribeToBlessings: vi.fn((cb: (blessings: Blessing[]) => void) => {
    cb([])
    return () => {}
  }),
}))

vi.mock('@/lib/blessings-store', () => ({
  uploadBlessingPhoto: vi.fn(),
}))

function renderWithToast(ui: React.ReactElement) {
  return render(<ToastProvider>{ui}</ToastProvider>)
}

describe('BlessingsContent', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(store.subscribeToBlessings).mockImplementation((cb: (blessings: Blessing[]) => void) => {
      cb([])
      return () => {}
    })
  })

  it('renders heading and write blessing button', () => {
    renderWithToast(<BlessingsContent />)
    expect(screen.getByText(/קיר ברכות/)).toBeDefined()
    expect(screen.getByRole('button', { name: /כתבו ברכה/ })).toBeDefined()
  })

  it('shows form when clicking write blessing', async () => {
    renderWithToast(<BlessingsContent />)
    fireEvent.click(screen.getByRole('button', { name: /כתבו ברכה/ }))

    await waitFor(() => {
      expect(screen.getByLabelText(/שם/)).toBeDefined()
      expect(screen.getByLabelText(/ברכה/)).toBeDefined()
      expect(screen.getByRole('button', { name: /שליחה/ })).toBeDefined()
    })
  })

  it('shows validation errors when submitting empty blessing form', async () => {
    renderWithToast(<BlessingsContent />)
    fireEvent.click(screen.getByRole('button', { name: /כתבו ברכה/ }))

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /שליחה/ })).toBeDefined()
    })

    fireEvent.click(screen.getByRole('button', { name: /שליחה/ }))

    await waitFor(() => {
      expect(screen.getByText(/ברכה נדרשת/)).toBeDefined()
    })
    expect(vi.mocked(store.saveBlessing)).not.toHaveBeenCalled()
  })

  it('submits valid blessing and calls saveBlessing', async () => {
    vi.mocked(store.saveBlessing).mockResolvedValue({
      id: 'b1',
      name: 'Test User',
      message: 'Happy birthday!',
      timestamp: Date.now(),
    })

    renderWithToast(<BlessingsContent />)
    fireEvent.click(screen.getByRole('button', { name: /כתבו ברכה/ }))

    await waitFor(() => {
      expect(screen.getByPlaceholderText(/השם שלך/)).toBeDefined()
    })

    fireEvent.change(screen.getByPlaceholderText(/השם שלך/), { target: { value: 'Test User' } })
    fireEvent.change(screen.getByPlaceholderText(/כתבו ברכה למרים/), { target: { value: 'Happy birthday!' } })

    fireEvent.click(screen.getByRole('button', { name: /שליחה/ }))

    await waitFor(() => {
      expect(store.saveBlessing).toHaveBeenCalledWith({
        name: 'Test User',
        message: 'Happy birthday!',
        photoURL: undefined,
      })
    })
  })
})
