import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';
import { withSentryConfig } from '@sentry/nextjs';

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
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "frame-ancestors 'self' https://cms.autocapgroup.se",
          },
        ],
      },
    ];
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

export default withSentryConfig(withNextIntl(nextConfig), {
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  silent: true,
  widenClientFileUpload: true,
  disableLogger: true,
  automaticVercelMonitors: false,
});
