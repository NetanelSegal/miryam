import { useState, useRef, useEffect } from 'react'
import { StatCard } from '@/components/ui'
import { StaggerChildren } from '@/components/motion'
import { useCountUp } from '@/hooks'
import { useInView } from 'motion/react'
import { subscribeToSocialStats, EMPTY_STATS, type SocialStats } from '@/lib/social-stats-store'
import { buildDisplayStats } from './constants'

function StatItem({
  stat,
  enabled,
}: {
  stat: { value: number; suffix: string; label: string; decimals?: number }
  enabled: boolean
}) {
  const count = useCountUp({
    end: stat.value,
    duration: 2000,
    decimals: stat.decimals ?? 0,
    enabled,
  })

  return <StatCard value={`${count}${stat.suffix}`} label={stat.label} />
}

export function StatSection() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })
  const [stats, setStats] = useState<SocialStats>(EMPTY_STATS)

  useEffect(() => {
    return subscribeToSocialStats(setStats)
  }, [])

  const displayStats = buildDisplayStats(stats)

  return (
    <div ref={ref}>
      <StaggerChildren staggerDelay={0.12} className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {displayStats.map((stat) => (
          <StatItem key={stat.label} stat={stat} enabled={isInView} />
        ))}
      </StaggerChildren>
    </div>
  )
}
