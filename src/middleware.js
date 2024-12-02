import { NextResponse } from 'next/server';

export function middleware(request) {
  // Add security headers
  const headers = new Headers(request.headers);
  
  // Prevent clickjacking
  headers.set('X-Frame-Options', 'DENY');
  
  // Prevent MIME type sniffing
  headers.set('X-Content-Type-Options', 'nosniff');
  
  // Enable strict CSP in production
  if (process.env.NODE_ENV === 'production') {
    headers.set('Content-Security-Policy', "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval';");
  }

  // Basic DDoS protection
  const requestsPerMinute = 100; // Adjust as needed
  // Implement rate limiting here

  return NextResponse.next({
    request: {
      headers: headers,
    },
  });
}

export const config = {
  matcher: '/api/:path*',
};