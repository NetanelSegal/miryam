import { useState, useEffect } from 'react'
import { useLocation } from 'react-router'
import { Share2, Copy, MessageCircle, QrCode } from 'lucide-react'
import QRCode from 'qrcode'
import { Modal } from './Modal'
import { Button } from './Button'
import { Text } from './Text'

export function ShareButton() {
  const [open, setOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null)
  const location = useLocation()

  const url = typeof window !== 'undefined' ? `${window.location.origin}${location.pathname}` : ''
  const title = 'מרים סגל'

  useEffect(() => {
    if (open && url) {
      QRCode.toDataURL(url, { width: 200, margin: 2 })
        .then(setQrDataUrl)
        .catch(() => setQrDataUrl(null))
    }
  }, [open, url])

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      /* silent */
    }
  }

  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(`${title} - ${url}`)}`

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="p-2 text-text-secondary hover:text-white transition-colors"
        aria-label="שתפו את העמוד"
      >
        <Share2 className="w-5 h-5" />
      </button>
      <Modal open={open} onClose={() => setOpen(false)} title="שתפו את העמוד" size="sm">
        <div className="space-y-4">
          <div className="flex gap-2">
            <Button
              variant="primary"
              size="sm"
              icon={<Copy className="w-4 h-4" />}
              onClick={handleCopy}
              className="flex-1"
            >
              {copied ? 'הועתק!' : 'העתק קישור'}
            </Button>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 font-medium rounded-none transition-all duration-[180ms] ease-out text-sm px-4 py-2 border-2 border-border-neutral text-white hover:border-accent-indigo flex-1"
            >
              <MessageCircle className="w-4 h-4" />
              WhatsApp
            </a>
          </div>
          {qrDataUrl && (
            <div className="flex flex-col items-center gap-2 pt-4 border-t border-white/10">
              <QrCode className="w-5 h-5 text-text-muted" />
              <Text variant="muted" size="sm">
                סרקו לשיתוף
              </Text>
              <img src={qrDataUrl} alt="QR Code" className="w-40 h-40 bg-white p-2" />
            </div>
          )}
        </div>
      </Modal>
    </>
  )
}
