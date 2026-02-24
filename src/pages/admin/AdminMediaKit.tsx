import { useState } from 'react'
import { BarChart3, Briefcase, Tag } from 'lucide-react'
import { SubTabNav } from '@/components/ui'
import { AdminCaseStudies } from './AdminCaseStudies'
import { AdminBrands } from './AdminBrands'
import { AdminMediaKitStats } from './media-kit/AdminMediaKitStats'

type MediaKitSubTab = 'stats' | 'caseStudies' | 'brands'

export function AdminMediaKit() {
  const [subTab, setSubTab] = useState<MediaKitSubTab>('stats')

  return (
    <>
      <SubTabNav
        tabs={[
          { id: 'stats', label: 'נתוני רשתות', icon: BarChart3 },
          { id: 'caseStudies', label: 'קמפיינים', icon: Briefcase },
          { id: 'brands', label: 'מותגים', icon: Tag },
        ]}
        activeId={subTab}
        onChange={(id) => setSubTab(id as MediaKitSubTab)}
      />

      {subTab === 'caseStudies' && <AdminCaseStudies />}
      {subTab === 'brands' && <AdminBrands />}
      {subTab === 'stats' && <AdminMediaKitStats />}
    </>
  )
}
