import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { requiredString } from '@/lib/validation'
import { useFileUpload } from '@/hooks/useFileUpload'
import * as store from '@/lib/store'
import { uploadBlessingPhoto } from '@/lib/blessings-store'

const MAX_MESSAGE_LENGTH = 280

const blessingSchema = z.object({
  name: requiredString(),
  message: z.string().min(1, 'ברכה נדרשת').max(MAX_MESSAGE_LENGTH, `עד ${MAX_MESSAGE_LENGTH} תווים`),
})

export type BlessingFormData = z.infer<typeof blessingSchema>

const defaultValues: BlessingFormData = {
  name: '',
  message: '',
}

export function useBlessingForm(options: {
  onSuccess?: (saved: store.Blessing) => void
  onError?: (message: string) => void
  onReset?: () => void
}) {
  const fileUpload = useFileUpload()
  const form = useForm<BlessingFormData>({
    resolver: zodResolver(blessingSchema),
    defaultValues,
  })

  const onSubmit = form.handleSubmit(async (data) => {
    try {
      let photoURL: string | undefined
      if (fileUpload.selectedFile) {
        photoURL = await uploadBlessingPhoto(fileUpload.selectedFile)
      }

      const saved = await store.saveBlessing({
        name: data.name.trim(),
        message: data.message.trim(),
        photoURL,
      })

      options.onSuccess?.(saved)
      form.reset(defaultValues)
      fileUpload.clearFile()
      options.onReset?.()
    } catch (err) {
      options.onError?.(err instanceof Error ? err.message : 'שגיאה בשמירה')
    }
  })

  return {
    register: form.register,
    watch: form.watch,
    handleSubmit: onSubmit,
    errors: form.formState.errors,
    isSubmitting: form.formState.isSubmitting,
    reset: form.reset,
    MAX_MESSAGE_LENGTH,
    ...fileUpload,
  }
}
