import { NextRequest } from 'next/server'
import { getAuth } from '@clerk/nextjs/server'
import { PrismaClient, Thread } from '@prisma/client'
import { sleep } from '@/services/utils'

const prisma = new PrismaClient()
const encoder = new TextEncoder()

export async function GET(
  request: NextRequest,
  context: { params: { id: string } },
) {
  const threadId = context.params.id

  const thread = await prisma.thread.findUnique({
    where: {
      id: threadId,
      isDeleted: false,
    },
    include: {
      qaList: {
        include: {
          sources: true,
        },
      },
    },
  })
  if (!thread) {
    return new Response('Thread not found', { status: 404 })
  }

  return new Response(JSON.stringify(thread), {
    headers: {
      'Content-Type': 'application/json',
    },
  })
}

export async function POST(
  request: NextRequest,
  context: { params: { id: string } },
) {
  const threadId = context.params.id

  const { question } = await request.json()

  const thread = await prisma.thread.findUnique({
    where: {
      id: threadId,
    },
    include: {
      qaList: true,
    },
  })

  if (!thread) {
    return new Response('Thread not found', { status: 404 })
  }
  let [lastQa] = thread.qaList.slice(-1)
  if (!!lastQa.answer) {
    // insert a new QA if the last one has an answer
    lastQa = await prisma.qA.create({
      data: {
        question,
        threadId,
      },
    })
  }
  const questionIterator = makeEvent(
    'qa',
    JSON.stringify({
      id: lastQa.id,
      question,
    }),
  )
  const sourcesIterator = makeSources(thread, lastQa.id)
  const answerIterator = makeAnswer(thread, lastQa.id)

  const relatedIterator = makeEvent(
    'related',
    JSON.stringify(['动物哪里去找?', '动物怎么找?', '动物怎么找到?']),
  )

  const stream = iteratorToStream([
    questionIterator,
    sourcesIterator,
    answerIterator,
    relatedIterator,
  ])

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
    },
  })
}

export async function DELETE(
  request: NextRequest,
  context: { params: { id: string } },
) {
  const threadId = context.params.id

  await prisma.thread.update({
    where: {
      id: threadId,
    },
    data: {
      isDeleted: true,
    },
  })

  return new Response('Thread deleted', { status: 200 })
}

function iteratorToStream(iterators: any[]) {
  let currentIterator = iterators.shift()
  return new ReadableStream({
    async pull(controller) {
      const { value, done } = await currentIterator.next()

      if (done) {
        if (iterators.length === 0) {
          controller.close()
        } else {
          currentIterator = iterators.shift()
        }
      } else {
        controller.enqueue(value)
      }
    },
  })
}

async function* makeSources(thread: Thread, qaId: string) {
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

  await prisma.answerSource.createMany({
    data: [
      {
        qaId: qaId,
        link: 'www.baidu.com',
        title: 'Baidu',
      },
      {
        qaId: qaId,
        link: 'www.google.com',
        title: 'Google',
      },
      {
        qaId: qaId,
        link: 'www.bing.com',
        title: 'Bing',
      },
      {
        qaId: qaId,
        link: 'www.yahoo.com',
        title: 'Yahoo',
      },
      {
        qaId: qaId,
        link: 'www.daum.net',
        title: 'Daum',
      },
    ],
  })
}

async function* makeAnswer(thread: Thread, qaId: string) {
  let answer = ''
  for (let i = 0; i < 100; i++) {
    await sleep(10)
    yield* makeEvent('answer', `${i} `)
    answer += `${i} `
  }
  await prisma.qA.update({
    where: {
      id: qaId,
    },
    data: {
      answer,
    },
  })
}

async function* makeEvent(event: string, data: string) {
  yield encoder.encode(`event: ${event}\n`)
  yield encoder.encode(`data: ${data}\n\n`)
}
