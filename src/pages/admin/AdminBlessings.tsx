import { useState, useEffect, useCallback } from 'react'
import { MessageSquareHeart, Trash2, Save } from 'lucide-react'
import { Heading, Text, Button, Input, Card, EmptyState, useToast, LoadingState } from '@/components/ui'
import * as store from '@/lib/store'
import { timeAgo } from '@/lib/date'

export function AdminBlessings() {
  const { toast } = useToast()
  const [blessings, setBlessings] = useState<store.Blessing[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editName, setEditName] = useState('')
  const [editMessage, setEditMessage] = useState('')
  const [saving, setSaving] = useState(false)

  const loadBlessings = useCallback(async () => {
    setLoading(true)
    try {
      const data = await store.getAllBlessings()
      setBlessings(data)
    } catch (err) {
      toast('error', err instanceof Error ? err.message : 'שגיאה בטעינת הברכות')
    } finally {
      setLoading(false)
    }
  }, [toast])

  useEffect(() => {
    loadBlessings()
  }, [loadBlessings])

  const startEdit = (b: store.Blessing) => {
    setEditingId(b.id)
    setEditName(b.name)
    setEditMessage(b.message)
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditName('')
    setEditMessage('')
  }

  const handleSave = async () => {
    if (!editingId || !editName.trim() || !editMessage.trim()) return
    setSaving(true)
    try {
      await store.updateBlessing(editingId, { name: editName.trim(), message: editMessage.trim() })
      setBlessings(prev => prev.map(b => b.id === editingId ? { ...b, name: editName.trim(), message: editMessage.trim() } : b))
      setEditingId(null)
      toast('success', 'הברכה עודכנה')
    } catch (err) {
      toast('error', err instanceof Error ? err.message : 'שגיאה בעדכון')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('למחוק את הברכה?')) return
    setSaving(true)
    try {
      await store.deleteBlessing(id)
      setBlessings(prev => prev.filter(b => b.id !== id))
      toast('success', 'הברכה נמחקה')
    } catch (err) {
      toast('error', err instanceof Error ? err.message : 'שגיאה במחיקה')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <LoadingState />

  if (blessings.length === 0) {
    return (
      <EmptyState icon={MessageSquareHeart} message="אין ברכות עדיין" />
    )
  }

  return (
    <div className="space-y-6">
      <Heading level={4} className="text-white">
        ניהול ברכות ({blessings.length})
      </Heading>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {blessings.map((b) => (
          <Card key={b.id} variant="accent" className="p-5 group">
            {editingId === b.id ? (
              <div className="space-y-3">
                <Input
                  label="שם"
                  value={editName}
                  onChange={(e) => setEditName((e.target as HTMLInputElement).value)}
                  placeholder="שם"
                />
                <Input
                  label="ברכה"
                  value={editMessage}
                  onChange={(e) => setEditMessage((e.target as HTMLTextAreaElement).value)}
                  placeholder="ברכה"
                  multiline
                />
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" onClick={cancelEdit} disabled={saving}>
                    ביטול
                  </Button>
                  <Button variant="primary" size="sm" icon={<Save className="w-4 h-4" />} onClick={handleSave} disabled={saving}>
                    שמירה
                  </Button>
                </div>
              </div>
            ) : (
              <>
                {b.photoURL && (
                  <img src={b.photoURL} alt="" className="w-full h-32 object-cover mb-3" />
                )}
                <Text className="whitespace-pre-wrap mb-2">{b.message}</Text>
                <div className="flex items-center justify-between">
                  <Heading level={6} className="text-white">{b.name}</Heading>
                  <Text variant="muted" size="xs">{timeAgo(b.timestamp)}</Text>
                </div>
                <div className="flex gap-2 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button variant="ghost" size="sm" icon={<Save className="w-4 h-4" />} onClick={() => startEdit(b)}>
                    עריכה
                  </Button>
                  <Button variant="ghost" size="sm" icon={<Trash2 className="w-4 h-4" />} onClick={() => handleDelete(b.id)} className="text-red-400 hover:text-red-300">
                    מחיקה
                  </Button>
                </div>
              </>
            )}
          </Card>
        ))}
      </div>
    </div>
  )
}
