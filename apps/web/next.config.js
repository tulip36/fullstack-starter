/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@monorepo/shared', '@monorepo/ui'],
  experimental: {
    optimizePackageImports: ['@monorepo/ui'],
  },
  images: {
    domains: ['localhost'],
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
    NEXT_PUBLIC_APP_DESCRIPTION: process.env.NEXT_PUBLIC_APP_DESCRIPTION,
  },
};

export default nextConfig;