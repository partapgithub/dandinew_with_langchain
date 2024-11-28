import { NextResponse } from 'next/server';

export function middleware(request) {
  // Get the pathname of the request (e.g. /, /dashboard, etc.)
  const path = request.nextUrl.pathname;

  // Redirect from /dashboard to /newdashboard
  if (path === '/dashboard') {
    return NextResponse.redirect(new URL('/newdashboard', request.url));
  }

  return NextResponse.next();
}

// Configure which paths should be processed by this middleware
export const config = {
  matcher: '/dashboard'
};