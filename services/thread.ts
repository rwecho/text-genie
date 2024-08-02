import { QA, Thread } from '@/types/thread'
import { fetchEventSource } from '@microsoft/fetch-event-source'

export const createThread = async (question: string) => {
  const response = await fetch('/api/t', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ question }),
  })
  if (!response.ok) {
    throw new Error(`Failed to create thread ${response.status}`)
  }
  return (await response.json()) as Thread
}

export const getThreads = async ({
  skip = 0,
  take = 10,
  orderBy = 'createdAt',
  searchText = '',
}: {
  skip?: number
  take?: number
  orderBy?: string
  searchText?: string
}) => {
  const response = await fetch(
    `/api/t?skip=${skip}&take=${take}&orderBy=${orderBy}&search=${searchText}`,
  )
  if (!response.ok) {
    throw new Error(`Failed to fetch threads ${response.status}`)
  }
  return (await response.json()) as { items: Thread[]; totalCount: number }
}

export const removeThread = async (id: string) => {
  const response = await fetch(`/api/t/${id}`, {
    method: 'DELETE',
  })
  if (!response.ok) {
    throw new Error(`Failed to delete thread ${response.status}`)
  }
}

export const getThread = async (id: string) => {
  const response = await fetch(`${process.env.URL}/api/t/${id}`)
  if (!response.ok) {
    throw new Error(`Failed to fetch thread ${response.status}`)
  }

  const json = await response.json()
  return json as Thread
}

export const dislikeQa = async (qaId: string) => {
  const response = await fetch(`/api/t/qa/${qaId}/dislike`, {
    method: 'POST',
  })
  if (!response.ok) {
    throw new Error(`Failed to dislike qa ${response.status}`)
  }
  return (await response.json()) as QA
}

export const answerQa = async ({
  id,
  question,
  onMessage,
}: {
  id: string
  question?: string
  onMessage: (event: string, data: string) => void
}) => {
  const abortController = new AbortController()
  await fetchEventSource(`/api/t/${id}/qa`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    onclose: () => {},
    onerror: (err) => {
      throw err
    },
    signal: abortController.signal,
    body: question ? JSON.stringify({ question }) : JSON.stringify({}),
    onmessage: (event) => {
      onMessage(event.event, event.data)
    },
  })
}
