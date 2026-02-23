import { useState, type FormEvent } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Heading, Input, Button } from '@/components/ui'

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
        <Heading level={3} className="text-white text-center">Admin Login</Heading>
        <Input
          type="password"
          value={password}
          onChange={(e) => setPassword((e.target as HTMLInputElement).value)}
          placeholder="סיסמה"
          autoFocus
          error={error || undefined}
        />
        <Button type="submit" variant="primary" size="lg" className="w-full">
          כניסה
        </Button>
      </form>
    </div>
  )
}
