import { useState } from 'react'
import { Link, useLocation } from 'react-router'
import { Menu, X, ArrowRight } from 'lucide-react'
import { getNavRoutes } from '@/config/routes'
import { ShareButton } from '@/components/ui'

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
