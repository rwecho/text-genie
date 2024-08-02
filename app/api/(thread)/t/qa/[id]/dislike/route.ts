import { PrismaClient } from '@prisma/client'
import { NextRequest } from 'next/server'

const prisma = new PrismaClient()
export async function POST(
  request: NextRequest,
  context: { params: { id: string } },
) {
  const { id } = context.params

  let qa = await prisma.qA.findUnique({
    where: {
      id: id,
    },
  })

  if (!qa) {
    return new Response('QA not found', { status: 404 })
  }

  qa = await prisma.qA.update({
    where: {
      id: id,
    },
    data: {
      dislike: !qa.dislike,
    },
  })

  return new Response(JSON.stringify(qa), {
    headers: {
      'Content-Type': 'application/json',
    },
  })
}
