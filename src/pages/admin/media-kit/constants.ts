const TIKTOK_URL_REGEX = /^https?:\/\/(www\.)?(tiktok\.com|vm\.tiktok\.com)\/.+$/

export function isValidTiktokUrl(url: string): boolean {
  if (!url.trim()) return true
  return TIKTOK_URL_REGEX.test(url.trim())
}
