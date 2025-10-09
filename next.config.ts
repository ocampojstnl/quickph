import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ['@prisma/client'],
  // Disable static optimization for pages that need authentication
  output: 'standalone',
  // Ensure compatibility with deployment platforms
  images: {
    domains: ['localhost'],
  },
};

export default nextConfig;
