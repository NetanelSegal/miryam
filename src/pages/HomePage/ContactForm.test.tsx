/**
 * Tests ContactForm with useContactForm (RHF + Zod).
 * Mocks store.saveContact and ToastProvider.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import { ContactForm } from './ContactForm'
import { ToastProvider } from '@/components/ui/Toast'
import * as store from '@/lib/store'

vi.mock('@/lib/store', () => ({
  saveContact: vi.fn(),
}))

function renderWithToast(ui: React.ReactElement) {
  return render(
    <ToastProvider>
      {ui}
    </ToastProvider>
  )
}

describe('ContactForm', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
  })

  it('renders all form fields', () => {
    renderWithToast(<ContactForm />)
    expect(screen.getByLabelText(/שם/)).toBeDefined()
    expect(screen.getByLabelText(/חברה/)).toBeDefined()
    expect(screen.getByLabelText(/אימייל/)).toBeDefined()
    expect(screen.getByLabelText(/הודעה/)).toBeDefined()
    expect(screen.getByRole('button', { name: /שליחה/ })).toBeDefined()
  })

  it('shows validation errors when submitting empty', async () => {
    renderWithToast(<ContactForm />)
    const submitBtn = screen.getByRole('button', { name: /שליחה/ })
    fireEvent.click(submitBtn)

    await waitFor(() => {
      expect(screen.getByText(/הודעה נדרשת/)).toBeDefined()
    })
    expect(vi.mocked(store.saveContact)).not.toHaveBeenCalled()
  })

  it('submits valid form and calls saveContact', async () => {
    vi.mocked(store.saveContact).mockResolvedValue({
      id: 'test-id',
      name: 'Test User',
      company: 'Test Co',
      email: 'test@example.com',
      message: 'Test message',
      timestamp: Date.now(),
    })
    renderWithToast(<ContactForm />)

    fireEvent.change(screen.getByPlaceholderText(/השם שלך/), { target: { value: 'Test User' } })
    fireEvent.change(screen.getByPlaceholderText(/שם החברה/), { target: { value: 'Test Co' } })
    fireEvent.change(screen.getByPlaceholderText(/your@email.com/), { target: { value: 'test@example.com' } })
    fireEvent.change(screen.getByPlaceholderText(/ספרו לנו/), { target: { value: 'Test message' } })

    fireEvent.click(screen.getByRole('button', { name: /שליחה/ }))

    await waitFor(() => {
      expect(store.saveContact).toHaveBeenCalledWith({
        name: 'Test User',
        company: 'Test Co',
        email: 'test@example.com',
        message: 'Test message',
      })
    })
  })

  it('shows error for invalid email', async () => {
    renderWithToast(<ContactForm />)

    fireEvent.change(screen.getByPlaceholderText(/השם שלך/), { target: { value: 'Test' } })
    fireEvent.change(screen.getByPlaceholderText(/your@email.com/), { target: { value: 'not-an-email' } })
    fireEvent.change(screen.getByPlaceholderText(/ספרו לנו/), { target: { value: 'Message' } })

    fireEvent.click(screen.getByRole('button', { name: /שליחה/ }))

    await waitFor(() => {
      expect(screen.getByText(/אימייל לא תקין/)).toBeDefined()
    })
    expect(vi.mocked(store.saveContact)).not.toHaveBeenCalled()
  })
})
