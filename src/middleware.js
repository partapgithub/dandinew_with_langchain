import { NextResponse } from 'next/server';

export function middleware(request) {
  const response = NextResponse.next();

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
  const headers = {
    'Content-Security-Policy': csp,
    'X-DNS-Prefetch-Control': 'on',
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
    'X-Frame-Options': 'ALLOW-FROM https://vercel.live',
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
    '/((?!api|_next|_static|_vercel|[\\w-]+\\.\\w+).*)',
  ],
};