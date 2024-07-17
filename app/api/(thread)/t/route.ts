import { NextRequest } from 'next/server'

export async function POST(request: NextRequest, context: {}) {

  // get current user


  const { question, engine } = await request.json()

  if (!question || !engine) {
    return new Response(null, { status: 400 })
  }

  // generate random uuid for thread id
  const threadId = Math.random().toString(36).substring(2)
  return new Response(
    JSON.stringify({
      threadId,
    }),
    { status: 200 }
  )
}
