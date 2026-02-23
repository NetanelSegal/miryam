import { useState, useEffect, useCallback } from 'react'
import {
  Plus, Trash2, Save, ChevronUp, ChevronDown,
  Loader2, AlertCircle, BookOpen,
} from 'lucide-react'
import { Heading, Text, Button, Input, Card, useToast } from '@/components/ui'
import * as dictionaryStore from '@/lib/dictionary-store'
import type { DictionaryTerm } from '@/lib/dictionary-store'

function TermEditor({
  initial,
  onSave,
  onCancel,
  saving,
}: {
  initial: { term: string; explanation: string }
  onSave: (data: { term: string; explanation: string }) => void
  onCancel: () => void
  saving: boolean
}) {
  const [form, setForm] = useState(initial)

  const isValid = form.term.trim() && form.explanation.trim()

  return (
    <Card variant="accent" className="p-5 space-y-4">
      <Input
        label="מושג"
        value={form.term}
        onChange={(e) => setForm(prev => ({ ...prev, term: (e.target as HTMLInputElement).value }))}
        placeholder="לדוגמה: פוב"
        required
      />
      <Input
        label="הסבר"
        value={form.explanation}
        onChange={(e) => setForm(prev => ({ ...prev, explanation: (e.target as HTMLInputElement).value }))}
        placeholder="כתבו את ההסבר..."
        required
      />
      <div className="flex gap-2 justify-end">
        <Button variant="ghost" size="sm" onClick={onCancel} disabled={saving}>
          ביטול
        </Button>
        <Button
          variant="primary"
          size="sm"
          icon={saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          onClick={() => onSave(form)}
          disabled={!isValid || saving}
        >
          {saving ? 'שומר...' : 'שמירה'}
        </Button>
      </div>
    </Card>
  )
}

const emptyForm = { term: '', explanation: '' }

export function AdminDictionary() {
  const { toast } = useToast()
  const [terms, setTerms] = useState<DictionaryTerm[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [adding, setAdding] = useState(false)
  const [saving, setSaving] = useState(false)

  const loadTerms = useCallback(async () => {
    try {
      setError(null)
      const data = await dictionaryStore.getAllTerms()
      setTerms(data)
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'שגיאה בטעינת המילון'
      setError(msg)
      if (import.meta.env.DEV) console.error('Failed to load dictionary:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadTerms()
  }, [loadTerms])

  const handleSeed = useCallback(async () => {
    setSaving(true)
    try {
      const seeded = await dictionaryStore.seedDefaultTerms()
      setTerms(seeded)
      toast('success', 'מושגי ברירת מחדל נטענו בהצלחה')
    } catch (err) {
      toast('error', err instanceof Error ? err.message : 'שגיאה בטעינת מושגי ברירת מחדל')
    } finally {
      setSaving(false)
    }
  }, [toast])

  const handleAdd = useCallback(async (data: { term: string; explanation: string }) => {
    setSaving(true)
    try {
      const newTerm = await dictionaryStore.addTerm({
        ...data,
        order: terms.length,
      })
      setTerms(prev => [...prev, newTerm])
      setAdding(false)
      toast('success', 'המושג נוסף')
    } catch (err) {
      toast('error', err instanceof Error ? err.message : 'שגיאה בהוספת מושג')
    } finally {
      setSaving(false)
    }
  }, [terms.length, toast])

  const handleUpdate = useCallback(async (id: string, data: { term: string; explanation: string }) => {
    setSaving(true)
    try {
      await dictionaryStore.updateTerm(id, data)
      setTerms(prev => prev.map(t => t.id === id ? { ...t, ...data } : t))
      setEditingId(null)
      toast('success', 'המושג עודכן')
    } catch (err) {
      toast('error', err instanceof Error ? err.message : 'שגיאה בעדכון מושג')
    } finally {
      setSaving(false)
    }
  }, [toast])

  const handleDelete = useCallback(async (id: string) => {
    setSaving(true)
    try {
      await dictionaryStore.deleteTerm(id)
      setTerms(prev => prev.filter(t => t.id !== id))
      toast('success', 'המושג נמחק')
    } catch (err) {
      toast('error', err instanceof Error ? err.message : 'שגיאה במחיקת מושג')
    } finally {
      setSaving(false)
    }
  }, [toast])

  const handleMove = useCallback(async (index: number, direction: 'up' | 'down') => {
    const swapIdx = direction === 'up' ? index - 1 : index + 1
    if (swapIdx < 0 || swapIdx >= terms.length) return

    const reordered = [...terms]
    const temp = reordered[index]!
    reordered[index] = reordered[swapIdx]!
    reordered[swapIdx] = temp

    setTerms(reordered)
    try {
      await dictionaryStore.reorderTerms(reordered)
    } catch {
      toast('error', 'שגיאה בשינוי סדר המושגים')
      loadTerms()
    }
  }, [terms, toast, loadTerms])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-accent-violet" />
      </div>
    )
  }

  if (error) {
    return (
      <Card variant="accent" className="p-6 text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-red-400 mx-auto" />
        <Heading level={5} className="text-white">שגיאת חיבור ל-Firestore</Heading>
        <Text variant="muted" size="sm" className="max-w-md mx-auto">{error}</Text>
        <div className="flex gap-3 justify-center">
          <Button variant="primary" size="sm" onClick={loadTerms}>נסו שנית</Button>
        </div>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Heading level={4} className="text-white">
          ניהול מילון ({terms.length})
        </Heading>
        <div className="flex gap-2">
          {terms.length === 0 && (
            <Button variant="secondary" size="sm" onClick={handleSeed} disabled={saving} loading={saving}>
              טען מושגי ברירת מחדל
            </Button>
          )}
          <Button
            variant="primary"
            size="sm"
            icon={<Plus className="w-4 h-4" />}
            onClick={() => { setAdding(true); setEditingId(null) }}
            disabled={adding}
          >
            מושג חדש
          </Button>
        </div>
      </div>

      {adding && (
        <TermEditor
          initial={emptyForm}
          onSave={handleAdd}
          onCancel={() => setAdding(false)}
          saving={saving}
        />
      )}

      {terms.length === 0 && !adding ? (
        <Card variant="accent" className="p-8 text-center space-y-3">
          <BookOpen className="w-12 h-12 text-text-muted mx-auto" />
          <Text variant="muted">אין מושגים במילון עדיין</Text>
          <Text variant="muted" size="sm">הוסיפו מושגים ידנית או טענו את מושגי ברירת המחדל</Text>
        </Card>
      ) : (
        <div className="space-y-3">
          {terms.map((t, i) => (
            <div key={t.id}>
              {editingId === t.id ? (
                <TermEditor
                  initial={{ term: t.term, explanation: t.explanation }}
                  onSave={(data) => handleUpdate(t.id, data)}
                  onCancel={() => setEditingId(null)}
                  saving={saving}
                />
              ) : (
                <div className="flex items-start gap-3 p-4 border border-white/5 bg-white/[0.02] group">
                  <div className="flex flex-col gap-1 shrink-0 pt-0.5">
                    <button
                      onClick={() => handleMove(i, 'up')}
                      disabled={i === 0}
                      className="text-text-muted hover:text-white disabled:opacity-20 disabled:cursor-default transition-colors"
                    >
                      <ChevronUp className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleMove(i, 'down')}
                      disabled={i === terms.length - 1}
                      className="text-text-muted hover:text-white disabled:opacity-20 disabled:cursor-default transition-colors"
                    >
                      <ChevronDown className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex-1 min-w-0">
                    <Text className="font-semibold block mb-1">{t.term}</Text>
                    <Text variant="secondary" size="sm">{t.explanation}</Text>
                  </div>

                  <div className="flex gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => { setEditingId(t.id); setAdding(false) }}
                      className="p-1.5 text-text-muted hover:text-white transition-colors"
                      title="עריכה"
                    >
                      <Save className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(t.id)}
                      className="p-1.5 text-text-muted hover:text-red-400 transition-colors"
                      title="מחיקה"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
