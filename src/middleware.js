import { NextResponse } from 'next/server';

export function middleware(request) {
  // Create the response
  const response = NextResponse.next();

  // Define CSP directives
  const cspDirectives = {
    'default-src': ["'self'", 'https://*.supabase.co', 'https://vercel.live', 'https://*.vercel.app'],
    'script-src': ["'self'", "'unsafe-inline'", "'unsafe-eval'", 'https://vercel.live', 'https://*.vercel.app'],
    'style-src': ["'self'", "'unsafe-inline'"],
    'img-src': ["'self'", 'data:', 'https:'],
    'font-src': ["'self'", 'data:'],
    'frame-src': ["'self'", 'https://vercel.live'],
    'connect-src': ["'self'", 'https://*.vercel.app', 'https://vercel.live', 'https://*.supabase.co', 'https://ztgdyzqyktwyfrznpcic.supabase.co'],
    'worker-src': ["'self'", 'blob:'],
    'child-src': ["'self'", 'blob:', 'https://vercel.live'],
    'form-action': ["'self'"],
    'media-src': ["'self'", 'https:'],
    'manifest-src': ["'self'"],
    'object-src': ["'none'"]
  };

  // Build CSP string
  const csp = Object.entries(cspDirectives)
    .map(([key, values]) => `${key} ${values.join(' ')}`)
    .join('; ');

  // Set security headers
  const headers = {
    'Content-Security-Policy': csp,
    'X-DNS-Prefetch-Control': 'on',
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
    'X-Frame-Options': 'SAMEORIGIN',
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'origin-when-cross-origin',
  };

  // Apply headers
  Object.entries(headers).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * 1. /api/ (API routes)
     * 2. /_next/ (Next.js internals)
     * 3. /_static (inside /public)
     * 4. /_vercel (Vercel internals)
     * 5. all root files inside /public (e.g. /favicon.ico)
     */
    '/((?!api|_next|_static|_vercel|[\\w-]+\\.\\w+).*)',
  ],
};