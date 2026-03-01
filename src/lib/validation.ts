import { z } from 'zod'

export const emailSchema = z.string().min(1, 'נדרש').email('אימייל לא תקין')
export const requiredString = (msg = 'נדרש') => z.string().min(1, msg)
export const maxLength = (n: number, msg?: string) =>
  z.string().max(n, msg ?? `עד ${n} תווים`)
