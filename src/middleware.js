import { NextResponse } from 'next/server';

export function middleware(request) {
  const response = NextResponse.next();

  // Only apply CSP in production
  if (process.env.NODE_ENV === 'production') {
    // More permissive CSP directives
    const cspDirectives = {
      'default-src': ["'self'", "'unsafe-inline'", "'unsafe-eval'", 'https://*'],
      'script-src': ["'self'", "'unsafe-inline'", "'unsafe-eval'", 'https://*'],
      'style-src': ["'self'", "'unsafe-inline'", 'https://*'],
      'img-src': ["'self'", 'data:', 'blob:', 'https://*'],
      'font-src': ["'self'", 'data:', 'https://*'],
      'frame-src': ["'self'", 'https://*'],
      'connect-src': ["'self'", 'https://*'],
      'worker-src': ["'self'", 'blob:', 'https://*'],
      'child-src': ["'self'", 'blob:', 'https://*'],
      'form-action': ["'self'", 'https://*'],
      'media-src': ["'self'", 'https://*'],
      'manifest-src': ["'self'"],
      'object-src': ["'none'"]
    };

    // Build CSP string
    const csp = Object.entries(cspDirectives)
      .map(([key, values]) => `${key} ${values.join(' ')}`)
      .join('; ');

    // Set security headers
    response.headers.set('Content-Security-Policy', csp);
  }

  // Set other security headers that are safe for both development and production
  response.headers.set('X-DNS-Prefetch-Control', 'on');
  response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  response.headers.set('X-Frame-Options', 'ALLOW-FROM https://vercel.live');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'origin-when-cross-origin');

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