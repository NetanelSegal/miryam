/**
 * Tests AdminDictionary TermEditor form with useTermForm (RHF + Zod).
 * Mocks dictionary-store.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import { AdminDictionary } from './AdminDictionary'
import { ToastProvider } from '@/components/ui/Toast'
import * as dictionaryStore from '@/lib/dictionary-store'

vi.mock('@/lib/dictionary-store', () => ({
  getAllTerms: vi.fn(),
  addTerm: vi.fn(),
  updateTerm: vi.fn(),
  deleteTerm: vi.fn(),
  reorderTerms: vi.fn(),
  seedDefaultTerms: vi.fn(),
}))

function renderWithToast(ui: React.ReactElement) {
  return render(<ToastProvider>{ui}</ToastProvider>)
}

describe('AdminDictionary TermEditor form', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(dictionaryStore.getAllTerms).mockResolvedValue([])
  })

  it('renders add term form when clicking מושג חדש', async () => {
    renderWithToast(<AdminDictionary />)

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /מושג חדש/ })).toBeDefined()
    })

    fireEvent.click(screen.getByRole('button', { name: /מושג חדש/ }))

    await waitFor(() => {
      expect(screen.getByLabelText(/מושג/)).toBeDefined()
      expect(screen.getByLabelText(/הסבר/)).toBeDefined()
      expect(screen.getByRole('button', { name: /שמירה/ })).toBeDefined()
    })
  })

  it('shows validation errors when submitting empty term form', async () => {
    renderWithToast(<AdminDictionary />)

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /מושג חדש/ })).toBeDefined()
    })

    fireEvent.click(screen.getByRole('button', { name: /מושג חדש/ }))

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /שמירה/ })).toBeDefined()
    })

    fireEvent.click(screen.getByRole('button', { name: /שמירה/ }))

    await waitFor(() => {
      expect(screen.getByText(/מושג נדרש/)).toBeDefined()
    })
    expect(vi.mocked(dictionaryStore.addTerm)).not.toHaveBeenCalled()
  })

  it('submits valid term and calls addTerm', async () => {
    vi.mocked(dictionaryStore.addTerm).mockResolvedValue({
      id: 't1',
      term: 'פוב',
      explanation: 'פחד מגובה',
      order: 0,
    })

    renderWithToast(<AdminDictionary />)

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /מושג חדש/ })).toBeDefined()
    })

    fireEvent.click(screen.getByRole('button', { name: /מושג חדש/ }))

    await waitFor(() => {
      expect(screen.getByPlaceholderText(/לדוגמה: פוב/)).toBeDefined()
    })

    fireEvent.change(screen.getByPlaceholderText(/לדוגמה: פוב/), { target: { value: 'פוב' } })
    fireEvent.change(screen.getByPlaceholderText(/כתבו את ההסבר/), { target: { value: 'פחד מגובה' } })

    fireEvent.click(screen.getByRole('button', { name: /שמירה/ }))

    await waitFor(() => {
      expect(dictionaryStore.addTerm).toHaveBeenCalledWith({
        term: 'פוב',
        explanation: 'פחד מגובה',
        order: 0,
      })
    })
  })
})
