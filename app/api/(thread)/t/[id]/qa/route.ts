import { NextRequest } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { ThreadService } from '../thread'

const prisma = new PrismaClient()

export async function POST(
  request: NextRequest,
  context: { params: { id: string } },
) {
  const threadId = context.params.id
  const { question }: { question?: string } = await request.json()

  const thread = await prisma.thread.findUnique({
    where: {
      id: threadId,
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
  const threadService = new ThreadService(thread, prisma)
  const stream = await threadService.Append(question)
  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
    },
  })
}
