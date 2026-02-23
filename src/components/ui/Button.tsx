import { type ReactNode, type ButtonHTMLAttributes } from 'react'
import { Link } from 'react-router'
import { Loader2 } from 'lucide-react'

type ButtonVariant = 'cta' | 'primary' | 'secondary' | 'ghost'
type ButtonSize = 'sm' | 'md' | 'lg'

interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className'> {
  variant?: ButtonVariant
  size?: ButtonSize
  loading?: boolean
  icon?: ReactNode
  href?: string
  children: ReactNode
  className?: string
}

const sizeMap: Record<ButtonSize, string> = {
  sm: 'text-sm px-4 py-2',
  md: 'text-base px-6 py-3',
  lg: 'text-lg px-8 py-4',
}

export function Button({
  variant = 'primary',
  size = 'md',
  loading,
  icon,
  href,
  children,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  if (variant === 'cta') {
    const inner = (
      <>
        {icon && <span className="inline-flex">{icon}</span>}
        {children}
      </>
    )
    if (href) {
      return (
        <Link to={href} className={`btn-cta text-white ${sizeMap[size].split(' ')[0]} ${className}`}>
          {inner}
        </Link>
      )
    }
    return (
      <button className={`btn-cta text-white ${sizeMap[size].split(' ')[0]} ${className}`} disabled={disabled || loading} {...props}>
        {inner}
      </button>
    )
  }

  const variantClasses: Record<string, string> = {
    primary: 'bg-gradient-to-l from-accent-violet to-accent-indigo text-white hover:opacity-90',
    secondary: 'border-2 border-border-neutral text-white hover:border-accent-indigo',
    ghost: 'text-text-secondary hover:text-white hover:bg-white/5',
  }

  const base = `inline-flex items-center justify-center gap-2 font-medium rounded-none transition-all duration-[180ms] ease-out disabled:opacity-50 disabled:pointer-events-none ${sizeMap[size]} ${variantClasses[variant]} ${className}`

  if (href) {
    return (
      <Link to={href} className={base}>
        {icon && <span className="inline-flex">{icon}</span>}
        {children}
      </Link>
    )
  }

  return (
    <button className={base} disabled={disabled || loading} {...props}>
      {loading && <Loader2 className="w-4 h-4 animate-spin" />}
      {icon && !loading && <span className="inline-flex">{icon}</span>}
      {children}
    </button>
  )
}
