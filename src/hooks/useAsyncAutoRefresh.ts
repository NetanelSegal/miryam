import { useState, useEffect, useCallback, useRef } from 'react'

export function useAsyncAutoRefresh<T>(
  fetcher: () => Promise<T>,
  intervalMs: number,
): [T | null, boolean, Error | null, () => void] {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const fetcherRef = useRef(fetcher)
  fetcherRef.current = fetcher

  const refresh = useCallback(async (showLoading = true) => {
    if (showLoading) setLoading(true)
    setError(null)
    try {
      const result = await fetcherRef.current()
      setData(result)
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  useEffect(() => {
    const id = setInterval(() => refresh(false), intervalMs)
    return () => clearInterval(id)
  }, [refresh, intervalMs])

  return [data, loading, error, refresh]
}
