import { NextRequest } from 'next/server'

// export async function GET(request: NextRequest, context: {}) {
//   const stream = new ReadableStream({
//     async start(controller) {
//       const encoder = new TextEncoder()
//       const decoder = new TextDecoder()
//       const intervalId = setInterval(() => {
//         controller.enqueue(
//           encoder.encode(
//             `data: ${JSON.stringify(
//               new Date().toISOString() + '\nabc\n\n',
//             )}\n\n`,
//           ),
//         )
//       }, 1000)

//       return () => {
//         clearInterval(intervalId)
//         controller.close()
//       }
//     },
//   })

//   return new Response(stream, {
//     headers: {
//       'Content-Type': 'text/event-stream',
//     },
//   })
// }
