import { Input, Button, Card } from '@/components/ui'
import { CaseStudyImageUpload } from './CaseStudyImageUpload'

export interface CaseStudyFormData {
  brand: string
  title: string
  description: string
  metric: string
  imageUrl: string
}

interface CaseStudyFormCardProps {
  form: CaseStudyFormData
  setForm: React.Dispatch<React.SetStateAction<CaseStudyFormData>>
  fileInputRef: React.RefObject<HTMLInputElement | null>
  preview: string | null
  uploading: boolean
  saving: boolean
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onSubmit: () => void
  onCancel: () => void
  submitLabel?: string
  className?: string
}

export function CaseStudyFormCard({
  form,
  setForm,
  fileInputRef,
  preview,
  uploading,
  saving,
  onFileChange,
  onSubmit,
  onCancel,
  submitLabel = 'הוספה',
  className = '',
}: CaseStudyFormCardProps) {
  return (
    <Card variant="accent" className={`p-5 space-y-3 ${className}`.trim()}>
      <Input
        label="מותג"
        value={form.brand}
        onChange={(e) => setForm((f) => ({ ...f, brand: e.target.value }))}
        placeholder="L'Oréal"
      />
      <Input
        label="כותרת"
        value={form.title}
        onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
        placeholder="קמפיין True Match"
      />
      <Input
        label="תיאור"
        value={form.description}
        onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
        placeholder="סדרת תוכן שהגיעה ל-2.7 מיליון צפיות"
        multiline
      />
      <Input
        label="מטריקה"
        value={form.metric}
        onChange={(e) => setForm((f) => ({ ...f, metric: e.target.value }))}
        placeholder="2.7M צפיות"
      />
      <CaseStudyImageUpload
        fileInputRef={fileInputRef}
        preview={preview}
        imageUrl={form.imageUrl}
        uploading={uploading}
        onFileChange={onFileChange}
      />
      <div className="flex gap-2">
        <Button
          variant="primary"
          size="sm"
          onClick={onSubmit}
          disabled={saving || uploading}
        >
          {submitLabel}
        </Button>
        <Button variant="ghost" size="sm" onClick={onCancel} disabled={saving}>
          ביטול
        </Button>
      </div>
    </Card>
  )
}
