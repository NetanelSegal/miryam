import { useState, useEffect } from 'react'
import { useLocation } from 'react-router'
import { Share2, Copy, MessageCircle, Download } from 'lucide-react'
import QRCode from 'qrcode'
import { Modal } from './Modal'
import { Button } from './Button'
import { Text } from './Text'

export function ShareButton() {
  const [open, setOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null)
  const [qrSvg, setQrSvg] = useState<string | null>(null)
  const location = useLocation()

  const url = typeof window !== 'undefined' ? `${window.location.origin}${location.pathname}` : ''
  const title = 'מרים סגל'

  useEffect(() => {
    if (open && url) {
      Promise.all([
        QRCode.toDataURL(url, { width: 256, margin: 2 }),
        QRCode.toString(url, { margin: 2 }),
      ])
        .then(([dataUrl, svg]) => {
          setQrDataUrl(dataUrl)
          setQrSvg(svg)
        })
        .catch(() => {
          setQrDataUrl(null)
          setQrSvg(null)
        })
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

  const handleDownload = (format: 'png' | 'svg') => {
    if (format === 'png' && qrDataUrl) {
      const a = document.createElement('a')
      a.href = qrDataUrl
      a.download = `qrcode-miryam-${location.pathname.replace(/\//g, '-') || 'home'}.png`
      a.click()
    } else if (format === 'svg' && qrSvg) {
      const blob = new Blob([qrSvg], { type: 'image/svg+xml' })
      const a = document.createElement('a')
      a.href = URL.createObjectURL(blob)
      a.download = `qrcode-miryam-${location.pathname.replace(/\//g, '-') || 'home'}.svg`
      a.click()
      setTimeout(() => URL.revokeObjectURL(a.href), 100)
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
      <Modal open={open} onClose={() => setOpen(false)} title="שתפו את העמוד" size="md">
        <div className="flex flex-col items-center gap-6">
          <div className="flex gap-2 w-full">
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

          {qrDataUrl && qrSvg && (
            <div className="flex flex-col items-center gap-3 w-full py-4 border-y border-white/10">
              <Text variant="muted" size="sm">סרקו לשיתוף</Text>
              <div className="flex justify-center items-center min-h-[200px] bg-white p-4 rounded">
                <img src={qrDataUrl} alt="QR Code" className="w-48 h-48" />
              </div>
              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  icon={<Download className="w-4 h-4" />}
                  onClick={() => handleDownload('png')}
                >
                  הורד PNG
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  icon={<Download className="w-4 h-4" />}
                  onClick={() => handleDownload('svg')}
                >
                  הורד SVG
                </Button>
              </div>
            </div>
          )}
        </div>
      </Modal>
    </>
  )
}
