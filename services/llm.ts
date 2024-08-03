export type Message = {
  role: 'system' | 'user' | 'assistant'
  content: string
}

const decoder = new TextDecoder('utf-8')

export async function* createChatCompletion(messages: Message[]) {
  const url = `${process.env.BACKEND_API_URL}/llm/chat_completion`
  if (messages.length === 0) {
    console.log('There is no message to create chat completion')
    return
  }
  const [lastMessage] = messages.slice(-1)
  console.log('createChatCompletion with last message: ', lastMessage)
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      messages,
    }),
  })

  if (!response.body) {
    return
  }

  const reader = response.body.getReader()
  let result = await reader.read()
  while (!result.done) {
    const chunk = decoder.decode(result.value, { stream: true })

    console.log('1111 chunk:', chunk)

    yield chunk
    result = await reader.read()
  }
}

export async function* createChatCompletionWithSearch(messages: Message[]) {
  const url = `${process.env.BACKEND_API_URL}/llm/chat_completion_with_search`
  if (messages.length === 0) {
    console.log('There is no message to create chat completion')
    return
  }
  const [lastMessage] = messages.slice(-1)
  console.log('createChatCompletion with last message: ', lastMessage)
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      messages,
    }),
  })

  if (!response.body) {
    return
  }

  const reader = response.body.getReader()
  let result = await reader.read()
  while (!result.done) {
    const chunk = decoder.decode(result.value, { stream: true })
    yield chunk
    result = await reader.read()
  }
}

export async function createRelatedTopics(question: string, answer: string) {
  const url = `${process.env.BACKEND_API_URL}/llm/related_topics`

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      question,
      answer,
    }),
  })

  return response.json()
}
