import { useEffect, useState, forwardRef } from 'react'
import QRCode from 'qrcode'
import type { Blessing } from '@/lib/store'

export interface BlessingShareCardProps {
  blessing: Blessing
  blessingsUrl: string
  /** Fixed size for consistent capture. Default 600. */
  size?: number
}

/** System font stack for html2canvas — avoids external font loading/CORS in capture. */
const SHARE_CARD_FONT = "'Arial', 'Helvetica Neue', 'Helvetica', sans-serif"

/**
 * Branded square share card for Blessing results.
 * Rendered for html2canvas capture. Uses system fonts to avoid font-load warnings.
 */
export const BlessingShareCard = forwardRef<HTMLDivElement, BlessingShareCardProps>(function BlessingShareCard(
  { blessing, blessingsUrl, size = 600 },
  ref
) {
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null)

  useEffect(() => {
    QRCode.toDataURL(blessingsUrl, { width: 140, margin: 1 })
      .then(setQrDataUrl)
      .catch(() => setQrDataUrl(null))
  }, [blessingsUrl])

  const messagePreview = blessing.message.length > 80 ? `${blessing.message.slice(0, 80)}...` : blessing.message

  return (
    <div
      ref={ref}
      className="bg-bg border-t-[3px] border-t-violet-500 flex flex-col items-center justify-center p-10 text-center"
      style={{
        width: size,
        height: size,
        fontFamily: SHARE_CARD_FONT,
      }}
    >
      <div className="text-text-secondary text-sm mb-2" style={{ fontFamily: SHARE_CARD_FONT }}>
        השארתי ברכה למרים 🎉
      </div>
      <div
        className="font-bold leading-none mb-3"
        style={{
          fontFamily: SHARE_CARD_FONT,
          fontSize: size * 0.06,
          background: 'linear-gradient(to left, var(--color-accent-violet), var(--color-accent-indigo))',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}
      >
        — {blessing.name}
      </div>
      <div
        className="text-text-secondary text-base mb-6 leading-relaxed max-w-full overflow-hidden"
        style={{
          fontFamily: SHARE_CARD_FONT,
          fontSize: size * 0.035,
          lineHeight: 1.6,
        }}
      >
        "{messagePreview}"
      </div>
      <div
        className="text-text-muted text-sm mb-4"
        style={{ fontFamily: SHARE_CARD_FONT }}
      >
        כתבו גם אתם ברכה
      </div>
      {qrDataUrl && (
        <div className="p-3 bg-white">
          <img src={qrDataUrl} alt="" width={140} height={140} />
        </div>
      )}
    </div>
  )
})
