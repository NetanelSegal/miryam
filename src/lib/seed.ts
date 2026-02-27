/**
 * Seeds brands and caseStudies collections with initial data.
 * Creates the collections if they don't exist (Firestore creates on first write).
 */

import * as brandsStore from './brands-store'
import * as caseStudiesStore from './case-studies-store'

const SEED_BRANDS = ["L'Oréal", 'MAC', 'Samsung', 'Fox', 'Castro', 'Adidas', 'Zara', 'H&M']

const SEED_CASE_STUDIES = [
  {
    brand: "L'Oréal",
    title: 'קמפיין True Match',
    description: 'סדרת תוכן שהגיעה ל-2.7 מיליון צפיות עם אחוז מעורבות של 12%',
    metric: '2.7M צפיות',
    imageUrl: '/images/WhatsApp Image 2026-02-23 at 10.39.53.jpeg',
  },
  {
    brand: 'Samsung',
    title: 'השקת Galaxy S26',
    description: 'שיתוף פעולה ל-Unboxing ו-Review שהפך לוויראלי',
    metric: '1.2M צפיות',
    imageUrl: '/images/WhatsApp Image 2026-02-23 at 10.39.48.jpeg',
  },
  {
    brand: 'Fox',
    title: 'קולקציית קיץ',
    description: 'קמפיין אופנה עם 5 סרטוני TikTok שהניבו המרות ישירות',
    metric: '890K צפיות',
    imageUrl: '/images/WhatsApp Image 2026-02-23 at 10.39.56.jpeg',
  },
]

export async function seedBrandsAndCaseStudies(): Promise<{
  brandsAdded: number
  caseStudiesAdded: number
}> {
  const [existingBrands, existingCaseStudies] = await Promise.all([
    brandsStore.getAllBrands(),
    caseStudiesStore.getAllCaseStudies(),
  ])

  let brandsAdded = 0
  let caseStudiesAdded = 0

  if (existingBrands.length === 0) {
    for (let i = 0; i < SEED_BRANDS.length; i++) {
      const name = SEED_BRANDS[i]
      if (name) {
        await brandsStore.addBrand({ name, order: i })
        brandsAdded++
      }
    }
  }

  if (existingCaseStudies.length === 0) {
    for (let i = 0; i < SEED_CASE_STUDIES.length; i++) {
      const s = SEED_CASE_STUDIES[i]
      if (!s) continue
      let imageUrl: string
      if (s.imageUrl.startsWith('/images/')) {
        const absoluteUrl = typeof window !== 'undefined'
          ? `${window.location.origin}${s.imageUrl}`
          : s.imageUrl
        const res = await fetch(absoluteUrl)
        if (!res.ok) throw new Error(`Seed: failed to fetch ${s.imageUrl} (${res.status})`)
        const blob = await res.blob()
        const file = new File([blob], s.imageUrl.split('/').pop() ?? 'image.jpeg', { type: blob.type || 'image/jpeg' })
        imageUrl = await caseStudiesStore.uploadCaseStudyImage(file)
      } else if (s.imageUrl.startsWith('http')) {
        imageUrl = s.imageUrl
      } else {
        throw new Error(`Seed: case study imageUrl must be /images/ path or http URL, got: ${s.imageUrl}`)
      }
      await caseStudiesStore.addCaseStudy({
        brand: s.brand,
        title: s.title,
        description: s.description,
        metric: s.metric,
        imageUrl,
        order: i,
      })
      caseStudiesAdded++
    }
  }

  return { brandsAdded, caseStudiesAdded }
}
