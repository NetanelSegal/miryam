import { motion } from 'motion/react'

type VoteBarSize = 'sm' | 'md' | 'lg'

interface VoteBarProps {
  votes: number
  maxVotes: number
  label?: string
  size?: VoteBarSize
}

const heightMap: Record<VoteBarSize, string> = {
  sm: 'h-7 md:h-8',
  md: 'h-10',
  lg: 'h-12 md:h-14',
}

const textMap: Record<VoteBarSize, string> = {
  sm: 'text-xs md:text-sm',
  md: 'text-sm',
  lg: 'text-lg',
}

export function VoteBar({ votes, maxVotes, label, size = 'md' }: VoteBarProps) {
  const pct = maxVotes > 0 ? (votes / maxVotes) * 100 : 0
  const displayLabel = label ?? `${votes} הצבעות`

  return (
    <div className={`relative ${heightMap[size]} bg-white/5 overflow-hidden`}>
      <motion.div
        className="absolute inset-y-0 right-0 bg-gradient-brand"
        initial={{ width: 0 }}
        animate={{ width: `${pct}%` }}
        transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1], delay: 0.2 }}
      />
      <span className={`absolute inset-0 flex items-center px-3 ${textMap[size]} font-bold text-white z-10`}>
        {displayLabel}
      </span>
    </div>
  )
}
