import {
  clerkMiddleware,
  createRouteMatcher,
  getAuth,
} from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'
import createMiddleware from 'next-intl/middleware'

const isPublicRoute = createRouteMatcher(['/sign-in(.*)', '/sign-up(.*)'])

export default clerkMiddleware(async (auth, request) => {
  if (isPublicRoute(request)) {
    return
  }
  const { userId } = auth()
  if (!userId) {
    const signInUrl = new URL(`/sign-in`, request.url)
    signInUrl.searchParams.set('redirect_url', request.url)
    return NextResponse.redirect(signInUrl)
  }
  auth().protect()

  return createMiddleware({
    locales: ['en', 'cn'],
    defaultLocale: 'en',
  })(request)
}, {})

export const config = {
  // Match all routes except /api
  matcher: ['/((?!api|_next/static|favicon.ico).*)', '/', '/(cn|en)/:path*'],
}

// export const config = {
//   debug: true,
//   matcher: [
//     // Skip all internal paths (_next)
//     '/((?!_next).*)',
//     // Optional: only run on root (/) URL
//     // '/'
//   ],
//   // matcher: ['/((?!.*\\..*|_next).*)', '/(trpc)(.*)'],
// }
