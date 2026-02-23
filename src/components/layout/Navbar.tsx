import { useState } from 'react'
import { Link, useLocation } from 'react-router'
import { Menu, X, ArrowRight } from 'lucide-react'
import { getNavRoutes } from '@/config/routes'
import { ShareButton } from '@/components/ui'
import { LINKS } from '@/config/links'

function SocialIcons() {
  const iconClass = 'w-5 h-5 text-text-secondary hover:text-white transition-colors'
  return (
    <div className="flex items-center gap-3">
      <a href={LINKS.tiktok} target="_blank" rel="noopener noreferrer" aria-label="TikTok">
        <svg className={iconClass} viewBox="0 0 24 24" fill="currentColor">
          <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
        </svg>
      </a>
      <a href={LINKS.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram">
        <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
        </svg>
      </a>
      <a href={LINKS.youtube} target="_blank" rel="noopener noreferrer" aria-label="YouTube">
        <svg className={iconClass} viewBox="0 0 24 24" fill="currentColor">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
        </svg>
      </a>
    </div>
  )
}

interface NavbarProps {
  showBackHome?: boolean
}

export function Navbar({ showBackHome }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false)
  const location = useLocation()
  const navRoutes = getNavRoutes()

  return (
    <header className="fixed top-0 right-0 left-0 z-50">
      <nav className="flex items-center justify-between px-4 md:px-8 py-4 bg-bg/80 backdrop-blur-md border-b border-white/5">
        {showBackHome ? (
          <Link
            to="/"
            className="flex items-center gap-2 text-sm text-text-secondary hover:text-white transition-colors"
          >
            <ArrowRight className="w-4 h-4" />
            <span>חזור הביתה</span>
          </Link>
        ) : (
          <Link to="/" className="font-heading text-lg font-bold gradient-text">
            מרים סגל
          </Link>
        )}

        <div className="flex items-center gap-4">
          <SocialIcons />
          <div className="flex items-center gap-1">
            <ShareButton />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-text-secondary hover:text-white transition-colors"
              aria-label={isOpen ? 'סגירת תפריט' : 'פתיחת תפריט'}
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </nav>

      {isOpen && (
        <div className="fixed inset-0 top-[65px] bg-bg/95 backdrop-blur-lg z-40">
          <div className="flex flex-col items-center justify-center gap-8 pt-20">
            {navRoutes.map((route) => (
              <Link
                key={route.path}
                to={route.path}
                onClick={() => setIsOpen(false)}
                className={`font-heading text-2xl font-semibold transition-colors ${
                  location.pathname === route.path
                    ? 'gradient-text'
                    : 'text-text-secondary hover:text-white'
                }`}
              >
                {route.navLabel}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  )
}
