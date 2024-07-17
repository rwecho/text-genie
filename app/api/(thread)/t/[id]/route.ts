import { NextRequest } from 'next/server'
import { getAuth } from '@clerk/nextjs/server'

export async function GET(
  request: NextRequest,
  context: { params: { id: string } },
) {
  const { userId } = getAuth(request)

  if (!userId) {
    return new Response(null, { status: 401 })
  }

  const { id } = context.params

  if (!id) {
    return new Response(null, { status: 400 })
  }

  return new Response(
    JSON.stringify({
      userId,
      id,
    }),
    { status: 200 },
  )
}
