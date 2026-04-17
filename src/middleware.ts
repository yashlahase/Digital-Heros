import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  const url = req.nextUrl.clone()

  // Protect dashboard and admin routes
  if (url.pathname.startsWith('/dashboard') || url.pathname.startsWith('/admin')) {
    if (!session) {
      url.pathname = '/auth/login'
      url.searchParams.set('returnTo', req.nextUrl.pathname)
      return NextResponse.redirect(url)
    }

    // Role-based protection for admin
    if (url.pathname.startsWith('/admin')) {
      // Fetch user profile to check role
      const { data: profile } = await supabase
        .from('users')
        .select('role')
        .eq('id', session.user.id)
        .single()

      if (profile?.role !== 'admin') {
        url.pathname = '/dashboard'
        return NextResponse.redirect(url)
      }
    }
  }

  // Redirect authenticated users away from auth pages
  if (session && url.pathname.startsWith('/auth')) {
    url.pathname = '/dashboard'
    return NextResponse.redirect(url)
  }

  return res
}

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*', '/auth/:path*'],
}
