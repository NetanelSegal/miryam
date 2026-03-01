import { useState, useEffect } from 'react'
import { Marquee } from '@/components/ui'
import { getAllBrands, type Brand } from '@/lib/brands-store'
import { FALLBACK_BRANDS } from './constants'

export function BrandMarqueeSection() {
  const [brands, setBrands] = useState<Brand[]>(FALLBACK_BRANDS)

  useEffect(() => {
    getAllBrands()
      .then((data) => setBrands(data.length > 0 ? data : FALLBACK_BRANDS))
      .catch(() => {})
  }, [])

  return (
    <Marquee speed={25}>
      {brands.map((b) => (
        <div
          key={b.id}
          className="shrink-0 w-28 h-12 bg-white/5 flex items-center justify-center text-text-muted text-sm font-medium"
        >
          {b.name}
        </div>
      ))}
    </Marquee>
  )
}
