/**
 * Tests VotingGame costume upload form with useCostumeUploadForm (RHF + Zod).
 * Mocks useRequiredParticipant, store (costumes, votes), and confetti.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import { VotingGame } from './VotingGame'
import { ToastProvider } from '@/components/ui/Toast'
import * as store from '@/lib/store'

vi.mock('@/hooks/useRequiredParticipant', () => ({
  useRequiredParticipant: () => ({ id: 'p1', name: 'Test User' }),
}))

vi.mock('@/lib/confetti', () => ({ confetti: vi.fn() }))

vi.mock('@/lib/store', () => ({
  getCostumeByParticipant: vi.fn(),
  getApprovedCostumes: vi.fn(),
  getVote: vi.fn(),
  getVoteCounts: vi.fn(),
  uploadCostumeImage: vi.fn(),
  submitCostume: vi.fn(),
  getCostumeImageUrl: vi.fn((c: { imageUrl: string }) => c.imageUrl),
}))

function renderWithToast(ui: React.ReactElement) {
  return render(<ToastProvider>{ui}</ToastProvider>)
}

describe('VotingGame costume form', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(store.getCostumeByParticipant).mockResolvedValue(undefined)
    vi.mocked(store.getApprovedCostumes).mockResolvedValue([])
    vi.mocked(store.getVote).mockResolvedValue(undefined)
    vi.mocked(store.getVoteCounts).mockResolvedValue({})
  })

  it('renders costume upload form when user has no costume', async () => {
    renderWithToast(<VotingGame />)

    await waitFor(() => {
      expect(screen.getByText(/העלו את התחפושת שלכם/)).toBeDefined()
      expect(screen.getByLabelText(/שם התחפושת/)).toBeDefined()
      expect(screen.getByRole('button', { name: /העלאת תחפושת/ })).toBeDefined()
    })
  })

  it('shows validation error when submitting without title', async () => {
    renderWithToast(<VotingGame />)

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /העלאת תחפושת/ })).toBeDefined()
    })

    // Simulate file selection so the "no file" error doesn't trigger first
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement
    const file = new File(['x'], 'costume.jpg', { type: 'image/jpeg' })
    fireEvent.change(fileInput, { target: { files: [file] } })

    fireEvent.click(screen.getByRole('button', { name: /העלאת תחפושת/ }))

    await waitFor(() => {
      expect(screen.getByText(/שם התחפושת נדרש/)).toBeDefined()
    })
    expect(vi.mocked(store.submitCostume)).not.toHaveBeenCalled()
  })

  it('submits valid form with title and file', async () => {
    vi.mocked(store.uploadCostumeImage).mockResolvedValue('https://example.com/img.jpg')
    vi.mocked(store.submitCostume).mockResolvedValue({
      id: 'c1',
      participantId: 'p1',
      participantName: 'Test User',
      title: 'הנסיכה הקסומה',
      imageUrl: 'https://example.com/img.jpg',
      status: 'pending',
      submittedAt: Date.now(),
    })

    renderWithToast(<VotingGame />)

    await waitFor(() => {
      expect(screen.getByPlaceholderText(/למשל: הנסיכה הקסומה/)).toBeDefined()
    })

    fireEvent.change(screen.getByPlaceholderText(/למשל: הנסיכה הקסומה/), {
      target: { value: 'הנסיכה הקסומה' },
    })

    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement
    const file = new File(['x'], 'costume.jpg', { type: 'image/jpeg' })
    fireEvent.change(fileInput, { target: { files: [file] } })

    fireEvent.click(screen.getByRole('button', { name: /העלאת תחפושת/ }))

    await waitFor(() => {
      expect(store.submitCostume).toHaveBeenCalledWith({
        participantId: 'p1',
        participantName: 'Test User',
        title: 'הנסיכה הקסומה',
        imageUrl: 'https://example.com/img.jpg',
      })
    })
  })
})
