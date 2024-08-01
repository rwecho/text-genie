import { Thread } from '@/types/thread'
import { create } from 'zustand'

interface TopThreads {
  topThreads: Thread[]
  loading: boolean
  load: () => Promise<void>
  error: any
  pushLast: (thread: Thread) => void
}

export const useTopThreadsStore = create<TopThreads>((set) => ({
  topThreads: [],
  loading: true,
  error: null,
  load: async () => {
    try {
      const response = await fetch('/api/t?take=5&orderBy=createdAt')
      const { items } = await response.json()
      set({ topThreads: items, loading: false, error: null })
    } catch (error: any) {
      set({ error })
    } finally {
      set({ loading: false })
    }
  },

  pushLast: (thread) =>
    set((state) => {
      const topThreads = state.topThreads.filter((t) => t.id !== thread.id)
      return { topThreads: [thread, ...topThreads.slice(0, -1)] }
    }),
}))
