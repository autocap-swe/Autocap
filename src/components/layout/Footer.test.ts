import en from '../../../messages/en.json';
import sv from '../../../messages/sv.json';
import { COMPANY_INFO } from '@/lib/constants';

// The footer bottom bar renders name · org number · address — tagline.
describe.each([
  ['en', en],
  ['sv', sv],
])('Footer bottom bar (%s)', (_locale, messages) => {
  const line = `${COMPANY_INFO.name} · ${messages.footer.orgNumberLabel} ${COMPANY_INFO.orgNumber} · ${messages.footer.bottomBar} — ${messages.footer.tagline}`;

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

describe('Footer company details (fas A)', () => {
  it('AC-A5.1: has the organisation number from Bolagsverket', () => {
    expect(COMPANY_INFO.orgNumber).toBe('559215-7357');
  });
  it('AC-A5.2: links to the LinkedIn company page', () => {
    expect(COMPANY_INFO.linkedInUrl).toBe('https://www.linkedin.com/company/autocapgroup');
  });
  it('AC-A5.3: names the CFO as investor relations contact', () => {
    expect(COMPANY_INFO.investorRelations).toEqual({
      name: 'Niklas Norén',
      role: 'CFO',
      email: 'niklas.noren@autocapgroup.se',
    });
    expect(en.footer.investorRelationsLabel).toBe('IR');
    expect(sv.footer.investorRelationsLabel).toBe('IR');
  });
});
