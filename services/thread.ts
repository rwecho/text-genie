import { Thread } from '@/types/thread'

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
