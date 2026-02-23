import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'

type UserRole = 'guest' | 'admin'

interface AuthState {
  isAuthenticated: boolean
  isAdmin: boolean
  role: UserRole
  login: (password: string) => boolean
  logout: () => void
}

const AuthContext = createContext<AuthState | null>(null)

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<UserRole>(() => {
    if (typeof window !== 'undefined' && sessionStorage.getItem('admin_auth') === 'true') {
      return 'admin'
    }
    return 'guest'
  })

  const login = useCallback((password: string): boolean => {
    const adminPassword = import.meta.env.VITE_ADMIN_PASSWORD
    if (password === adminPassword) {
      setRole('admin')
      sessionStorage.setItem('admin_auth', 'true')
      return true
    }
    return false
  }, [])

  const logout = useCallback(() => {
    setRole('guest')
    sessionStorage.removeItem('admin_auth')
  }, [])

  return (
    <AuthContext.Provider value={{
      isAuthenticated: role !== 'guest',
      isAdmin: role === 'admin',
      role,
      login,
      logout,
    }}>
      {children}
    </AuthContext.Provider>
  )
}
