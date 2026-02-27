import { BarChart3 } from 'lucide-react'
import { Heading, LoadingState, useToast } from '@/components/ui'
import { useSocialStats } from './useSocialStats'
import { useSeedBrandsAndCaseStudies } from './useSeedBrandsAndCaseStudies'
import { StatsLastUpdated } from './StatsLastUpdated'
import { SeedCollectionsCard } from './SeedCollectionsCard'
import { YouTubeStatsCard } from './YouTubeStatsCard'
import { InstagramStatsCard } from './InstagramStatsCard'
import { TiktokStatsCard } from './TiktokStatsCard'
import { TiktokTopVideosCard } from './TiktokTopVideosCard'

export function AdminMediaKitStats() {
  const { toast } = useToast()
  const { stats, setStats, handleSave, saving } = useSocialStats(toast)
  const { handleSeed, seeding } = useSeedBrandsAndCaseStudies(toast)

  if (stats === null) return <LoadingState />

  return (
    <>
      <Heading level={4} className="text-white mb-6">
        <BarChart3 className="w-5 h-5 inline-block ml-2 align-middle" />
        Media Kit — נתוני רשתות
      </Heading>

      <StatsLastUpdated updatedAt={stats.updatedAt} />
      <SeedCollectionsCard onSeed={handleSeed} seeding={seeding} />

      <div className="space-y-4">
        <YouTubeStatsCard stats={stats} setStats={setStats} onSave={handleSave} saving={saving} />
        <InstagramStatsCard
          stats={stats}
          setStats={setStats}
          onSave={handleSave}
          saving={saving}
        />
        <TiktokStatsCard stats={stats} setStats={setStats} onSave={handleSave} saving={saving} />
        <TiktokTopVideosCard
          stats={stats}
          setStats={setStats}
          onSave={handleSave}
          onError={(msg) => toast('error', msg)}
          saving={saving}
        />
      </div>
    </>
  )
}
