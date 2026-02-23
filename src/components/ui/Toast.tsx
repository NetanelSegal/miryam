import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react'

type ToastType = 'success' | 'error' | 'info'

interface ToastItem {
  id: number
  type: ToastType
  message: string
}

interface ToastContextValue {
  toast: (type: ToastType, message: string, duration?: number) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}

const icons: Record<ToastType, typeof CheckCircle> = {
  success: CheckCircle,
  error: AlertCircle,
  info: Info,
}

const colors: Record<ToastType, string> = {
  success: 'border-emerald-500/40 bg-emerald-500/10',
  error: 'border-red-500/40 bg-red-500/10',
  info: 'border-accent-indigo/40 bg-accent-indigo/10',
}

let nextId = 0

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([])

  const toast = useCallback((type: ToastType, message: string, duration = 4000) => {
    const id = nextId++
    setToasts((prev) => [...prev, { id, type, message }])
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), duration)
  }, [])

  const dismiss = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-6 left-6 right-6 md:left-auto md:right-6 md:w-96 z-[200] flex flex-col gap-2">
        {toasts.map((t) => {
          const Icon = icons[t.type]
          return (
            <div
              key={t.id}
              className={`flex items-center gap-3 px-4 py-3 border rounded-none backdrop-blur-md animate-fade-in-up ${colors[t.type]}`}
            >
              <Icon className="w-5 h-5 shrink-0" />
              <span className="text-sm text-white flex-1">{t.message}</span>
              <button onClick={() => dismiss(t.id)} className="text-text-muted hover:text-white shrink-0">
                <X className="w-4 h-4" />
              </button>
            </div>
          )
        })}
      </div>
    </ToastContext.Provider>
  )
}
