import { useState, useEffect, useCallback } from 'react'
import * as socialStatsStore from '@/lib/social-stats-store'
import type { SocialStats } from '@/lib/social-stats-store'

export function useSocialStats(toast: (type: 'success' | 'error', msg: string) => void) {
  const [stats, setStats] = useState<SocialStats | null>(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    return socialStatsStore.subscribeToSocialStats(setStats)
  }, [])

  const handleSave = useCallback(
    async (updates: Partial<SocialStats>) => {
      setSaving(true)
      try {
        await socialStatsStore.updateSocialStats(updates)
        setStats((prev) => (prev ? { ...prev, ...updates, updatedAt: Date.now() } : null))
        toast('success', 'נשמר ופורסם לאתר')
      } catch (err) {
        toast('error', err instanceof Error ? err.message : 'שגיאה בשמירה')
      } finally {
        setSaving(false)
      }
    },
    [toast]
  )

  return { stats, setStats, handleSave, saving }
}
