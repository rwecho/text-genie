import { Thread } from '@/types/thread'
import { useEffect, useState } from 'react'

export const useTopThreads = () => {
  const [loading, setLoading] = useState(true)
  const [threads, setThreads] = useState<Thread[]>()
  const [totalCount, setTotalCount] = useState<number>()
  const [error, setError] = useState<string>()

  useEffect(() => {
    const load = async () => {
      try {
        const response = await fetch('/api/t?take=5&orderBy=createdAt')
        const { items, totalCount } = await response.json()
        setThreads(items)
        setTotalCount(totalCount)
      } catch (error: any) {
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  return {
    loading,
    threads,
    totalCount,
    error,
  }
}
