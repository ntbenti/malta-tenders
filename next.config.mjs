/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    // removed appDir as it's now stable in Next.js 14
  }
}

export default nextConfig;
