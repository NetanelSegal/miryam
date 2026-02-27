import { type ReactNode, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'

interface ModalProps {
  open: boolean
  onClose: () => void
  title?: string
  size?: 'sm' | 'md' | 'lg'
  children: ReactNode
}

const sizeMap = {
  sm: 'max-w-sm',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
}

export function Modal({ open, onClose, title, size = 'md', children }: ModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handler)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  if (!open) return null

  const modalContent = (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto"
      onClick={(e) => { if (e.target === overlayRef.current) onClose() }}
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div className={`w-full ${sizeMap[size]} bg-bg-end border border-white/10 rounded-none p-6 relative animate-fade-in-up my-auto max-h-[min(90vh,600px)] overflow-y-auto shrink-0`}>
        {title && (
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-heading text-xl font-semibold text-white">{title}</h2>
            <button onClick={onClose} className="text-text-muted hover:text-white transition-colors" aria-label="סגירה">
              <X className="w-5 h-5" />
            </button>
          </div>
        )}
        {!title && (
          <button onClick={onClose} className="absolute top-4 left-4 text-text-muted hover:text-white transition-colors" aria-label="סגירה">
            <X className="w-5 h-5" />
          </button>
        )}
        {children}
      </div>
    </div>
  )

  return createPortal(modalContent, document.body)
}
