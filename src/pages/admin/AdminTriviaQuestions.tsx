import { useState, useEffect, useCallback } from 'react'
import {
  Plus, Trash2, Save, GripVertical, ChevronUp, ChevronDown,
  Loader2, AlertCircle, Check,
} from 'lucide-react'
import { Heading, Text, Button, Input, Card, Badge, useToast } from '@/components/ui'
import * as triviaStore from '@/lib/trivia-store'
import type { TriviaQuestion } from '@/lib/trivia-store'

interface QuestionFormData {
  question: string
  options: string[]
  correct: number
}

const emptyForm: QuestionFormData = {
  question: '',
  options: ['', '', '', ''],
  correct: 0,
}

function QuestionEditor({
  initial,
  onSave,
  onCancel,
  saving,
}: {
  initial: QuestionFormData
  onSave: (data: QuestionFormData) => void
  onCancel: () => void
  saving: boolean
}) {
  const [form, setForm] = useState<QuestionFormData>(initial)

  const setOption = (idx: number, value: string) => {
    setForm(prev => {
      const opts = [...prev.options]
      opts[idx] = value
      return { ...prev, options: opts }
    })
  }

  const isValid = form.question.trim() && form.options.every(o => o.trim())

  return (
    <Card variant="accent" className="p-5 space-y-4">
      <Input
        label="שאלה"
        value={form.question}
        onChange={(e) => setForm(prev => ({ ...prev, question: (e.target as HTMLInputElement).value }))}
        placeholder="כתבו את השאלה..."
        required
      />

      <div className="space-y-2">
        <Text variant="secondary" size="sm" className="font-medium">תשובות</Text>
        {form.options.map((opt, i) => (
          <div key={i} className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setForm(prev => ({ ...prev, correct: i }))}
              className={`shrink-0 w-8 h-8 flex items-center justify-center border-2 transition-colors ${
                form.correct === i
                  ? 'border-emerald-500 bg-emerald-500/20 text-emerald-400'
                  : 'border-border-neutral text-text-muted hover:border-white/30'
              }`}
              title={form.correct === i ? 'תשובה נכונה' : 'סמנו כתשובה נכונה'}
            >
              {form.correct === i ? <Check className="w-4 h-4" /> : <span className="text-xs">{i + 1}</span>}
            </button>
            <div className="flex-1">
              <Input
                value={opt}
                onChange={(e) => setOption(i, (e.target as HTMLInputElement).value)}
                placeholder={`תשובה ${i + 1}`}
                required
              />
            </div>
          </div>
        ))}
        <Text variant="muted" size="xs">לחצו על המספר כדי לסמן את התשובה הנכונה</Text>
      </div>

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

export function AdminTriviaQuestions() {
  const { toast } = useToast()
  const [questions, setQuestions] = useState<TriviaQuestion[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [adding, setAdding] = useState(false)
  const [saving, setSaving] = useState(false)

  const loadQuestions = useCallback(async () => {
    try {
      setError(null)
      const data = await triviaStore.getAllQuestions()
      setQuestions(data)
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'שגיאה בטעינת השאלות'
      setError(msg)
      if (import.meta.env.DEV) console.error('Failed to load trivia questions:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadQuestions()
  }, [loadQuestions])

  const handleSeed = useCallback(async () => {
    setSaving(true)
    try {
      const seeded = await triviaStore.seedDefaultQuestions()
      setQuestions(seeded)
      toast('success', 'שאלות ברירת מחדל נטענו בהצלחה')
    } catch (err) {
      toast('error', err instanceof Error ? err.message : 'שגיאה בטעינת שאלות ברירת מחדל')
    } finally {
      setSaving(false)
    }
  }, [toast])

  const handleAdd = useCallback(async (data: QuestionFormData) => {
    setSaving(true)
    try {
      const newQ = await triviaStore.addQuestion({
        ...data,
        order: questions.length,
      })
      setQuestions(prev => [...prev, newQ])
      setAdding(false)
      toast('success', 'השאלה נוספה')
    } catch (err) {
      toast('error', err instanceof Error ? err.message : 'שגיאה בהוספת שאלה')
    } finally {
      setSaving(false)
    }
  }, [questions.length, toast])

  const handleUpdate = useCallback(async (id: string, data: QuestionFormData) => {
    setSaving(true)
    try {
      await triviaStore.updateQuestion(id, data)
      setQuestions(prev => prev.map(q => q.id === id ? { ...q, ...data } : q))
      setEditingId(null)
      toast('success', 'השאלה עודכנה')
    } catch (err) {
      toast('error', err instanceof Error ? err.message : 'שגיאה בעדכון שאלה')
    } finally {
      setSaving(false)
    }
  }, [toast])

  const handleDelete = useCallback(async (id: string) => {
    setSaving(true)
    try {
      await triviaStore.deleteQuestion(id)
      setQuestions(prev => prev.filter(q => q.id !== id))
      toast('success', 'השאלה נמחקה')
    } catch (err) {
      toast('error', err instanceof Error ? err.message : 'שגיאה במחיקת שאלה')
    } finally {
      setSaving(false)
    }
  }, [toast])

  const handleMove = useCallback(async (index: number, direction: 'up' | 'down') => {
    const swapIdx = direction === 'up' ? index - 1 : index + 1
    if (swapIdx < 0 || swapIdx >= questions.length) return

    const reordered = [...questions]
    const temp = reordered[index]!
    reordered[index] = reordered[swapIdx]!
    reordered[swapIdx] = temp

    setQuestions(reordered)
    try {
      await triviaStore.reorderQuestions(reordered)
    } catch {
      toast('error', 'שגיאה בשינוי סדר השאלות')
      loadQuestions()
    }
  }, [questions, toast, loadQuestions])

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
          <Button variant="primary" size="sm" onClick={loadQuestions}>נסו שנית</Button>
        </div>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Heading level={4} className="text-white">
          ניהול שאלות ({questions.length})
        </Heading>
        <div className="flex gap-2">
          {questions.length === 0 && (
            <Button variant="secondary" size="sm" onClick={handleSeed} disabled={saving} loading={saving}>
              טען שאלות ברירת מחדל
            </Button>
          )}
          <Button
            variant="primary"
            size="sm"
            icon={<Plus className="w-4 h-4" />}
            onClick={() => { setAdding(true); setEditingId(null) }}
            disabled={adding}
          >
            שאלה חדשה
          </Button>
        </div>
      </div>

      {adding && (
        <QuestionEditor
          initial={emptyForm}
          onSave={handleAdd}
          onCancel={() => setAdding(false)}
          saving={saving}
        />
      )}

      {questions.length === 0 && !adding ? (
        <Card variant="accent" className="p-8 text-center space-y-3">
          <Text variant="muted">אין שאלות טריוויה עדיין</Text>
          <Text variant="muted" size="sm">הוסיפו שאלות ידנית או טענו את שאלות ברירת המחדל</Text>
        </Card>
      ) : (
        <div className="space-y-3">
          {questions.map((q, i) => (
            <div key={q.id}>
              {editingId === q.id ? (
                <QuestionEditor
                  initial={{ question: q.question, options: q.options, correct: q.correct }}
                  onSave={(data) => handleUpdate(q.id, data)}
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
                    <GripVertical className="w-4 h-4 text-text-muted/40" />
                    <button
                      onClick={() => handleMove(i, 'down')}
                      disabled={i === questions.length - 1}
                      className="text-text-muted hover:text-white disabled:opacity-20 disabled:cursor-default transition-colors"
                    >
                      <ChevronDown className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <Text className="font-semibold">
                        <span className="text-text-muted mr-2">{i + 1}.</span>
                        {q.question}
                      </Text>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {q.options.map((opt, oi) => (
                        <Badge
                          key={oi}
                          variant={oi === q.correct ? 'success' : 'default'}
                          className="text-xs"
                        >
                          {opt}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => { setEditingId(q.id); setAdding(false) }}
                      className="p-1.5 text-text-muted hover:text-white transition-colors"
                      title="עריכה"
                    >
                      <Save className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(q.id)}
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
