/** @type {import('next').NextConfig} */
const nextConfig = {
  ...(process.env.NETLIFY === 'true' ? { output: 'export' } : {}),
  images: {
    unoptimized: true,
    domains: ['images.unsplash.com'],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  trailingSlash: true,
};

module.exports = nextConfig;