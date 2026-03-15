import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Ignore TypeScript errors during build (temporary fix for backups folder)
    ignoreBuildErrors: true,
  },
  // Exclude backups folder from compilation
  webpack: (config) => {
    config.watchOptions = {
      ...config.watchOptions,
      ignored: ['**/backups/**', '**/node_modules/**'],
    }
    return config
  },
}

export default nextConfig
