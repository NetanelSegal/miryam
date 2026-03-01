import { Button, Input } from '@/components/ui'
import { useToast } from '@/components/ui/Toast'
import { useContactForm } from '@/hooks/forms/useContactForm'

export function ContactForm() {
  const { toast } = useToast()
  const { register, handleSubmit, errors, isSubmitting } = useContactForm({
    onSuccess: () => toast('success', 'ההודעה נשלחה בהצלחה!'),
    onError: (msg) => toast('error', msg),
  })

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4 max-w-lg mx-auto">
      {/* Honeypot: hidden from users, bots often fill it */}
      <div className="absolute -left-[9999px] top-0 overflow-hidden" aria-hidden="true">
        <input
          type="text"
          {...register('website')}
          tabIndex={-1}
          autoComplete="off"
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input label="שם" {...register('name')} placeholder="השם שלך" error={errors.name?.message} />
        <Input label="חברה" {...register('company')} placeholder="שם החברה" />
      </div>
      <Input
        label="אימייל"
        type="email"
        {...register('email')}
        placeholder="your@email.com"
        dir="ltr"
        error={errors.email?.message}
      />
      <Input
        label="הודעה"
        multiline
        {...register('message')}
        placeholder="ספרו לנו על הפרויקט..."
        error={errors.message?.message}
      />
      <Button variant="primary" size="lg" type="submit" loading={isSubmitting} className="w-full">
        שליחה
      </Button>
    </form>
  )
}
