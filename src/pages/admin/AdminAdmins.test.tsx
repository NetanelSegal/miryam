/**
 * Tests AdminAdmins email form with useAdminEmailForm (RHF + Zod).
 * Mocks admins-store.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import { AdminAdmins } from './AdminAdmins'
import { ToastProvider } from '@/components/ui/Toast'
import * as adminsStore from '@/lib/admins-store'

vi.mock('@/lib/admins-store', () => ({
  getAdmins: vi.fn(),
  addAdmin: vi.fn(),
  removeAdmin: vi.fn(),
}))

function renderWithToast(ui: React.ReactElement) {
  return render(<ToastProvider>{ui}</ToastProvider>)
}

describe('AdminAdmins email form', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(adminsStore.getAdmins).mockResolvedValue([])
  })

  it('renders add admin form', async () => {
    renderWithToast(<AdminAdmins />)

    await waitFor(() => {
      expect(screen.getByPlaceholderText(/admin@example.com/)).toBeDefined()
      expect(screen.getByRole('button', { name: /הוסף אדמין/ })).toBeDefined()
    })
  })

  it('shows validation error when submitting empty email', async () => {
    renderWithToast(<AdminAdmins />)

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /הוסף אדמין/ })).toBeDefined()
    })

    fireEvent.click(screen.getByRole('button', { name: /הוסף אדמין/ }))

    await waitFor(() => {
      expect(screen.getByText(/נדרש/)).toBeDefined()
    })
    expect(vi.mocked(adminsStore.addAdmin)).not.toHaveBeenCalled()
  })

  it('shows error for invalid email', async () => {
    renderWithToast(<AdminAdmins />)

    await waitFor(() => {
      expect(screen.getByPlaceholderText(/admin@example.com/)).toBeDefined()
    })

    fireEvent.change(screen.getByPlaceholderText(/admin@example.com/), {
      target: { value: 'not-an-email' },
    })
    fireEvent.click(screen.getByRole('button', { name: /הוסף אדמין/ }))

    await waitFor(() => {
      expect(screen.getByText(/אימייל לא תקין/)).toBeDefined()
    })
    expect(vi.mocked(adminsStore.addAdmin)).not.toHaveBeenCalled()
  })

  it('submits valid email and calls addAdmin', async () => {
    vi.mocked(adminsStore.addAdmin).mockResolvedValue(undefined)

    renderWithToast(<AdminAdmins />)

    await waitFor(() => {
      expect(screen.getByPlaceholderText(/admin@example.com/)).toBeDefined()
    })

    fireEvent.change(screen.getByPlaceholderText(/admin@example.com/), {
      target: { value: 'admin@example.com' },
    })
    fireEvent.click(screen.getByRole('button', { name: /הוסף אדמין/ }))

    await waitFor(() => {
      expect(adminsStore.addAdmin).toHaveBeenCalledWith('admin@example.com')
    })
  })
})
