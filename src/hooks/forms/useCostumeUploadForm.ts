import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { requiredString } from '@/lib/validation'
import { useFileUpload } from '@/hooks/useFileUpload'
import * as store from '@/lib/store'

const costumeSchema = z.object({
  title: requiredString('שם התחפושת נדרש'),
})

export type CostumeFormData = z.infer<typeof costumeSchema>

export function useCostumeUploadForm(options: {
  participantId: string
  participantName: string
  onSuccess?: (entry: store.CostumeEntry) => void
  onError?: (message: string) => void
}) {
  const fileUpload = useFileUpload()
  const form = useForm<CostumeFormData>({
    resolver: zodResolver(costumeSchema),
    defaultValues: { title: '' },
  })

  const onSubmit = form.handleSubmit(async (data) => {
    if (!fileUpload.selectedFile) {
      options.onError?.('נא לבחור תמונה')
      return
    }
    try {
      const imageUrl = await store.uploadCostumeImage(fileUpload.selectedFile)
      const entry = await store.submitCostume({
        participantId: options.participantId,
        participantName: options.participantName,
        title: data.title.trim(),
        imageUrl,
      })
      options.onSuccess?.(entry)
      form.reset({ title: '' })
      fileUpload.clearFile()
    } catch (err) {
      options.onError?.(err instanceof Error ? err.message : 'שגיאה בהעלאה')
    }
  })

  return {
    register: form.register,
    handleSubmit: onSubmit,
    errors: form.formState.errors,
    isSubmitting: form.formState.isSubmitting,
    ...fileUpload,
  }
}
