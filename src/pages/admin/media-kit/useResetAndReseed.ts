import { useState, useCallback } from 'react'
import { resetAllFirestore, resetAllStorage } from '@/lib/reset-store'
import { seedBrandsAndCaseStudies } from '@/lib/seed'

const CONFIRM_MSG = 'פעולה זו תמחק את כל הנתונים (מותגים, קמפיינים, קולות, תחפושות, ברכות וכו\') ותצור מחדש רק מותגים וקמפיינים מהקבצים המקומיים. להמשיך?'

export function useResetAndReseed(toast: (type: 'success' | 'error', msg: string) => void) {
  const [resetting, setResetting] = useState(false)

  const handleResetAndReseed = useCallback(async () => {
    if (!confirm(CONFIRM_MSG)) return
    setResetting(true)
    try {
      await resetAllFirestore()
      const { caseStudies, costumes, blessings } = await resetAllStorage()
      const { brandsAdded, caseStudiesAdded } = await seedBrandsAndCaseStudies()
      toast(
        'success',
        `איפוס הושלם. נמחקו ${caseStudies + costumes + blessings} קבצים מ-Storage. נוצרו מחדש: ${brandsAdded} מותגים, ${caseStudiesAdded} קמפיינים`,
      )
    } catch (err) {
      toast('error', err instanceof Error ? err.message : 'שגיאה באיפוס ויצירה מחדש')
    } finally {
      setResetting(false)
    }
  }, [toast])

  return { handleResetAndReseed, resetting }
}
