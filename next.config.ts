/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // ✅ Ignore type errors during build
    ignoreBuildErrors: true,
  },
  eslint: {
    // ✅ Ignore ESLint errors during build
    ignoreDuringBuilds: true,
  },
  basePath: '/bolna',
  assetPrefix: '/bolna/',
};

module.exports = nextConfig;
