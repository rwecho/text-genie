import { NextRequest } from 'next/server'

export async function GET(
  request: NextRequest,
  context: { params: { id: string } }
) {
  const { id } = context.params

  if (!id) {
    return new Response(null, { status: 400 })
  }

  return new Response(
    JSON.stringify({
      id,
    }),
    { status: 200 }
  )
}
