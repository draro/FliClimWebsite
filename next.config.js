/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    // domains: ['images.unsplash.com','www.flyclim.com'],
  },
  output: 'standalone',
}

module.exports = nextConfig