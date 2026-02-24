import { useState, useCallback, useRef, useEffect } from 'react'
import html2canvas from 'html2canvas'
import { Share2, Copy, Download } from 'lucide-react'
import { Button, Modal, TriviaShareCard } from '@/components/ui'

export interface TriviaShareModalProps {
  open: boolean
  onClose: () => void
  score: number
  totalQuestions: number
  participantName: string
  triviaUrl: string
}

/**
 * Modal for sharing Trivia results via native share, download, or copy link.
 * Encapsulates html2canvas, Web Share API, download, and copy-link logic.
 */
export function TriviaShareModal({
  open,
  onClose,
  score,
  totalQuestions,
  participantName,
  triviaUrl,
}: TriviaShareModalProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [copied, setCopied] = useState(false)
  const copiedTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    return () => {
      if (copiedTimeoutRef.current) clearTimeout(copiedTimeoutRef.current)
    }
  }, [])

  const captureCard = useCallback(async (): Promise<Blob | null> => {
    if (!cardRef.current) return null
    try {
      const canvas = await html2canvas(cardRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#0a0a0a',
        logging: false,
      })
      return new Promise<Blob | null>((resolve) => {
        canvas.toBlob((blob) => resolve(blob), 'image/png')
      })
    } catch {
      return null
    }
  }, [])

  const handleNativeShare = useCallback(async () => {
    const blob = await captureCard()
    if (!blob) return
    if (navigator.share) {
      try {
        await navigator.share({
          files: [new File([blob], 'trivia-miryam.png', { type: 'image/png' })],
          title: 'הטריוויה של מרים',
          text: `קיבלתי ${score}/${totalQuestions}! נסו גם: ${triviaUrl}`,
        })
        onClose()
      } catch (err) {
        if ((err as Error).name !== 'AbortError') throw err
      }
    }
  }, [captureCard, score, totalQuestions, triviaUrl, onClose])

  const handleDownload = useCallback(async () => {
    const blob = await captureCard()
    if (!blob) return
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `trivia-miryam-${score}-${totalQuestions}.png`
    a.click()
    URL.revokeObjectURL(a.href)
  }, [captureCard, score, totalQuestions])

  const handleCopyLink = useCallback(async () => {
    const text = `קיבלתי ${score}/${totalQuestions} בטריוויה של מרים! 🎉 נסו גם: ${triviaUrl}`
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      if (copiedTimeoutRef.current) clearTimeout(copiedTimeoutRef.current)
      copiedTimeoutRef.current = setTimeout(() => setCopied(false), 2000)
    } catch {
      /* silent */
    }
  }, [score, totalQuestions, triviaUrl])

  return (
    <Modal open={open} onClose={onClose} title="שתפו את התוצאה" size="lg">
      <div className="flex flex-col items-center gap-6">
        <div className="overflow-auto max-w-full flex justify-center">
          <TriviaShareCard
            ref={cardRef}
            score={score}
            totalQuestions={totalQuestions}
            participantName={participantName}
            triviaUrl={triviaUrl}
            size={600}
          />
        </div>
        <div className="flex flex-wrap gap-2 justify-center w-full">
          {'share' in navigator && typeof navigator.share === 'function' && (
            <Button variant="primary" size="sm" icon={<Share2 className="w-4 h-4" />} onClick={handleNativeShare}>
              שתפו
            </Button>
          )}
          <Button variant="secondary" size="sm" icon={<Download className="w-4 h-4" />} onClick={handleDownload}>
            הורדת תמונה
          </Button>
          <Button variant="ghost" size="sm" icon={<Copy className="w-4 h-4" />} onClick={handleCopyLink}>
            {copied ? 'הועתק!' : 'העתק קישור'}
          </Button>
        </div>
      </div>
    </Modal>
  )
}
