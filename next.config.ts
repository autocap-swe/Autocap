import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '1337',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'autocap-strapi.fra1.digitaloceanspaces.com',
      },
      {
        protocol: 'https',
        hostname: 'autocap-strapi.fra1.cdn.digitaloceanspaces.com',
      },
      {
        protocol: 'https',
        hostname: 'cms.autocapgroup.se',
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

export default withNextIntl(nextConfig);
