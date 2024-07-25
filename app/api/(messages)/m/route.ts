import { sleep } from '@/services/utils'
import { NextRequest } from 'next/server'

const encoder = new TextEncoder()

// https://developer.mozilla.org/docs/Web/API/ReadableStream#convert_async_iterator_to_stream
function iteratorToStream(iterator: any) {
  return new ReadableStream({
    async pull(controller) {
      const { value, done } = await iterator.next()

      if (done) {
        controller.close()
      } else {
        controller.enqueue(value)
      }
    },
  })
}

async function* makeResponses(content: string, threadId: string) {
  // create thread if it doesn't exist
  if (!threadId) {
    // generate random uuid for thread id
    threadId = Math.random().toString(36).substring(2)
  }

  yield* makeEvent('question', content)

  yield* makeEvent('threadId', threadId)

  yield* makeEvent(
    'sources',
    JSON.stringify([
      'www.baidu.com',
      'www.google.com',
      'www.bing.com',
      'www.yahoo.com',
      'www.daum.net',
    ]),
  )

  for (let i = 0; i < 100; i++) {
    await sleep(10)
    yield* makeEvent('answer', `${i} `)
  }

  yield* makeEvent(
    'related',
    JSON.stringify(['动物哪里去找?', '动物怎么找?', '动物怎么找到?']),
  )
}

async function* makeEvent(event: string, data: string) {
  yield encoder.encode(`event: ${event}\n`)
  yield encoder.encode(`data: ${data}\n\n`)
}

export async function POST(request: NextRequest, context: {}) {
  const { content, threadId } = await request.json()
  const iterator = makeResponses(content, threadId)

  const stream = iteratorToStream(iterator)
  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  })
}
