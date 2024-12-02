const JavaScriptObfuscator = require('webpack-obfuscator');

/** @type {import('next').NextConfig} */
const nextConfig = {
  // ... other config options
  env: {
    PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  },
  // Disable source maps in production
  productionBrowserSourceMaps: false,
  // Add security headers
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
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
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          },
          {
            key: 'Content-Security-Policy',
            value: process.env.NODE_ENV === 'production' 
              ? "default-src 'self'; " +
                "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://vercel.live https://*.vercel.app; " +
                "style-src 'self' 'unsafe-inline'; " +
                "img-src 'self' data: https:; " +
                "font-src 'self' data:; " +
                "frame-src 'self' https://vercel.live; " +
                "connect-src 'self' https://*.vercel.app https://vercel.live https://*.supabase.co https://ztgdyzqyktwyfrznpcic.supabase.co;"
              : ""
          }
        ]
      }
    ];
  },
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
};

module.exports = nextConfig; 