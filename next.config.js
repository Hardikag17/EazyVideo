/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['ipfs.infura.io'],
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig;
