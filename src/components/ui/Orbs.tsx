interface OrbsProps {
  variant?: 'general' | 'party'
}

export function Orbs({ variant = 'general' }: OrbsProps) {
  const opacity = variant === 'party' ? 0.18 : 0.12

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10" aria-hidden="true">
      <div
        className="absolute -top-20 -right-20 w-80 h-80 rounded-full blur-[80px]"
        style={{ background: `rgba(99, 102, 241, ${opacity})` }}
      />
      <div
        className="absolute bottom-1/4 -left-16 w-64 h-64 rounded-full blur-[80px]"
        style={{ background: `rgba(168, 85, 247, ${opacity - 0.02})` }}
      />
      {variant === 'party' && (
        <div
          className="absolute top-1/3 right-1/4 w-48 h-48 rounded-full blur-[60px]"
          style={{ background: 'rgba(168, 85, 247, 0.1)' }}
        />
      )}
    </div>
  )
}
