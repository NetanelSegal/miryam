import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { requiredString, emailSchema } from '@/lib/validation'
import * as store from '@/lib/store'

const CONTACT_RATE_LIMIT_MS = 5 * 60 * 1000
const CONTACT_STORAGE_KEY = 'miryam_contact_last_submit'

const contactSchema = z.object({
  name: requiredString(),
  company: z.string(),
  email: emailSchema,
  message: requiredString('הודעה נדרשת'),
  website: z.string().optional(), // honeypot: bots fill this; we check in onSubmit
})

export type ContactFormData = z.infer<typeof contactSchema>

const defaultValues: ContactFormData = {
  name: '',
  company: '',
  email: '',
  message: '',
  website: '',
}

export function useContactForm(options: {
  onSuccess?: () => void
  onError?: (message: string) => void
}) {
  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues,
  })

  const onSubmit = form.handleSubmit(async (data) => {
    if (data.website) {
      options.onError?.('שגיאה בשליחת ההודעה')
      return
    }
    const last = localStorage.getItem(CONTACT_STORAGE_KEY)
    if (last) {
      const elapsed = Date.now() - Number(last)
      if (elapsed < CONTACT_RATE_LIMIT_MS) {
        options.onError?.('אנא המתינו מעט לפני שליחה נוספת')
        return
      }
    }
    try {
      const { name, company, email, message } = data
      await store.saveContact({ name, company, email, message })
      localStorage.setItem(CONTACT_STORAGE_KEY, String(Date.now()))
      options.onSuccess?.()
      form.reset(defaultValues)
    } catch {
      options.onError?.('שגיאה בשליחת ההודעה')
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
