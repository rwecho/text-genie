import {
  clerkMiddleware,
  createRouteMatcher,
  getAuth,
} from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

const isPublicRoute = createRouteMatcher(['/sign-in(.*)', '/sign-up(.*)'])

export default clerkMiddleware((auth, request) => {
  // if (isPublicRoute(request)) {
  //   return
  // }
  // const { userId } = auth()
  // if (!userId) {
  //   const signInUrl = new URL('/sign-in', request.url)
  //   signInUrl.searchParams.set('redirect_url', request.url)
  //   return NextResponse.redirect(signInUrl)
  // }
  // auth().protect()
}, {})

export const config = {
  debug: true,
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)', '/api(.*)'],
}
