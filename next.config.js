const JavaScriptObfuscator = require('webpack-obfuscator');

/** @type {import('next').NextConfig} */
const nextConfig = {
  // ... other config options
  env: {
    PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  },
  // Disable source maps in production
  productionBrowserSourceMaps: false,
  webpack: (config, { dev, isServer }) => {
    if (!dev && !isServer) {
      config.plugins.push(
        new JavaScriptObfuscator({
          rotateStringArray: true,
          stringArray: true,
          stringArrayEncoding: ['base64'],
          splitStrings: true,
          identifierNamesGenerator: 'hexadecimal'
        })
      );
    }
    return config;
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: [
              "frame-src 'self' https://vercel.live https://*.vercel.app;",
              "connect-src 'self' https://*.supabase.co https://vercel.live https://*.vercel.app wss://*.supabase.co https://*.pusher.com wss://*.pusher.com https://sockjs-*.pusher.com;",
              "default-src 'self';",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://vercel.live https://*.vercel.app;",
              "style-src 'self' 'unsafe-inline' https://vercel.live https://*.vercel.app;",
              "style-src-elem 'self' 'unsafe-inline' https://vercel.live https://*.vercel.app;",
              "img-src 'self' data: blob: https: https://*.vercel.app;",
              "font-src 'self' data: https://*.vercel.app;",
              "worker-src 'self' blob:;",
              "child-src 'self' blob: https://vercel.live;",
              "form-action 'self';",
              "media-src 'self';",
              "manifest-src 'self';",
              "object-src 'none'"
            ].join(' ')
          },
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains'
          },
          {
            key: 'X-Frame-Options',
            value: 'ALLOW-FROM https://vercel.live'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          }
        ]
      }
    ];
  }
};

module.exports = nextConfig;