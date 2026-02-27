/**
 * Dev-only page to run seed. Navigate to /seed to transfer brands + case studies to Firestore (and upload case study images to Storage).
 * Requires admin context (VITE_SKIP_ADMIN_AUTH or signed-in admin).
 */
import { useEffect, useState } from 'react'
import { seedBrandsAndCaseStudies } from '@/lib/seed'
import { useNavigate } from 'react-router'

export function SeedPage() {
  const [result, setResult] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    seedBrandsAndCaseStudies()
      .then(({ brandsAdded, caseStudiesAdded }) => {
        setResult(`Seeded: ${brandsAdded} brands, ${caseStudiesAdded} case studies`)
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : 'Unknown error')
      })
  }, [])

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 p-8 bg-[#0a0a0a] text-white">
        <h1 className="text-xl font-bold text-red-400">Seed failed</h1>
        <p className="text-sm">{error}</p>
        <button onClick={() => navigate('/admin')} className="px-4 py-2 bg-white/10 hover:bg-white/20">
          Back to Admin
        </button>
      </div>
    )
  }

  if (!result) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] text-white">
        <div className="w-8 h-8 border-2 border-accent-indigo border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 p-8 bg-[#0a0a0a] text-white">
      <h1 className="text-xl font-bold text-emerald-400">Seed complete</h1>
      <p className="text-sm">{result}</p>
      <button onClick={() => navigate('/')} className="px-4 py-2 bg-accent-indigo hover:bg-accent-indigo/80">
        Go to Homepage
      </button>
    </div>
  )
}
