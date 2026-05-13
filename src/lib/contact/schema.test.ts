import { ContactSchema, InvestorSchema } from './schema';

const validPayload = {
  name: 'Anna Lindqvist',
  email: 'anna@example.com',
  message: 'Hello, I would like more information.',
  gdprConsent: true,
};

describe('ContactSchema', () => {
  it('accepts a valid payload', () => {
    const result = ContactSchema.safeParse(validPayload);
    expect(result.success).toBe(true);
  });

  it('rejects when gdprConsent is false', () => {
    const result = ContactSchema.safeParse({ ...validPayload, gdprConsent: false });
    expect(result.success).toBe(false);
  });

  it('rejects when gdprConsent is missing', () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { gdprConsent, ...rest } = validPayload;
    const result = ContactSchema.safeParse(rest);
    expect(result.success).toBe(false);
  });

  it('rejects an invalid email', () => {
    const result = ContactSchema.safeParse({ ...validPayload, email: 'not-an-email' });
    expect(result.success).toBe(false);
    if (!result.success) {
      const emailIssue = result.error.issues.find(i => i.path[0] === 'email');
      expect(emailIssue).toBeDefined();
    }
  });

  it('rejects an empty name', () => {
    const result = ContactSchema.safeParse({ ...validPayload, name: '' });
    expect(result.success).toBe(false);
  });

  it('rejects an empty message', () => {
    const result = ContactSchema.safeParse({ ...validPayload, message: '' });
    expect(result.success).toBe(false);
  });
});

const validInvestorPayload = {
  fullName: 'Erik Lindqvist',
  organisation: 'Nordic Capital Partners',
  role: 'Managing Partner',
  enquiryType: 'Investment',
  email: 'erik@nordiccapital.se',
  message: 'Interested in co-investment opportunities.',
  gdprConsent: true as const,
};

describe('InvestorSchema', () => {
  it('accepts a valid full payload', () => {
    const result = InvestorSchema.safeParse(validInvestorPayload);
    expect(result.success).toBe(true);
  });

  it('accepts payload without optional message', () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { message, ...withoutMessage } = validInvestorPayload;
    const result = InvestorSchema.safeParse(withoutMessage);
    expect(result.success).toBe(true);
  });

  it('accepts all four enquiryType values', () => {
    for (const type of ['Investment', 'Partnership', 'Media', 'Other']) {
      const result = InvestorSchema.safeParse({ ...validInvestorPayload, enquiryType: type });
      expect(result.success).toBe(true);
    }
  });

  it('rejects enquiryType outside enum', () => {
    const result = InvestorSchema.safeParse({ ...validInvestorPayload, enquiryType: 'Venture' });
    expect(result.success).toBe(false);
    if (!result.success) {
      const issue = result.error.issues.find(i => i.path[0] === 'enquiryType');
      expect(issue).toBeDefined();
    }
  });

  it('rejects gdprConsent false', () => {
    const result = InvestorSchema.safeParse({ ...validInvestorPayload, gdprConsent: false });
    expect(result.success).toBe(false);
  });

  it('rejects an invalid email', () => {
    const result = InvestorSchema.safeParse({ ...validInvestorPayload, email: 'not-an-email' });
    expect(result.success).toBe(false);
  });

  it('rejects an empty fullName', () => {
    const result = InvestorSchema.safeParse({ ...validInvestorPayload, fullName: '' });
    expect(result.success).toBe(false);
  });

  it('rejects an empty organisation', () => {
    const result = InvestorSchema.safeParse({ ...validInvestorPayload, organisation: '' });
    expect(result.success).toBe(false);
  });

  it('rejects an empty role', () => {
    const result = InvestorSchema.safeParse({ ...validInvestorPayload, role: '' });
    expect(result.success).toBe(false);
  });
});
