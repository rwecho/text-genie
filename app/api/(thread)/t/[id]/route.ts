import { NextRequest } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { ThreadService } from './thread'

const prisma = new PrismaClient()

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
