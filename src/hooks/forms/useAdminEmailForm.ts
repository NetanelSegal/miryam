import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { emailSchema } from '@/lib/validation'

const adminEmailSchema = z.object({
  email: emailSchema,
})

export type AdminEmailFormData = z.infer<typeof adminEmailSchema>

export function useAdminEmailForm(options: {
  onSubmit: (data: AdminEmailFormData) => Promise<void>
  onSuccess?: () => void
  onError?: (message: string) => void
}) {
  const form = useForm<AdminEmailFormData>({
    resolver: zodResolver(adminEmailSchema),
    defaultValues: { email: '' },
  })

  const onSubmit = form.handleSubmit(async (data) => {
    try {
      await options.onSubmit(data)
      form.reset({ email: '' })
      options.onSuccess?.()
    } catch (err) {
      options.onError?.(err instanceof Error ? err.message : 'שגיאה')
    }
  })

  return {
    register: form.register,
    handleSubmit: onSubmit,
    errors: form.formState.errors,
    isSubmitting: form.formState.isSubmitting,
    reset: form.reset,
  }
}
