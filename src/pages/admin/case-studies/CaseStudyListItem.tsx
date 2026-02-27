import { Pencil, Trash2 } from 'lucide-react'
import { Text, Button, Card } from '@/components/ui'
import { getCaseStudyImageSrc, type CaseStudy } from '@/lib/case-studies-store'
import { CaseStudyFormCard, type CaseStudyFormData } from './CaseStudyFormCard'

interface CaseStudyListItemProps {
  item: CaseStudy
  isEditing: boolean
  editForm: CaseStudyFormData
  setEditForm: React.Dispatch<React.SetStateAction<CaseStudyFormData>>
  editFileRef: React.RefObject<HTMLInputElement | null>
  editPreview: string | null
  uploading: boolean
  saving: boolean
  onEditFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onStartEdit: () => void
  onCancelEdit: () => void
  onSaveEdit: () => void
  onDelete: () => void
}

export function CaseStudyListItem({
  item,
  isEditing,
  editForm,
  setEditForm,
  editFileRef,
  editPreview,
  uploading,
  saving,
  onEditFileChange,
  onStartEdit,
  onCancelEdit,
  onSaveEdit,
  onDelete,
}: CaseStudyListItemProps) {
  if (isEditing) {
    return (
      <CaseStudyFormCard
        form={editForm}
        setForm={setEditForm}
        fileInputRef={editFileRef}
        preview={editPreview}
        uploading={uploading}
        saving={saving}
        onFileChange={onEditFileChange}
        onSubmit={onSaveEdit}
        onCancel={onCancelEdit}
        submitLabel="שמור"
        className="p-4"
      />
    )
  }

  return (
    <Card variant="accent" className="p-4">
      <div className="flex items-center gap-3">
        {item.imageUrl && (
          <img
            src={getCaseStudyImageSrc(item.imageUrl)}
            alt={item.brand}
            className="w-16 h-16 object-cover shrink-0 rounded-none border border-white/10"
            referrerPolicy="no-referrer"
          />
        )}
        <div className="flex-1 min-w-0">
          <Text className="font-semibold">
            {item.brand} — {item.title}
          </Text>
          <Text variant="muted" size="sm">
            {item.metric}
          </Text>
        </div>
        <div className="flex gap-1 shrink-0">
          <Button
            variant="ghost"
            size="sm"
            icon={<Pencil className="w-4 h-4" />}
            onClick={onStartEdit}
            disabled={saving}
            title="עריכה"
          >
            ערוך
          </Button>
          <Button
            variant="ghost"
            size="sm"
            icon={<Trash2 className="w-4 h-4" />}
            onClick={onDelete}
            className="text-red-400"
            disabled={saving}
            title="מחיקה"
          >
            מחק
          </Button>
        </div>
      </div>
    </Card>
  )
}
