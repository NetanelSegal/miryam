import { useState, useEffect, useCallback, useRef } from 'react'

export function useAutoRefresh<T>(fetcher: () => T, intervalMs: number): [T, () => void] {
  const [data, setData] = useState<T>(fetcher)
  const fetcherRef = useRef(fetcher)
  fetcherRef.current = fetcher

  const refresh = useCallback(() => {
    setData(fetcherRef.current())
  }, [])

  useEffect(() => {
    const id = setInterval(refresh, intervalMs)
    return () => clearInterval(id)
  }, [refresh, intervalMs])

  return [data, refresh]
}
