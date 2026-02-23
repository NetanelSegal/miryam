import { useEffect, useState } from 'react'

/** Extract video ID from tiktok.com/@user/video/ID */
function extractVideoId(url: string): string | null {
  const match = url.match(/(?:www\.|m\.)?tiktok\.com\/[^/]+\/video\/(\d+)/)
  return match?.[1] ?? null
}

interface TiktokEmbedProps {
  url: string
  metric?: string
  className?: string
}

/**
 * Uses TikTok iframe player (player/v1) with rel=0 to show creator's videos
 * instead of random suggestions after playback.
 * Spacing: iframe fills container width.
 */
export function TiktokEmbed({ url, metric, className = '' }: TiktokEmbedProps) {
  const [videoId, setVideoId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    const id = extractVideoId(url)

    if (id) {
      setVideoId(id)
      setLoading(false)
      return
    }

    fetch(`https://www.tiktok.com/oembed?url=${encodeURIComponent(url)}`)
      .then((res) => res.json())
      .then((data: { html?: string }) => {
        const match = data.html?.match(/data-video-id="(\d+)"/)
        if (match?.[1]) {
          setVideoId(match[1])
        } else {
          setError(true)
        }
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [url])

  if (error) {
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className={`block aspect-[9/16] bg-white/5 relative overflow-hidden hover:bg-white/10 transition-colors ${className}`}
      >
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-4">
          <span className="text-4xl opacity-50">▶</span>
          <span className="text-sm text-center">לצפייה בטיקטוק</span>
          {metric && (
            <span className="absolute bottom-3 right-3 bg-accent-indigo/80 px-3 py-1 text-xs font-medium text-white">
              {metric}
            </span>
          )}
        </div>
      </a>
    )
  }

  if (loading) {
    return (
      <div className={`aspect-[9/16] bg-white/5 animate-pulse flex items-center justify-center ${className}`}>
        <span className="text-text-muted">טוען...</span>
      </div>
    )
  }

  if (!videoId) return null

  const iframeUrl = `https://www.tiktok.com/player/v1/${videoId}?rel=0`
  return (
    <div className={`relative w-full overflow-hidden ${className}`}>
      <div className="relative w-full" style={{ paddingBottom: '177.78%' }}>
        <iframe
          src={iframeUrl}
          title="TikTok video"
          className="absolute inset-0 w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
      {metric && (
        <span className="absolute bottom-2 right-2 z-10 bg-accent-indigo/90 px-2 py-0.5 text-xs font-medium text-white pointer-events-none rounded">
          {metric}
        </span>
      )}
    </div>
  )
}
