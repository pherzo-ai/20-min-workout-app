/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: '/start',
  assetPrefix: '/start',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'raw.githubusercontent.com',
        pathname: '/yuhonas/free-exercise-db/**',
      },
    ],
  },
};

module.exports = nextConfig;
