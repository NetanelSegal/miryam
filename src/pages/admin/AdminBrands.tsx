import { useState, useEffect } from 'react'
import { Plus, Trash2, Pencil, Check, X } from 'lucide-react'
import { Heading, Text, Button, Input, Card, useToast, LoadingState } from '@/components/ui'
import { useAsyncData } from '@/hooks'
import * as brandsStore from '@/lib/brands-store'

export function AdminBrands() {
  const { toast } = useToast()
  const { data: items, loading, error, refresh: load } = useAsyncData(brandsStore.getAllBrands)
  const [adding, setAdding] = useState(false)
  const [saving, setSaving] = useState(false)
  const [newName, setNewName] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editName, setEditName] = useState('')

  useEffect(() => {
    if (error) toast('error', error.message)
  }, [error, toast])

  const handleAdd = async () => {
    if (!newName.trim()) return
    setSaving(true)
    try {
      await brandsStore.addBrand({ name: newName.trim(), order: (items ?? []).length })
      setNewName('')
      setAdding(false)
      load()
      toast('success', 'המותג נוסף')
    } catch (err) {
      toast('error', err instanceof Error ? err.message : 'שגיאה בהוספה')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('למחוק?')) return
    setSaving(true)
    try {
      await brandsStore.deleteBrand(id)
      load()
      toast('success', 'נמחק')
    } catch (err) {
      toast('error', err instanceof Error ? err.message : 'שגיאה במחיקה')
    } finally {
      setSaving(false)
    }
  }

  const startEdit = (b: { id: string; name: string }) => {
    setEditingId(b.id)
    setEditName(b.name)
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditName('')
  }

  const handleSaveEdit = async () => {
    if (!editingId || !editName.trim()) return
    setSaving(true)
    try {
      await brandsStore.updateBrand(editingId, { name: editName.trim() })
      setEditingId(null)
      setEditName('')
      load()
      toast('success', 'נשמר')
    } catch (err) {
      toast('error', err instanceof Error ? err.message : 'שגיאה בשמירה')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <LoadingState />

  return (
    <div className="space-y-6">
      <Heading level={4} className="text-white">מותגים (Marquee)</Heading>
      <Text variant="muted" size="sm" className="block mb-4">
        מוצגים בסקרולבארד "עבדתי עם" בדף הבית.
      </Text>

      {adding && (
        <Card variant="accent" className="p-4 flex gap-2">
          <Input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="שם מותג" className="flex-1" />
          <Button variant="primary" size="sm" onClick={handleAdd} disabled={saving || !newName.trim()}>הוספה</Button>
          <Button variant="ghost" size="sm" onClick={() => { setAdding(false); setNewName('') }}>ביטול</Button>
        </Card>
      )}

      {!adding && (
        <Button variant="primary" size="sm" icon={<Plus className="w-4 h-4" />} onClick={() => setAdding(true)}>
          מותג חדש
        </Button>
      )}

      <div className="flex flex-wrap gap-2">
        {(items ?? []).map((b) => (
          <Card key={b.id} variant="accent" className="px-4 py-2 flex items-center gap-2">
            {editingId === b.id ? (
              <>
                <Input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="שם מותג"
                  className="w-32 h-8 text-sm"
                  autoFocus
                />
                <button onClick={handleSaveEdit} className="text-green-400 hover:text-green-300" disabled={saving || !editName.trim()} title="שמירה">
                  <Check className="w-3.5 h-3.5" />
                </button>
                <button onClick={cancelEdit} className="text-zinc-400 hover:text-white" disabled={saving} title="ביטול">
                  <X className="w-3.5 h-3.5" />
                </button>
              </>
            ) : (
              <>
                <Text>{b.name}</Text>
                <button onClick={() => startEdit(b)} className="text-zinc-400 hover:text-white" disabled={saving} title="עריכה">
                  <Pencil className="w-3.5 h-3.5" />
                </button>
                <button onClick={() => handleDelete(b.id)} className="text-red-400 hover:text-red-300" disabled={saving} title="מחיקה">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </>
            )}
          </Card>
        ))}
      </div>
    </div>
  )
}
