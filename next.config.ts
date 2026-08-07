import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactCompiler: true,
  rewrites() {
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:8080';

    return [
      {
        source: '/api/:path*',
        destination: `${backendUrl}/api/:path*`,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '%.public.blob.vercel-storage.com'.replace('%', '*'),
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
