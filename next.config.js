/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'redwin-next-ecommerce.s3.amazonaws.com',
        pathname: '/**',
        port: ''
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com'
      }
    ],
    // domains: ["lh3.googleusercontent.com","redwin-next-ecommerce.s3.amazonaws.com"],
  }
}

module.exports = nextConfig
