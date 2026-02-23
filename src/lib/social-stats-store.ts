import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore'
import { db } from './firebase'

export interface TikTokVideo {
  url: string
  views?: number
  likes?: number
}

export interface SocialStats {
  youtube?: { subscribers: number; views?: number; likes?: number }
  instagram?: { followers: number; views?: number; likes?: number }
  tiktok?: { followers: number; views?: number; likes?: number }
  engagementPercent?: number
  tiktokTopVideos?: TikTokVideo[]
  updatedAt: number
}

export interface MediaKitConfig {
  youtubeChannelId?: string
  instagramUsername?: string
  tiktokUsername?: string
  manualInstagram?: number
  manualTiktok?: number
  manualEngagement?: number
  tiktokTopVideos?: TikTokVideo[]
}

const STATS_DOC = doc(db, 'mediaKit', 'socialStats')
const CONFIG_DOC = doc(db, 'mediaKit', 'config')

const FALLBACK: SocialStats = {
  youtube: { subscribers: 45000, views: 0 },
  instagram: { followers: 580000 },
  tiktok: { followers: 620000 },
  engagementPercent: 8.2,
  updatedAt: 0,
}

/** Calculate engagement % from likes/followers: (total likes) / (total followers) × 100 */
export function calcEngagementPercent(stats: {
  youtube?: { subscribers: number; likes?: number }
  instagram?: { followers: number; likes?: number }
  tiktok?: { followers: number; likes?: number }
}): number | undefined {
  const totalLikes =
    (stats.youtube?.likes ?? 0) + (stats.instagram?.likes ?? 0) + (stats.tiktok?.likes ?? 0)
  const totalFollowers =
    (stats.youtube?.subscribers ?? 0) + (stats.instagram?.followers ?? 0) + (stats.tiktok?.followers ?? 0)
  if (totalFollowers <= 0 || totalLikes <= 0) return undefined
  return Math.round((totalLikes / totalFollowers) * 1000) / 10
}

function parseVideo(v: unknown): TikTokVideo | null {
  if (typeof v === 'string') return { url: v }
  if (v && typeof v === 'object' && 'url' in v && typeof (v as { url: unknown }).url === 'string') {
    const o = v as { url: string; views?: number; likes?: number }
    return { url: o.url, views: o.views, likes: o.likes }
  }
  return null
}

function parseStats(data: Record<string, unknown> | undefined): SocialStats {
  if (!data) return FALLBACK
  const y = data.youtube as Record<string, number> | undefined
  const ig = data.instagram as Record<string, number> | undefined
  const tt = data.tiktok as Record<string, number> | undefined
  const videosRaw = data.tiktokTopVideos
  const videos = Array.isArray(videosRaw)
    ? videosRaw.map(parseVideo).filter((v): v is TikTokVideo => v != null).slice(0, 3)
    : undefined
  const base = {
    youtube: y ? { subscribers: y.subscribers ?? 0, views: y.views, likes: y.likes } : undefined,
    instagram: ig ? { followers: ig.followers ?? 0, views: ig.views, likes: ig.likes } : undefined,
    tiktok: tt ? { followers: tt.followers ?? 0, views: tt.views, likes: tt.likes } : undefined,
    tiktokTopVideos: videos && videos.length > 0 ? videos : undefined,
    updatedAt: typeof data.updatedAt === 'number' ? data.updatedAt : 0,
  }
  const engagementPercent =
    calcEngagementPercent(base) ??
    (typeof data.engagementPercent === 'number' ? data.engagementPercent : undefined)
  return { ...base, engagementPercent }
}

export function getSocialStats(): Promise<SocialStats> {
  return getDoc(STATS_DOC).then((snap) => parseStats(snap.exists() ? snap.data() : undefined))
}

export function subscribeToSocialStats(callback: (stats: SocialStats) => void): () => void {
  return onSnapshot(STATS_DOC, (snap) => {
    callback(parseStats(snap.exists() ? snap.data() : undefined))
  })
}

export function getMediaKitConfig(): Promise<MediaKitConfig> {
  return getDoc(CONFIG_DOC).then((snap) => (snap.exists() ? (snap.data() as MediaKitConfig) : {}))
}

export async function updateMediaKitConfig(partial: Partial<MediaKitConfig>): Promise<void> {
  const snap = await getDoc(CONFIG_DOC)
  const current = snap.exists() ? (snap.data() as MediaKitConfig) : {}
  await setDoc(CONFIG_DOC, { ...current, ...partial })
}

/** Remove undefined values (Firestore rejects them) */
function stripUndefined<T extends Record<string, unknown>>(obj: T): Record<string, unknown> {
  const out: Record<string, unknown> = {}
  for (const [k, v] of Object.entries(obj)) {
    if (v === undefined) continue
    if (v != null && typeof v === 'object' && !Array.isArray(v) && !(v instanceof Date)) {
      out[k] = stripUndefined(v as Record<string, unknown>)
    } else if (Array.isArray(v)) {
      out[k] = v.map((item) => {
        if (item != null && typeof item === 'object' && !Array.isArray(item))
          return stripUndefined(item as Record<string, unknown>)
        return item
      })
    } else {
      out[k] = v
    }
  }
  return out
}

/** Admin: update socialStats directly (no Cloud Functions) */
export async function updateSocialStats(partial: Partial<SocialStats>): Promise<void> {
  const snap = await getDoc(STATS_DOC)
  const current = snap.exists() ? snap.data() : {}
  const { engagementPercent: _removed, ...rest } = { ...current, ...partial, updatedAt: Date.now() } as Record<string, unknown>
  await setDoc(STATS_DOC, stripUndefined(rest))
}

/** Format number for display: 580000 -> "580K+", 8.2 -> "8.2%" */
export function formatStat(value: number, suffix: string, decimals = 0): string {
  if (suffix === '%') return `${value.toFixed(decimals)}%`
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M+`
  if (value >= 1_000) return `${(value / 1_000).toFixed(0)}K+`
  return `${value}${suffix}`
}
