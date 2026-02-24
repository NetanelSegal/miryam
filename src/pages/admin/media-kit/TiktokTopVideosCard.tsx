import { Video } from 'lucide-react'
import { Text, Button, Card, Input } from '@/components/ui'
import type { SocialStats } from '@/lib/social-stats-store'
import { isValidTiktokUrl } from './constants'

interface TiktokTopVideosCardProps {
  stats: SocialStats
  setStats: React.Dispatch<React.SetStateAction<SocialStats | null>>
  onSave: (updates: Partial<SocialStats>) => Promise<void>
  onError: (msg: string) => void
  saving: boolean
}

export function TiktokTopVideosCard({
  stats,
  setStats,
  onSave,
  onError,
  saving,
}: TiktokTopVideosCardProps) {
  const videos = stats.tiktokTopVideos ?? []

  const handleSave = () => {
    const toSave = videos.slice(0, 3)
    const invalid = toSave.some((v) => {
      const url = typeof v === 'string' ? v : v.url
      return url && !isValidTiktokUrl(url)
    })
    if (invalid) {
      onError('יש קישורים לא תקינים')
      return
    }
    const normalized = toSave
      .map((v) => (typeof v === 'string' ? { url: v } : { url: v.url, views: v.views, likes: v.likes }))
      .filter((v) => v.url)
    onSave({ tiktokTopVideos: normalized })
  }

  return (
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
                    next[i] = {
                      url: currUrl,
                      views: val,
                      likes: curr && typeof curr === 'object' ? curr.likes : undefined,
                    }
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
                    next[i] = {
                      url: currUrl,
                      views: curr && typeof curr === 'object' ? curr.views : undefined,
                      likes: val,
                    }
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
        onClick={handleSave}
        disabled={saving}
      >
        שמור
      </Button>
    </Card>
  )
}
