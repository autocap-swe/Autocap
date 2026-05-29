// Learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// Expose Next.js public env vars for tests (mirrors .env.local)
process.env.NEXT_PUBLIC_ENABLE_SV = 'true';

// Mock IntersectionObserver for Framer Motion animations
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  takeRecords() {
    return [];
  }
  unobserve() {}
};

// Mock window.matchMedia for responsive tests (jsdom only)
if (typeof window !== 'undefined')
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation(query => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(), // deprecated
      removeListener: jest.fn(), // deprecated
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  });
