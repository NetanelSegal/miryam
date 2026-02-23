interface StatCardProps {
  value: string
  label: string
  gradient?: boolean
  className?: string
}

export function StatCard({ value, label, gradient = true, className = '' }: StatCardProps) {
  return (
    <div className={`card-top p-5 rounded-none bg-white/[0.04] ${className}`}>
      <p className={`font-heading text-3xl font-bold ${gradient ? 'gradient-text' : 'text-white'}`}>
        {value}
      </p>
      <p className="text-text-secondary text-xs mt-1">{label}</p>
    </div>
  )
}
