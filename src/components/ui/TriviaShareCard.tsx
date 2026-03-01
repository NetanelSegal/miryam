import { useEffect, useState, forwardRef } from 'react'
import QRCode from 'qrcode'

export interface TriviaShareCardProps {
  score: number
  totalQuestions: number
  participantName: string
  triviaUrl: string
  /** Fixed size for consistent capture. Default 600. */
  size?: number
}

/** System font stack for html2canvas — avoids external font loading/CORS in capture. */
const SHARE_CARD_FONT = "'Arial', 'Helvetica Neue', 'Helvetica', sans-serif"

/**
 * Branded square share card for Trivia results.
 * Rendered for html2canvas capture. Uses system fonts to avoid font-load warnings.
 */
export const TriviaShareCard = forwardRef<HTMLDivElement, TriviaShareCardProps>(function TriviaShareCard(
  { score, totalQuestions, participantName, triviaUrl, size = 600 },
  ref
) {
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null)

  useEffect(() => {
    QRCode.toDataURL(triviaUrl, { width: 140, margin: 1 })
      .then(setQrDataUrl)
      .catch(() => setQrDataUrl(null))
  }, [triviaUrl])

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
      <div className="text-text-secondary text-sm mb-1" style={{ fontFamily: SHARE_CARD_FONT }}>
        {participantName},
      </div>
      <div
        className="font-bold leading-none mb-2"
        style={{
          fontFamily: SHARE_CARD_FONT,
          fontSize: size * 0.12,
          background: 'linear-gradient(to left, var(--color-accent-violet), var(--color-accent-indigo))',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}
      >
        {score}/{totalQuestions}
      </div>
      <div
        className="text-text-secondary text-base mb-6"
        style={{ fontFamily: SHARE_CARD_FONT }}
      >
        נסו את הטריוויה
      </div>
      {qrDataUrl && (
        <div className="p-3 bg-white">
          <img src={qrDataUrl} alt="" width={140} height={140} />
        </div>
      )}
    </div>
  )
})
