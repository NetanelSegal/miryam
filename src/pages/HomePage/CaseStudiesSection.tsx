import { useState, useEffect } from 'react'
import { Heading, Text, Card } from '@/components/ui'
import { StaggerChildren } from '@/components/motion'
import { subscribeToCaseStudies, getCaseStudyImageSrc, type CaseStudy } from '@/lib/case-studies-store'

export function CaseStudiesSection() {
  const [caseStudies, setCaseStudies] = useState<CaseStudy[]>([])

  useEffect(() => {
    return subscribeToCaseStudies(
      (data) => setCaseStudies(data),
      () => setCaseStudies([]),
    )
  }, [])

  if (caseStudies.length === 0) {
    return (
      <div className="py-12 text-center">
        <Text variant="muted">אין קמפיינים להצגה. השתמשו בלוח הניהול כדי ליצור נתונים ראשוניים.</Text>
      </div>
    )
  }

  return (
    <StaggerChildren staggerDelay={0.15} className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {caseStudies.map((study) => (
        <Card key={study.id} variant="accent" className="overflow-hidden">
          <div className="aspect-4/3 overflow-hidden relative bg-white/5">
            {study.imageUrl ? (
              <>
                <img
                  key={study.imageUrl}
                  src={getCaseStudyImageSrc(study.imageUrl)}
                  alt={study.brand}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                  loading="eager"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none'
                    const fallback = e.currentTarget.nextElementSibling
                    if (fallback) (fallback as HTMLElement).classList.remove('hidden')
                  }}
                />
                <div className="hidden w-full h-full flex items-center justify-center text-text-muted text-sm absolute inset-0 bg-white/5" aria-hidden>אין תמונה</div>
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-text-muted text-sm" aria-hidden>אין תמונה</div>
            )}
            <div className="img-overlay" />
            <span className="absolute bottom-3 right-3 z-10 bg-accent-indigo/80 px-3 py-1 text-xs font-medium text-white">
              {study.metric}
            </span>
          </div>
          <div className="p-5">
            <Text variant="muted" size="xs" className="mb-1 uppercase tracking-wider">
              {study.brand}
            </Text>
            <Heading level={5} className="mb-2">{study.title}</Heading>
            <Text variant="secondary" size="sm">{study.description}</Text>
          </div>
        </Card>
      ))}
    </StaggerChildren>
  )
}
