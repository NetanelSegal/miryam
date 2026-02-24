import { useState, useEffect, useCallback } from 'react'
import { Shield, Plus, Trash2, Loader2, AlertCircle } from 'lucide-react'
import { Heading, Text, Button, Input, Card, useToast, LoadingState } from '@/components/ui'
import * as adminsStore from '@/lib/admins-store'

export function AdminAdmins() {
  const { toast } = useToast()
  const [admins, setAdmins] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [newEmail, setNewEmail] = useState('')
  const [adding, setAdding] = useState(false)
  const [removing, setRemoving] = useState<string | null>(null)

  const loadAdmins = useCallback(async () => {
    try {
      setError(null)
      const list = await adminsStore.getAdmins()
      setAdmins(list)
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'שגיאה בטעינת רשימת האדמינים'
      setError(msg)
      if (import.meta.env.DEV) console.error('Failed to load admins:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadAdmins()
  }, [loadAdmins])

  const handleAdd = useCallback(async () => {
    if (!newEmail.trim()) return
    setAdding(true)
    try {
      await adminsStore.addAdmin(newEmail)
      setAdmins((prev) => [...prev, newEmail.trim().toLowerCase()].sort())
      setNewEmail('')
      toast('success', 'האדמין נוסף בהצלחה')
    } catch (err) {
      toast('error', err instanceof Error ? err.message : 'שגיאה בהוספת אדמין')
    } finally {
      setAdding(false)
    }
  }, [newEmail, toast])

  const handleRemove = useCallback(
    async (email: string) => {
      if (!confirm(`להסיר את ${email} מרשימת האדמינים?`)) return
      setRemoving(email)
      try {
        await adminsStore.removeAdmin(email)
        setAdmins((prev) => prev.filter((e) => e !== email))
        toast('success', 'האדמין הוסר')
      } catch (err) {
        toast('error', err instanceof Error ? err.message : 'שגיאה בהסרת אדמין')
      } finally {
        setRemoving(null)
      }
    },
    [toast]
  )

  if (loading) return <LoadingState />

  if (error) {
    return (
      <Card variant="accent" className="p-6 text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-red-400 mx-auto" />
        <Heading level={5} className="text-white">
          שגיאת חיבור
        </Heading>
        <Text variant="muted" size="sm" className="max-w-md mx-auto">
          {error}
        </Text>
        <Button variant="primary" size="sm" onClick={loadAdmins}>
          נסו שנית
        </Button>
      </Card>
    )
  }

  return (
    <>
      <Heading level={4} className="text-white mb-6">
        ניהול אדמינים ({admins.length})
      </Heading>

      <Card variant="accent" className="p-5 mb-6">
        <Text variant="secondary" size="sm" className="mb-4 block">
          הוספת אדמין חדש — הזינו את כתובת האימייל של חשבון Google. המשתמש יצטרך להתחבר עם Google כדי לגשת לאזור הניהול.
        </Text>
        <div className="flex gap-2 flex-wrap">
          <Input
            type="email"
            placeholder="admin@example.com"
            value={newEmail}
            onChange={(e) => setNewEmail((e.currentTarget as HTMLInputElement).value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
            className="flex-1 min-w-[200px]"
          />
          <Button
            variant="primary"
            size="sm"
            icon={adding ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
            onClick={handleAdd}
            disabled={!newEmail.trim() || adding}
          >
            {adding ? 'מוסיף...' : 'הוסף אדמין'}
          </Button>
        </div>
      </Card>

      {admins.length === 0 ? (
        <Card variant="accent" className="p-8 text-center">
          <Shield className="w-12 h-12 text-text-muted mx-auto mb-3" />
          <Text variant="muted">אין אדמינים ברשימה</Text>
          <Text variant="muted" size="sm">
            הוסיפו את האדמין הראשון באמצעות הטופס למעלה
          </Text>
        </Card>
      ) : (
        <div className="space-y-2">
          {admins.map((email) => (
            <div
              key={email}
              className="flex items-center justify-between p-3 border border-white/5 bg-white/2"
            >
              <div className="flex items-center gap-3">
                <Shield className="w-4 h-4 text-accent-violet" />
                <Text className="font-medium">{email}</Text>
              </div>
              <Button
                variant="ghost"
                size="sm"
                icon={removing === email ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                onClick={() => handleRemove(email)}
                disabled={removing !== null}
                className="text-red-400 hover:text-red-300"
              >
                הסר
              </Button>
            </div>
          ))}
        </div>
      )}
    </>
  )
}
