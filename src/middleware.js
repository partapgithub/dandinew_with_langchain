import { NextResponse } from 'next/server';

export function middleware(request) {
  const response = NextResponse.next();

  // Only apply CSP in production
  if (process.env.NODE_ENV === 'production') {
    const nonce = Buffer.from(crypto.randomUUID()).toString('base64');

    // Set CSP header with explicit frame-src before default-src
    response.headers.set(
      'Content-Security-Policy',
      "frame-src 'self' https://vercel.live; " +
      "connect-src 'self' https://*.supabase.co https://vercel.live https://*.vercel.app wss://*.supabase.co; " +
      "default-src 'self'; " +
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://vercel.live https://*.vercel.app; " +
      "style-src 'self' 'unsafe-inline'; " +
      "img-src 'self' data: blob: https:; " +
      "font-src 'self' data:; " +
      "worker-src 'self' blob:; " +
      "child-src 'self' blob: https://vercel.live; " +
      "form-action 'self'; " +
      "media-src 'self'; " +
      "manifest-src 'self'; " +
      "object-src 'none'"
    );
  }

  // Set other security headers that are safe for both development and production
  response.headers.set('X-DNS-Prefetch-Control', 'on');
  response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  response.headers.set('X-Frame-Options', 'ALLOW-FROM https://vercel.live');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'origin-when-cross-origin');
  
  // Allow CORS for Vercel Live and Supabase
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  return response;
}

export const config = {
  matcher: [
    '/((?!api|_next|_static|_vercel|[\\w-]+\\.\\w+).*)',
  ],
};