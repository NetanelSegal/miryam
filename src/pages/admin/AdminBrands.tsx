import { useState, useEffect } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { Heading, Text, Button, Input, Card, useToast, LoadingState } from '@/components/ui'
import { useAsyncData } from '@/hooks'
import * as brandsStore from '@/lib/brands-store'

export function AdminBrands() {
  const { toast } = useToast()
  const { data: items, loading, error, refresh: load } = useAsyncData(brandsStore.getAllBrands)
  const [adding, setAdding] = useState(false)
  const [saving, setSaving] = useState(false)
  const [newName, setNewName] = useState('')

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
            <Text>{b.name}</Text>
            <button onClick={() => handleDelete(b.id)} className="text-red-400 hover:text-red-300" disabled={saving}>
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </Card>
        ))}
      </div>
    </div>
  )
}
