import { useState, useEffect } from 'react'
import { Heading, Text, Container, Card, TiktokEmbed } from '@/components/ui'
import { AnimateOnScroll, StaggerChildren } from '@/components/motion'
import { subscribeToSocialStats, EMPTY_STATS, type SocialStats } from '@/lib/social-stats-store'
import { LINKS } from '@/config/links'

export function TiktokTopVideosSection() {
  const [stats, setStats] = useState<SocialStats>(EMPTY_STATS)

  useEffect(() => {
    return subscribeToSocialStats(setStats)
  }, [])

  const videos = stats.tiktokTopVideos ?? []
  if (videos.length === 0) return null

  const formatMetric = (n: number) =>
    n >= 1_000_000 ? `${(n / 1_000_000).toFixed(1)}M` : n >= 1_000 ? `${(n / 1_000).toFixed(1)}K` : String(n)

  return (
    <section className="py-20 md:py-28 border-t border-white/5">
      <Container size="lg">
        <AnimateOnScroll variant="fade-up">
          <Text variant="label" className="text-center mb-3">TikTok</Text>
          <Heading level={2} gradient className="text-center mb-12">
            הסרטונים הפופולריים שלי
          </Heading>
        </AnimateOnScroll>
        <StaggerChildren staggerDelay={0.15} className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {videos.map((v, i) => {
            const url = typeof v === 'string' ? v : v.url
            const views = typeof v === 'object' ? v.views : undefined
            const likes = typeof v === 'object' ? v.likes : undefined
            const metric =
              views != null && likes != null
                ? `${formatMetric(views)} צפיות · ${formatMetric(likes)} לייקים`
                : views != null
                  ? `${formatMetric(views)} צפיות`
                  : likes != null
                    ? `${formatMetric(likes)} לייקים`
                    : `סרטון ${i + 1}`
            return (
              <Card key={url} variant="accent" className="overflow-hidden">
                <TiktokEmbed url={url} metric={metric} className="rounded-t-lg" />
              </Card>
            )
          })}
        </StaggerChildren>
        <div className="flex justify-center mt-8">
          <a
            href={LINKS.tiktok}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 font-medium rounded-none transition-all border-2 border-border-neutral text-white hover:border-accent-indigo px-6 py-3"
          >
            לעמוד הטיקטוק שלי
          </a>
        </div>
      </Container>
    </section>
  )
}
