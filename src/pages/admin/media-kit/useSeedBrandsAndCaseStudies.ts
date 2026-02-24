import { useState, useCallback } from 'react'
import { seedBrandsAndCaseStudies } from '@/lib/seed'

export function useSeedBrandsAndCaseStudies(toast: (type: 'success' | 'error', msg: string) => void) {
  const [seeding, setSeeding] = useState(false)

  const handleSeed = useCallback(async () => {
    setSeeding(true)
    try {
      const { brandsAdded, caseStudiesAdded } = await seedBrandsAndCaseStudies()
      if (brandsAdded > 0 || caseStudiesAdded > 0) {
        toast('success', `נוסף: ${brandsAdded} מותגים, ${caseStudiesAdded} קמפיינים`)
      } else {
        toast('success', 'הנתונים כבר קיימים')
      }
    } catch (err) {
      toast('error', err instanceof Error ? err.message : 'שגיאה ביצירת נתונים')
    } finally {
      setSeeding(false)
    }
  }, [toast])

  return { handleSeed, seeding }
}
