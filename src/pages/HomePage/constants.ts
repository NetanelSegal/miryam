import type { Brand } from '@/lib/brands-store'
import type { SocialStats } from '@/lib/social-stats-store'

export const BIRTHDAY = new Date('2026-03-05T00:00:00')

export const FALLBACK_BRANDS: Brand[] = ["L'Oréal", 'MAC', 'Samsung', 'Fox', 'Castro', 'Adidas', 'Zara', 'H&M'].map(
  (name, i) => ({ id: `fallback-${i}`, name, order: i }),
)

export function buildDisplayStats(stats: SocialStats) {
  const ig = stats.instagram?.subscribers ?? 0
  const tt = stats.tiktok?.subscribers ?? 0
  const yt = stats.youtube?.subscribers ?? 0
  return [
    { value: ig >= 1000 ? ig / 1000 : ig, suffix: ig >= 1000 ? 'K+' : '', label: 'עוקבים באינסטגרם' },
    { value: tt >= 1000 ? tt / 1000 : tt, suffix: tt >= 1000 ? 'K+' : '', label: 'עוקבים בטיקטוק' },
    { value: yt >= 1000 ? yt / 1000 : yt, suffix: yt >= 1000 ? 'K+' : '', label: 'מנויים ביוטיוב' },
  ]
}
