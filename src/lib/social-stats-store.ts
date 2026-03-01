import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { db } from './firebase';

export interface TikTokVideo {
  url: string;
  views?: number;
  likes?: number;
}

export interface SocialStartItem {
  subscribers?: number;
}

export interface SocialStats {
  youtube: SocialStartItem;
  instagram: SocialStartItem;
  tiktok: SocialStartItem;
  tiktokTopVideos: TikTokVideo[];
  updatedAt: number;
}

const STATS_DOC = doc(db, 'mediaKit', 'socialStats');

const EMPTY_STATS: SocialStats = {
  youtube: {},
  instagram: {},
  tiktok: {},
  tiktokTopVideos: [],
  updatedAt: 0,
};

export { EMPTY_STATS };

function parseVideo(v: unknown): TikTokVideo | null {
  if (typeof v === 'string') return { url: v };
  if (
    v &&
    typeof v === 'object' &&
    'url' in v &&
    typeof (v as { url: unknown }).url === 'string'
  ) {
    const o = v as { url: string; views?: number; likes?: number };
    return { url: o.url, views: o.views, likes: o.likes };
  }
  return null;
}

function parseStats(data: Record<string, unknown> | undefined): SocialStats {
  if (!data) return EMPTY_STATS;
  const y = data.youtube as Record<string, number> | undefined;
  const ig = data.instagram as Record<string, number> | undefined;
  const tt = data.tiktok as Record<string, number> | undefined;
  const videosRaw = data.tiktokTopVideos;
  const videos = Array.isArray(videosRaw)
    ? videosRaw
        .map(parseVideo)
        .filter((v): v is TikTokVideo => v != null)
        .slice(0, 3)
    : [];
  const subscribers = (v: Record<string, number> | undefined) =>
    v?.subscribers ?? v?.followers ?? 0;
  return {
    youtube: y ? { subscribers: subscribers(y) } : {},
    instagram: ig ? { subscribers: subscribers(ig) } : {},
    tiktok: tt ? { subscribers: subscribers(tt) } : {},
    tiktokTopVideos: videos,
    updatedAt: typeof data.updatedAt === 'number' ? data.updatedAt : 0,
  };
}

export function getSocialStats(): Promise<SocialStats> {
  return getDoc(STATS_DOC).then((snap) =>
    parseStats(snap.exists() ? snap.data() : undefined),
  );
}

export function subscribeToSocialStats(
  callback: (stats: SocialStats) => void,
): () => void {
  return onSnapshot(STATS_DOC, (snap) => {
    callback(parseStats(snap.exists() ? snap.data() : undefined));
  });
}

/** Remove undefined values (Firestore rejects them) */
function stripUndefined<T extends Record<string, unknown>>(
  obj: T,
): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(obj)) {
    if (v === undefined) continue;
    if (
      v != null &&
      typeof v === 'object' &&
      !Array.isArray(v) &&
      !(v instanceof Date)
    ) {
      out[k] = stripUndefined(v as Record<string, unknown>);
    } else if (Array.isArray(v)) {
      out[k] = v.map((item) => {
        if (item != null && typeof item === 'object' && !Array.isArray(item))
          return stripUndefined(item as Record<string, unknown>);
        return item;
      });
    } else {
      out[k] = v;
    }
  }
  return out;
}

/** Admin: update socialStats directly (no Cloud Functions) */
export async function updateSocialStats(
  partial: Partial<SocialStats>,
): Promise<void> {
  const snap = await getDoc(STATS_DOC);
  const current = snap.exists() ? snap.data() : {};
  const merged = {
    ...current,
    ...partial,
    updatedAt: Date.now(),
  } as Record<string, unknown>;
  await setDoc(STATS_DOC, stripUndefined(merged));
}

/** Format number for display: 580000 -> "580K+", 8.2 -> "8.2%" */
export function formatStat(
  value: number,
  suffix: string,
  decimals = 0,
): string {
  if (suffix === '%') return `${value.toFixed(decimals)}%`;
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M+`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(0)}K+`;
  return `${value}${suffix}`;
}
