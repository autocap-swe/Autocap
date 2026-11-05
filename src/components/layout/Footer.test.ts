import en from '../../../messages/en.json';
import sv from '../../../messages/sv.json';
import { COMPANY_INFO } from '@/lib/constants';

// The footer bottom bar renders `${COMPANY_INFO.name} · ${footer.bottomBar} — ${footer.tagline}`.
describe.each([
  ['en', en],
  ['sv', sv],
])('Footer bottom bar (%s)', (_locale, messages) => {
  const line = `${COMPANY_INFO.name} · ${messages.footer.bottomBar} — ${messages.footer.tagline}`;

  it('AC-001: shows the company name exactly once', () => {
    expect(line.split(COMPANY_INFO.name).length - 1).toBe(1);
  });

  it('AC-002: shows the street address', () => {
    expect(line).toContain('Nybrogatan 7, Stockholm');
  });
});

describe('Footer tagline (en)', () => {
  it('AC-003: positions AutoCap as Swedish, not Nordic', () => {
    expect(en.footer.tagline).not.toMatch(/nordic/i);
  });
});
