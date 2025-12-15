/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: 's2.googleusercontent.com',
      },
      {
        hostname: 'pbs.twimg.com',
      },
      {
        hostname: 'github.com',
      },
    ],
  },
  // Optimize compilation
  experimental: {
    optimizePackageImports: [
      'lucide-react',
      '@headlessui/react',
      'better-react-mathjax',
      'react-syntax-highlighter',
    ],
  },
  // Remove console logs in production
  compiler: {
    removeConsole:
      process.env.NODE_ENV === 'production'
        ? {
            exclude: ['error', 'warn'],
          }
        : false,
  },
  async rewrites() {
    return [
      {
        source: '/api/proxy/yield/:path*',
        destination: 'http://195.154.191.21:3042/:path*',
      },
      {
        source: '/api/proxy/war/:path*',
        destination: 'http://195.154.191.21:5004/api/:path*',
      },
    ];
  },
};

export default nextConfig;
