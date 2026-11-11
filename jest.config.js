// eslint-disable-next-line @typescript-eslint/no-require-imports
const nextJest = require('next/jest');

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: './',
});

// Add any custom config to be passed to Jest
const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js', '<rootDir>/src/test/intl-mocks.js'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.stories.{js,jsx,ts,tsx}',
    '!src/**/__tests__/**',
  ],
  testMatch: ['**/__tests__/**/*.[jt]s?(x)', '**/?(*.)+(spec|test).[jt]s?(x)'],
  testPathIgnorePatterns: ['/node_modules/', '/.next/'],
  moduleDirectories: ['node_modules', '<rootDir>/'],
};

// These packages ship ES modules only and must be compiled for Jest. next/jest adds its own
// ignore pattern that would exclude them again, so the list is set after it has run.
const ESM_PACKAGES = ['next-intl', 'use-intl', '@formatjs/[^/]+', 'intl-messageformat', '@marsidev/react-turnstile'];

module.exports = async () => {
  const config = await createJestConfig(customJestConfig)();
  config.transformIgnorePatterns = [
    `/node_modules/(?!(${ESM_PACKAGES.join('|')})/)`,
    '^.+\\.module\\.(css|sass|scss)$',
  ];
  return config;
};
