import { Upload } from 'lucide-react'
import { Text, Button } from '@/components/ui'

interface CaseStudyImageUploadProps {
  fileInputRef: React.RefObject<HTMLInputElement | null>
  preview: string | null
  imageUrl: string
  uploading: boolean
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export function CaseStudyImageUpload({
  fileInputRef,
  preview,
  imageUrl,
  uploading,
  onFileChange,
}: CaseStudyImageUploadProps) {
  return (
    <div>
      <Text variant="muted" size="sm" className="block mb-2">
        תמונה
      </Text>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={onFileChange}
      />
      <div className="flex gap-2 flex-wrap items-center">
        <Button
          variant="ghost"
          size="sm"
          icon={<Upload className="w-4 h-4" />}
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
        >
          {uploading ? 'מעלה...' : 'העלאת קובץ'}
        </Button>
      </div>
      {(preview || imageUrl) && (
        <img
          src={preview ?? imageUrl}
          alt="תצוגה מקדימה"
          className="mt-2 w-20 h-20 object-cover"
        />
      )}
    </div>
  )
}
