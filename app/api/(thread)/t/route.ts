import { NextRequest } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
export async function POST(request: NextRequest, context: {}) {
  const { question } = await request.json()

  if (!question) {
    return new Response('Question is required', { status: 400 })
  }

  const userId = 'test'
  const thread = await prisma.thread.create({
    data: {
      createdBy: userId,
      qaList: {
        create: {
          question,
        },
      },
    },
  })

  return new Response(JSON.stringify(thread), {
    headers: {
      'Content-Type': 'application/json',
    },
  })
}

export async function GET(request: NextRequest, context: {}) {
  const takeParam = request.nextUrl.searchParams.get('take')
  const orderByParam = request.nextUrl.searchParams.get('orderBy')
  const skipParam = request.nextUrl.searchParams.get('skip')

  const take = takeParam ? parseInt(takeParam) : 10
  const orderBy = orderByParam ? orderByParam : 'createAt'
  const skip = skipParam ? parseInt(skipParam) : 0

  const threads = await prisma.thread.findMany({
    where: {
      isDeleted: false,
    },
    include: {
      qaList: {
        include: {
          sources: true,
        },
      },
    },
    take,
    orderBy: {
      [orderBy]: 'desc',
    },
    skip,
  })

  const totalCount = await prisma.thread.count({
    where: {
      isDeleted: false,
    },
  })

  return new Response(
    JSON.stringify({
      items: threads,
      totalCount,
    }),
    {
      headers: {
        'Content-Type': 'application/json',
      },
    },
  )
}
