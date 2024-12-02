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
};

module.exports = nextConfig;