import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'autocap-strapi.fra1.digitaloceanspaces.com',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/investors/case',
        destination: '/investors/why',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
