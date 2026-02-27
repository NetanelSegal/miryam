import { useState, useMemo } from 'react'
import { ShieldCheck, ShieldX, Camera, Trash2 } from 'lucide-react'
import { Heading, Text, Button, Card, EmptyState } from '@/components/ui'
import { getCostumeImageUrl, type CostumeEntry } from '@/lib/store'

interface AdminCostumesProps {
  pendingCostumes: CostumeEntry[]
  approvedCostumes: CostumeEntry[]
  allCostumes: CostumeEntry[]
  onReview: (costumeId: string, status: 'approved' | 'rejected') => void
  onDelete: (costume: CostumeEntry) => Promise<void>
}

export function AdminCostumes({ pendingCostumes, approvedCostumes, allCostumes, onReview, onDelete }: AdminCostumesProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const rejectedCostumes = useMemo(
    () => allCostumes.filter(c => c.status === 'rejected'),
    [allCostumes]
  )

  const handleDelete = async (c: CostumeEntry) => {
    if (!confirm('למחוק את התחפושת?')) return
    setDeletingId(c.id)
    try {
      await onDelete(c)
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <>
      <Heading level={4} className="text-white mb-4">
        ממתינות לאישור ({pendingCostumes.length})
      </Heading>
      {pendingCostumes.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
          {pendingCostumes.map(c => (
            <Card key={c.id} variant="top" className="overflow-hidden">
              <div className="aspect-[3/4] overflow-hidden">
                <img src={getCostumeImageUrl(c)} alt={c.title} className="w-full h-full object-cover" />
              </div>
              <div className="p-4">
                <Text className="font-semibold mb-1">{c.title}</Text>
                <Text variant="muted" size="xs" className="mb-3">מאת: {c.participantName}</Text>
                <div className="flex gap-2 flex-wrap">
                  <Button variant="primary" size="sm" icon={<ShieldCheck className="w-4 h-4" />}
                    onClick={() => onReview(c.id, 'approved')} className="flex-1" disabled={!!deletingId}>
                    אישור
                  </Button>
                  <Button variant="ghost" size="sm" icon={<ShieldX className="w-4 h-4" />}
                    onClick={() => onReview(c.id, 'rejected')}
                    className="flex-1 text-red-400 hover:text-red-300" disabled={!!deletingId}>
                    דחייה
                  </Button>
                  <button
                    type="button"
                    onClick={() => handleDelete(c)}
                    className="p-2 text-red-400 hover:text-red-300 disabled:opacity-50"
                    disabled={!!deletingId}
                    title="מחיקה"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState icon={Camera} message="אין תחפושות ממתינות" className="mb-10" />
      )}

      <Heading level={4} className="text-white mb-4">
        מאושרות ({approvedCostumes.length})
      </Heading>
      {approvedCostumes.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mb-10">
          {approvedCostumes.map(c => (
            <div key={c.id} className="border border-emerald-500/20 bg-emerald-500/5 overflow-hidden group relative">
              <div className="aspect-square overflow-hidden">
                <img src={getCostumeImageUrl(c)} alt={c.title} className="w-full h-full object-cover" />
              </div>
              <div className="p-2 flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <Text size="xs" className="font-semibold">{c.title}</Text>
                  <Text variant="muted" size="xs">{c.participantName}</Text>
                </div>
                <button
                  type="button"
                  onClick={() => handleDelete(c)}
                  className="shrink-0 p-1.5 text-red-400 hover:text-red-300 opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-50"
                  disabled={!!deletingId}
                  title="מחיקה"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <Text variant="muted" className="mb-10">אין תחפושות מאושרות עדיין</Text>
      )}

      {rejectedCostumes.length > 0 && (
        <>
          <Heading level={4} className="text-white mb-4">
            נדחו ({rejectedCostumes.length})
          </Heading>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {rejectedCostumes.map(c => (
              <div key={c.id} className="border border-red-500/20 bg-red-500/5 overflow-hidden opacity-60 group relative">
                <div className="aspect-square overflow-hidden">
                  <img src={getCostumeImageUrl(c)} alt={c.title} className="w-full h-full object-cover" />
                </div>
                <div className="p-2 flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <Text size="xs" className="font-semibold">{c.title}</Text>
                    <Text variant="muted" size="xs">{c.participantName}</Text>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDelete(c)}
                    className="shrink-0 p-1.5 text-red-400 hover:text-red-300 opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-50"
                    disabled={!!deletingId}
                    title="מחיקה"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </>
  )
}
