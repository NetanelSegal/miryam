import { Text } from './Text'
import { getRankColor } from '@/lib/utils'

interface LeaderboardRowProps {
  rank: number
  name: string
  score: string
  detail?: string
  highlight?: boolean
}

export function LeaderboardRow({ rank, name, score, detail, highlight = false }: LeaderboardRowProps) {
  return (
    <div className={`flex items-center gap-4 p-4 border ${
      highlight ? 'border-amber-500/30 bg-amber-500/5' : 'border-white/5 bg-white/[0.02]'
    }`}>
      <span className={`text-xl font-bold w-8 text-center ${getRankColor(rank - 1)}`}>
        {rank}
      </span>
      <Text className="flex-1 font-semibold">{name}</Text>
      <Text className="font-bold gradient-text">{score}</Text>
      {detail && <Text variant="muted" size="xs">{detail}</Text>}
    </div>
  )
}
