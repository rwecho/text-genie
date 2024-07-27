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

export const usePagedThreads = (page: number, pageSize: number) => {
  const [loading, setLoading] = useState(true)
  const [threads, setThreads] = useState<Thread[]>()
  const [totalCount, setTotalCount] = useState<number>()
  const [error, setError] = useState<string>()
  const [totalPage, setTotalPage] = useState<number>()

  useEffect(() => {
    const load = async () => {
      try {
        if (page < 0) {
          return
        }

        const response = await fetch(
          `/api/t?skip=${page * pageSize}&take=${pageSize}&orderBy=createdAt`,
        )
        const { items, totalCount } = await response.json()
        console.log(items)
        setThreads(items)
        setTotalCount(totalCount)
        setError(undefined)
        setTotalPage(Math.ceil(totalCount / pageSize))
      } catch (error: any) {
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [page, pageSize])

  return {
    loading,
    threads,
    totalCount,
    totalPage,
    error,
  }
}
