import { useState, useEffect, useCallback } from 'react'
import { BarChart3, Loader2, Video } from 'lucide-react'
import { Heading, Text, Button, Card, Input, useToast } from '@/components/ui'
import * as socialStatsStore from '@/lib/social-stats-store'
import { calcEngagementPercent } from '@/lib/social-stats-store'

const TIKTOK_URL_REGEX = /^https?:\/\/(www\.)?(tiktok\.com|vm\.tiktok\.com)\/.+$/

function isValidTiktokUrl(url: string): boolean {
  if (!url.trim()) return true
  return TIKTOK_URL_REGEX.test(url.trim())
}

export function AdminMediaKit() {
  const { toast } = useToast()
  const [stats, setStats] = useState<socialStatsStore.SocialStats | null>(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    return socialStatsStore.subscribeToSocialStats(setStats)
  }, [])

  const handleSave = useCallback(
    async (updates: Partial<socialStatsStore.SocialStats>) => {
      if (stats === null) return
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
    [stats, toast]
  )

  if (stats === null) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-accent-violet" />
      </div>
    )
  }

  return (
    <>
      <Heading level={4} className="text-white mb-6">
        <BarChart3 className="w-5 h-5 inline-block ml-2 align-middle" />
        Media Kit — נתוני רשתות
      </Heading>

      <Card variant="accent" className="p-5 mb-6">
        <Text variant="muted" size="sm">
          עודכן לאחרונה: {stats.updatedAt ? new Date(stats.updatedAt).toLocaleString('he-IL') : '—'}
        </Text>
        <Text variant="muted" size="xs" className="mt-1 block">
          כל השמירות מתפרסמות ישירות לאתר — ללא Cloud Functions
        </Text>
      </Card>

      <div className="space-y-4">
        <Card variant="accent" className="p-5">
          <Text className="font-medium mb-3 block">YouTube</Text>
          <Text variant="muted" size="sm" className="mb-2">
            נתונים מ-YouTube Studio → Analytics. הזן ידנית.
          </Text>
          <div className="flex flex-wrap gap-2 items-end">
            <Input
              type="number"
              value={stats.youtube?.subscribers ?? ''}
              onChange={(e) => {
                const v = e.target.value ? parseInt(e.target.value, 10) : undefined
                setStats((s) =>
                  s ? { ...s, youtube: { ...s.youtube, subscribers: v ?? 0 } } : null
                )
              }}
              placeholder="מנויים"
              dir="ltr"
              className="w-28"
            />
            <Input
              type="number"
              value={stats.youtube?.views ?? ''}
              onChange={(e) => {
                const v = e.target.value ? parseInt(e.target.value, 10) : undefined
                setStats((s) =>
                  s ? { ...s, youtube: { ...(s.youtube ?? { subscribers: 0 }), views: v } } : null
                )
              }}
              placeholder="צפיות"
              dir="ltr"
              className="w-28"
            />
            <Input
              type="number"
              value={stats.youtube?.likes ?? ''}
              onChange={(e) => {
                const v = e.target.value ? parseInt(e.target.value, 10) : undefined
                setStats((s) =>
                  s ? { ...s, youtube: { ...(s.youtube ?? { subscribers: 0 }), likes: v } } : null
                )
              }}
              placeholder="לייקים"
              dir="ltr"
              className="w-28"
            />
            <Button
              variant="primary"
              size="sm"
              onClick={() =>
                handleSave({
                  youtube: {
                    subscribers: stats.youtube?.subscribers ?? 0,
                    views: stats.youtube?.views,
                    likes: stats.youtube?.likes,
                  },
                })
              }
              disabled={saving}
            >
              שמור
            </Button>
          </div>
        </Card>

        <Card variant="accent" className="p-5">
          <Text className="font-medium mb-3 block">אינסטגרם</Text>
          <Text variant="muted" size="sm" className="mb-2">
            נתונים מ-Instagram Insights. הזן ידנית.
          </Text>
          <div className="flex flex-wrap gap-2 items-end">
            <Input
              type="number"
              value={stats.instagram?.followers ?? ''}
              onChange={(e) => {
                const v = e.target.value ? parseInt(e.target.value, 10) : undefined
                setStats((s) => (s ? { ...s, instagram: { ...s.instagram, followers: v ?? 0 } } : null))
              }}
              placeholder="עוקבים"
              dir="ltr"
              className="w-28"
            />
            <Input
              type="number"
              value={stats.instagram?.views ?? ''}
              onChange={(e) => {
                const v = e.target.value ? parseInt(e.target.value, 10) : undefined
                setStats((s) =>
                  s ? { ...s, instagram: { ...(s.instagram ?? { followers: 0 }), views: v } } : null
                )
              }}
              placeholder="צפיות"
              dir="ltr"
              className="w-28"
            />
            <Input
              type="number"
              value={stats.instagram?.likes ?? ''}
              onChange={(e) => {
                const v = e.target.value ? parseInt(e.target.value, 10) : undefined
                setStats((s) =>
                  s ? { ...s, instagram: { ...(s.instagram ?? { followers: 0 }), likes: v } } : null
                )
              }}
              placeholder="לייקים"
              dir="ltr"
              className="w-28"
            />
            <Button
              variant="primary"
              size="sm"
              onClick={() =>
                handleSave({
                  instagram: {
                    followers: stats.instagram?.followers ?? 0,
                    views: stats.instagram?.views,
                    likes: stats.instagram?.likes,
                  },
                })
              }
              disabled={saving}
            >
              שמור
            </Button>
          </div>
        </Card>

        <Card variant="accent" className="p-5">
          <Text className="font-medium mb-3 block">טיקטוק</Text>
          <Text variant="muted" size="sm" className="mb-2">
            נתונים מ-TikTok Creator Tools → Analytics. הזן ידנית.
          </Text>
          <div className="flex flex-wrap gap-2 items-end">
            <Input
              type="number"
              value={stats.tiktok?.followers ?? ''}
              onChange={(e) => {
                const v = e.target.value ? parseInt(e.target.value, 10) : undefined
                setStats((s) => (s ? { ...s, tiktok: { ...s.tiktok, followers: v ?? 0 } } : null))
              }}
              placeholder="עוקבים"
              dir="ltr"
              className="w-28"
            />
            <Input
              type="number"
              value={stats.tiktok?.views ?? ''}
              onChange={(e) => {
                const v = e.target.value ? parseInt(e.target.value, 10) : undefined
                setStats((s) =>
                  s ? { ...s, tiktok: { ...(s.tiktok ?? { followers: 0 }), views: v } } : null
                )
              }}
              placeholder="צפיות"
              dir="ltr"
              className="w-28"
            />
            <Input
              type="number"
              value={stats.tiktok?.likes ?? ''}
              onChange={(e) => {
                const v = e.target.value ? parseInt(e.target.value, 10) : undefined
                setStats((s) =>
                  s ? { ...s, tiktok: { ...(s.tiktok ?? { followers: 0 }), likes: v } } : null
                )
              }}
              placeholder="לייקים"
              dir="ltr"
              className="w-28"
            />
            <Button
              variant="primary"
              size="sm"
              onClick={() =>
                handleSave({
                  tiktok: {
                    followers: stats.tiktok?.followers ?? 0,
                    views: stats.tiktok?.views,
                    likes: stats.tiktok?.likes,
                  },
                })
              }
              disabled={saving}
            >
              שמור
            </Button>
          </div>
        </Card>

        <Card variant="accent" className="p-5">
          <Text className="font-medium mb-3 block">אחוז מעורבות (חישוב אוטומטי)</Text>
          <Text variant="muted" size="sm" className="mb-2">
            מחושב אוטומטית: סה"כ לייקים ÷ סה"כ עוקבים/מנויים × 100. הזן לייקים ביוטיוב, אינסטגרם וטיקטוק.
          </Text>
          <div className="flex items-center gap-3">
            {(() => {
              const eng = calcEngagementPercent(stats)
              return (
                <>
                  <span className="text-2xl font-bold text-accent-violet">
                    {eng != null ? `${eng}%` : '—'}
                  </span>
                  {eng == null && (
                    <Text variant="muted" size="xs">
                      הזן עוקבים/מנויים ולייקים כדי לראות את החישוב
                    </Text>
                  )}
                </>
              )
            })()}
          </div>
        </Card>

        <Card variant="accent" className="p-5">
          <Text className="font-medium mb-3 block">
            <Video className="w-4 h-4 inline-block ml-2 align-middle" />
            3 הסרטונים הפופולריים מ-TikTok
          </Text>
          <Text variant="muted" size="sm" className="mb-3">
            הזן קישור + צפיות ולייקים לכל סרטון (מהאפליקציה או Creator Tools).
            <span className="block mt-1 text-text-muted/80">
              אין API ציבורי שמאפשר לשלוף צפיות/לייקים מקישור — TikTok לא חושף את זה. לכן ההזנה ידנית.
            </span>
          </Text>
          <div className="space-y-4">
            {[0, 1, 2].map((i) => {
              const videos = stats.tiktokTopVideos ?? []
              const v = videos[i]
              const url = !v ? '' : typeof v === 'string' ? v : v.url
              const views = v && typeof v === 'object' ? v.views : undefined
              const likes = v && typeof v === 'object' ? v.likes : undefined
              const invalid = url && !isValidTiktokUrl(url)
              return (
                <div key={i} className="flex flex-col gap-2 p-3 bg-white/5 rounded-lg">
                  <div className="flex gap-2 items-center">
                    <Input
                      value={url}
                      onChange={(e) => {
                        const next = [...videos.slice(0, 3)]
                        while (next.length <= i) next.push({ url: '' })
                        const curr = next[i]
                        next[i] = {
                          url: e.target.value,
                          views: curr && typeof curr === 'object' ? curr.views : undefined,
                          likes: curr && typeof curr === 'object' ? curr.likes : undefined,
                        }
                        setStats((s) => (s ? { ...s, tiktokTopVideos: next } : null))
                      }}
                      placeholder={`קישור סרטון ${i + 1}`}
                      dir="ltr"
                      className={`flex-1 ${invalid ? 'border-red-500' : ''}`}
                    />
                    {invalid && (
                      <Text variant="muted" size="xs" className="text-red-400 shrink-0">
                        קישור לא תקין
                      </Text>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      value={views ?? ''}
                      onChange={(e) => {
                        const val = e.target.value ? parseInt(e.target.value, 10) : undefined
                        const next = [...(stats.tiktokTopVideos ?? []).slice(0, 3)]
                        while (next.length <= i) next.push({ url: '' })
                        const curr = next[i]
                        const currUrl = typeof curr === 'string' ? curr : curr?.url ?? ''
                        next[i] = { url: currUrl, views: val, likes: curr && typeof curr === 'object' ? curr.likes : undefined }
                        setStats((s) => (s ? { ...s, tiktokTopVideos: next } : null))
                      }}
                      placeholder="צפיות"
                      dir="ltr"
                      className="w-28"
                    />
                    <Input
                      type="number"
                      value={likes ?? ''}
                      onChange={(e) => {
                        const val = e.target.value ? parseInt(e.target.value, 10) : undefined
                        const next = [...(stats.tiktokTopVideos ?? []).slice(0, 3)]
                        while (next.length <= i) next.push({ url: '' })
                        const curr = next[i]
                        const currUrl = typeof curr === 'string' ? curr : curr?.url ?? ''
                        next[i] = { url: currUrl, views: curr && typeof curr === 'object' ? curr.views : undefined, likes: val }
                        setStats((s) => (s ? { ...s, tiktokTopVideos: next } : null))
                      }}
                      placeholder="לייקים"
                      dir="ltr"
                      className="w-28"
                    />
                  </div>
                </div>
              )
            })}
          </div>
          <Button
            variant="primary"
            size="sm"
            className="mt-2"
            onClick={() => {
              const videos = (stats.tiktokTopVideos ?? []).slice(0, 3)
              const invalid = videos.some((v) => {
                const url = typeof v === 'string' ? v : v.url
                return url && !isValidTiktokUrl(url)
              })
              if (invalid) {
                toast('error', 'יש קישורים לא תקינים')
                return
              }
              const normalized = videos
                .map((v) => (typeof v === 'string' ? { url: v } : { url: v.url, views: v.views, likes: v.likes }))
                .filter((v) => v.url)
              handleSave({ tiktokTopVideos: normalized })
            }}
            disabled={saving}
          >
            שמור
          </Button>
        </Card>
      </div>
    </>
  )
}
