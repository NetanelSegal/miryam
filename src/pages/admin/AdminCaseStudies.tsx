import { useState, useEffect } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { Heading, Text, Button, Input, Card, useToast, LoadingState } from '@/components/ui'
import { useAsyncData } from '@/hooks'
import * as caseStudiesStore from '@/lib/case-studies-store'

export function AdminCaseStudies() {
  const { toast } = useToast()
  const { data: items, loading, error, refresh: load } = useAsyncData(caseStudiesStore.getAllCaseStudies)
  const [adding, setAdding] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ brand: '', title: '', description: '', metric: '', imageUrl: '' })

  useEffect(() => {
    if (error) toast('error', error.message)
  }, [error, toast])

  const handleAdd = async () => {
    if (!form.brand.trim() || !form.title.trim() || !form.description.trim() || !form.metric.trim() || !form.imageUrl.trim()) {
      toast('error', 'מלאו את כל השדות')
      return
    }
    setSaving(true)
    try {
      await caseStudiesStore.addCaseStudy({
        ...form,
        order: (items ?? []).length,
      })
      setForm({ brand: '', title: '', description: '', metric: '', imageUrl: '' })
      setAdding(false)
      load()
      toast('success', 'הקמפיין נוסף')
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
      await caseStudiesStore.deleteCaseStudy(id)
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
      <Heading level={4} className="text-white">קמפיינים (Case Studies)</Heading>
      <Text variant="muted" size="sm" className="block mb-4">
        נשלפים לאתר בדף הבית. הזינו נתונים אמיתיים.
      </Text>

      {adding && (
        <Card variant="accent" className="p-5 space-y-3">
          <Input label="מותג" value={form.brand} onChange={(e) => setForm(f => ({ ...f, brand: e.target.value }))} placeholder="L'Oréal" />
          <Input label="כותרת" value={form.title} onChange={(e) => setForm(f => ({ ...f, title: e.target.value }))} placeholder="קמפיין True Match" />
          <Input label="תיאור" value={form.description} onChange={(e) => setForm(f => ({ ...f, description: e.target.value }))} placeholder="סדרת תוכן שהגיעה ל-2.7 מיליון צפיות" multiline />
          <Input label="מטריקה" value={form.metric} onChange={(e) => setForm(f => ({ ...f, metric: e.target.value }))} placeholder="2.7M צפיות" />
          <Input label="תמונה (URL)" value={form.imageUrl} onChange={(e) => setForm(f => ({ ...f, imageUrl: e.target.value }))} placeholder="/images/..." dir="ltr" />
          <div className="flex gap-2">
            <Button variant="primary" size="sm" onClick={handleAdd} disabled={saving}>הוספה</Button>
            <Button variant="ghost" size="sm" onClick={() => setAdding(false)}>ביטול</Button>
          </div>
        </Card>
      )}

      {!adding && (
        <Button variant="primary" size="sm" icon={<Plus className="w-4 h-4" />} onClick={() => setAdding(true)}>
          קמפיין חדש
        </Button>
      )}

      <div className="space-y-2">
        {(items ?? []).map((c) => (
          <Card key={c.id} variant="accent" className="p-4 flex items-center justify-between">
            <div>
              <Text className="font-semibold">{c.brand} — {c.title}</Text>
              <Text variant="muted" size="sm">{c.metric}</Text>
            </div>
            <Button variant="ghost" size="sm" icon={<Trash2 className="w-4 h-4" />} onClick={() => handleDelete(c.id)} className="text-red-400" disabled={saving}>מחק</Button>
          </Card>
        ))}
      </div>
    </div>
  )
}
