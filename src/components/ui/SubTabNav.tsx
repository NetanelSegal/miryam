import type { LucideIcon } from 'lucide-react'

export interface SubTabNavTab {
  id: string
  label: string
  icon?: LucideIcon
}

interface SubTabNavProps {
  tabs: SubTabNavTab[]
  activeId: string
  onChange: (id: string) => void
}

/**
 * Sub-tab navigation with optional icons. Use in admin panels (AdminMediaKit, AdminTrivia).
 */
export function SubTabNav({ tabs, activeId, onChange }: SubTabNavProps) {
  return (
    <div className="flex gap-2 mb-6">
      {tabs.map((t) => (
        <button
          key={t.id}
          type="button"
          onClick={() => onChange(t.id)}
          className={`flex items-center gap-2 px-3 py-1.5 text-sm font-medium transition-all ${
            activeId === t.id
              ? 'bg-white/10 text-white border border-white/20'
              : 'text-text-muted hover:text-white border border-transparent'
          }`}
        >
          {t.icon && <t.icon className="w-3.5 h-3.5" />}
          {t.label}
        </button>
      ))}
    </div>
  )
}
