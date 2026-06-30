/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  reactCompiler: true,
  experimental: {
    proxyClientMaxBodySize: '200mb', 
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:3003/:path*',
      },
    ]
  },
};

export default nextConfig;