import { useState, type FormEvent } from 'react'
import { useAuth } from '@/contexts/AuthContext'

interface AdminGuardProps {
  children: React.ReactNode
}

export function AdminGuard({ children }: AdminGuardProps) {
  const { isAdmin, login } = useAuth()
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  if (isAdmin) {
    return <>{children}</>
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    const success = login(password)
    if (!success) {
      setError('סיסמה שגויה')
      setPassword('')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg px-4">
      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
        <h1 className="font-heading text-2xl font-bold text-white text-center">Admin Login</h1>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="סיסמה"
          className="w-full bg-white/5 border-2 border-border-neutral rounded-none px-4 py-3 text-white placeholder:text-text-muted focus:outline-none focus:border-accent-indigo transition-colors"
          autoFocus
        />
        {error && <p className="text-red-400 text-sm text-center">{error}</p>}
        <button
          type="submit"
          className="w-full bg-gradient-to-l from-accent-violet to-accent-indigo text-white py-3 font-medium rounded-none hover:opacity-90 transition-opacity"
        >
          כניסה
        </button>
      </form>
    </div>
  )
}
