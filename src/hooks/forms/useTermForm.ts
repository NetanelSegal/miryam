import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { requiredString } from '@/lib/validation'

const termSchema = z.object({
  term: requiredString('מושג נדרש'),
  explanation: requiredString('הסבר נדרש'),
})

export type TermFormData = z.infer<typeof termSchema>

export function useTermForm(initial?: Partial<TermFormData>) {
  const form = useForm<TermFormData>({
    resolver: zodResolver(termSchema),
    defaultValues: { term: '', explanation: '', ...initial },
  })

  return {
    register: form.register,
    handleSubmit: form.handleSubmit,
    errors: form.formState.errors,
    reset: form.reset,
    setValue: form.setValue,
    getValues: form.getValues,
  }
}
