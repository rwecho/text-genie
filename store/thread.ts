import {
  answerQa,
  dislikeQa,
  getThreads,
  removeThread,
} from '@/services/thread'
import { Thread as ThreadType } from '@/types/thread'
import { create } from 'zustand'

interface TopThreads {
  topThreads: ThreadType[]
  loading: boolean
  load: () => Promise<void>
  error: any
  pushLast: (thread: ThreadType) => void
}

export const useTopThreadsStore = create<TopThreads>((set) => ({
  topThreads: [],
  loading: true,
  error: null,
  load: async () => {
    try {
      const { items } = await getThreads({ skip: 0, take: 5 })
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

interface PagedThreads {
  threads: ThreadType[]
  totalCount: number
  load: (skip: number, take: number, searchText: string) => Promise<void>
  remove: (id: string) => Promise<void>
}

export const usePagedThreadsStore = create<PagedThreads>((set) => ({
  threads: [],
  totalCount: 0,
  load: async (skip, take, searchText) => {
    const { items, totalCount } = await getThreads({ skip, take, searchText })
    set((t) => ({
      threads: [...t.threads, ...items],
      totalCount,
      loading: false,
      error: null,
    }))
  },

  remove: async (id) => {
    await removeThread(id)
    set((t) => ({ threads: t.threads.filter((thread) => thread.id !== id) }))
  },
}))

interface Thread {
  thread?: ThreadType
  relatedTopics: string[]

  setThread: (thread: ThreadType) => void

  dislike: (qaId: string) => Promise<boolean>
  appendNew: (id: string, question: string) => Promise<void>
  answerLast: (id: string) => Promise<void>
}

export const useThreadStore = create<Thread>((set) => ({
  thread: undefined,
  relatedTopics: [],
  setThread: (thread) => {
    set({ thread })
  },
  dislike: async (qaId) => {
    const qa = await dislikeQa(qaId)
    set((t) => {
      if (!t.thread) {
        return t
      }
      const thread = { ...t.thread }
      const existQa = thread.qaList.find((q) => q.id === qaId)
      if (existQa) {
        existQa.dislike = qa.dislike
      }
      return {
        thread: {
          ...thread,
          qaList: [...thread.qaList],
        },
      }
    })

    return qa.dislike
  },
  appendNew: async (id, question) => {
    set(() => ({
      relatedTopics: [],
    }))

    await answerQa({
      id,
      question,
      onMessage: (event, data) => {
        switch (event) {
          case 'qa':
            set((t) => {
              if (!t.thread) {
                return t
              }

              const thread = { ...t.thread }
              const qaList = [...thread.qaList]
              const [lastQa] = qaList.slice(-1)
              const { id, question } = JSON.parse(data)
              if (lastQa.answer) {
                qaList.push({
                  id,
                  question,
                  questionAt: new Date(),
                  sources: [],
                  dislike: false,
                })
              } else {
                lastQa.id = id
              }
              return {
                thread: {
                  ...thread,
                  qaList: qaList,
                },
              }
            })
            break
          case 'answer':
            set((t) => {
              if (!t.thread) {
                return t
              }

              const thread = { ...t.thread }
              const qaList = [...thread.qaList]
              const [lastQa] = qaList.slice(-1)

              if (!lastQa.answer) {
                lastQa.answer = ''
              }
              const chunk = JSON.parse(data)
              console.log('answer', chunk)
              lastQa.answer += chunk
              return {
                thread: {
                  ...thread,
                  qaList: qaList,
                },
              }
            })

            break
          case 'sources':
            set((t) => {
              if (!t.thread) {
                return t
              }

              const list = [...t.thread.qaList]
              const [lastQa] = list.slice(-1)
              lastQa.sources = JSON.parse(data)
              return {
                thread: {
                  ...t.thread,
                  qaList: list,
                },
              }
            })
            break

          case 'related':
            set(() => {
              const relatedTopics = JSON.parse(data)
              return {
                relatedTopics,
              }
            })
            break
        }
      },
    })
  },
  answerLast: async (id) => {
    await answerQa({
      id,
      onMessage: (event, data) => {
        switch (event) {
          case 'qa':
            set((t) => {
              if (!t.thread) {
                return t
              }
              const thread = { ...t.thread }
              const qaList = [...thread.qaList]
              const [lastQa] = qaList.slice(-1)
              const { id, question } = JSON.parse(data)
              if (lastQa.answer) {
                qaList.push({
                  id,
                  question,
                  questionAt: new Date(),
                  sources: [],
                  dislike: false,
                })
              } else {
                lastQa.id = id
              }
              return {
                thread: {
                  ...t.thread,
                },
              }
            })
            break
          case 'answer':
            set((t) => {
              if (!t.thread) {
                return t
              }

              const thread = { ...t.thread }
              const qaList = [...thread.qaList]
              const [lastQa] = qaList.slice(-1)

              if (!lastQa.answer) {
                lastQa.answer = ''
              }
              const chunk = JSON.parse(data)
              console.log('answer', chunk)

              lastQa.answer += chunk

              return {
                thread: {
                  ...thread,
                  qaList: qaList,
                },
              }
            })
            break
          case 'sources':
            set((t) => {
              if (!t.thread) {
                return t
              }
              const list = [...t.thread.qaList]
              const [lastQa] = list.slice(-1)
              lastQa.sources = JSON.parse(data)

              return {
                thread: {
                  ...t.thread,
                  qaList: list,
                },
              }
            })
            break

          case 'related':
            set(() => {
              const relatedTopics = JSON.parse(data)
              return {
                relatedTopics,
              }
            })
            break
        }
      },
    })
  },
}))
