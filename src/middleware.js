import { NextResponse } from 'next/server';

export function middleware(request) {
  const response = NextResponse.next();

  // Only apply CSP in production
  if (process.env.NODE_ENV === 'production') {
    const nonce = Buffer.from(crypto.randomUUID()).toString('base64');

    const cspDirectives = [
      // Default fallback
      "default-src 'self'",
      // Scripts
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://vercel.live https://*.vercel.app",
      // Styles
      "style-src 'self' 'unsafe-inline'",
      // Images
      "img-src 'self' data: blob: https:",
      // Fonts
      "font-src 'self' data:",
      // Frames - explicitly allow Vercel Live
      "frame-src 'self' https://vercel.live",
      // Connections - explicitly allow Supabase and Vercel
      "connect-src 'self' https://*.supabase.co https://vercel.live https://*.vercel.app wss://*.supabase.co",
      // Workers
      "worker-src 'self' blob:",
      // Child sources
      "child-src 'self' blob: https://vercel.live",
      // Forms
      "form-action 'self'",
      // Media
      "media-src 'self'",
      // Manifests
      "manifest-src 'self'",
      // Object sources
      "object-src 'none'"
    ].join('; ');

    // Set CSP header
    response.headers.set(
      'Content-Security-Policy',
      cspDirectives
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