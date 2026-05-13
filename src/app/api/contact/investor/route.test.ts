import { handleInvestorForm } from './handler';

jest.mock('@/lib/contact/emailService', () => ({
  sendInvestorEmail: jest.fn(),
}));

import { sendInvestorEmail } from '@/lib/contact/emailService';
const mockSendEmail = sendInvestorEmail as jest.MockedFunction<typeof sendInvestorEmail>;

const mockFetch = jest.fn();
global.fetch = mockFetch;

const validBody = {
  fullName: 'Erik Lindqvist',
  organisation: 'Nordic Capital Partners',
  role: 'Managing Partner',
  enquiryType: 'Investment',
  email: 'erik@nordiccapital.se',
  message: 'Interested in co-investment opportunities.',
  gdprConsent: true,
};

beforeEach(() => {
  jest.clearAllMocks();
  mockFetch.mockResolvedValue({ ok: true, json: async () => ({ data: { id: 1 } }) });
  mockSendEmail.mockResolvedValue(undefined);
});

describe('handleInvestorForm', () => {
  // AC-001: successful submission for each enquiry type
  it('returns 200 on valid Investment submission', async () => {
    const result = await handleInvestorForm(validBody);
    expect(result.status).toBe(200);
    expect(result.body).toEqual({ success: true });
  });

  it('returns 200 on valid Partnership submission', async () => {
    const result = await handleInvestorForm({ ...validBody, enquiryType: 'Partnership' });
    expect(result.status).toBe(200);
    expect(result.body).toEqual({ success: true });
  });

  it('returns 200 on valid Media submission', async () => {
    const result = await handleInvestorForm({ ...validBody, enquiryType: 'Media' });
    expect(result.status).toBe(200);
    expect(result.body).toEqual({ success: true });
  });

  it('returns 200 on valid Other submission', async () => {
    const result = await handleInvestorForm({ ...validBody, enquiryType: 'Other' });
    expect(result.status).toBe(200);
    expect(result.body).toEqual({ success: true });
  });

  it('returns 200 when message is omitted', async () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { message, ...withoutMessage } = validBody;
    const result = await handleInvestorForm(withoutMessage);
    expect(result.status).toBe(200);
  });

  // AC-002: email routing — handler passes correct enquiryType to sendInvestorEmail
  it('calls sendInvestorEmail with Investment enquiryType', async () => {
    await handleInvestorForm(validBody);
    expect(mockSendEmail).toHaveBeenCalledWith(
      expect.objectContaining({ enquiryType: 'Investment' })
    );
  });

  it('calls sendInvestorEmail with Partnership enquiryType', async () => {
    await handleInvestorForm({ ...validBody, enquiryType: 'Partnership' });
    expect(mockSendEmail).toHaveBeenCalledWith(
      expect.objectContaining({ enquiryType: 'Partnership' })
    );
  });

  it('calls sendInvestorEmail with Media enquiryType', async () => {
    await handleInvestorForm({ ...validBody, enquiryType: 'Media' });
    expect(mockSendEmail).toHaveBeenCalledWith(expect.objectContaining({ enquiryType: 'Media' }));
  });

  it('calls sendInvestorEmail with Other enquiryType', async () => {
    await handleInvestorForm({ ...validBody, enquiryType: 'Other' });
    expect(mockSendEmail).toHaveBeenCalledWith(expect.objectContaining({ enquiryType: 'Other' }));
  });

  // AC-020: DB persistence with type = 'investor'
  it('persists submission to Strapi with type = investor', async () => {
    await handleInvestorForm(validBody);
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('/api/contact-submissions'),
      expect.objectContaining({ method: 'POST' })
    );
    const callBody = JSON.parse(mockFetch.mock.calls[0][1].body);
    expect(callBody.data.type).toBe('investor');
  });

  it('maps fullName to name in the Strapi payload', async () => {
    await handleInvestorForm(validBody);
    const callBody = JSON.parse(mockFetch.mock.calls[0][1].body);
    expect(callBody.data.name).toBe(validBody.fullName);
    expect(callBody.data.fullName).toBeUndefined();
  });

  it('puts organisation, role, enquiryType in metadata', async () => {
    await handleInvestorForm(validBody);
    const callBody = JSON.parse(mockFetch.mock.calls[0][1].body);
    expect(callBody.data.metadata).toEqual({
      organisation: validBody.organisation,
      role: validBody.role,
      enquiryType: validBody.enquiryType,
    });
  });

  // AC-003: enquiryType validation
  it('returns 422 when enquiryType is not a valid enum value', async () => {
    const result = await handleInvestorForm({ ...validBody, enquiryType: 'Venture' });
    expect(result.status).toBe(422);
    expect((result.body.fields as Record<string, string>).enquiryType).toBeDefined();
  });

  // AC-004: GDPR consent
  it('returns 422 when gdprConsent is false', async () => {
    const result = await handleInvestorForm({ ...validBody, gdprConsent: false });
    expect(result.status).toBe(422);
    expect(result.body).toMatchObject({ error: 'validation' });
    expect((result.body.fields as Record<string, string>).gdprConsent).toBeDefined();
  });

  it('returns 422 when gdprConsent is missing', async () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { gdprConsent, ...rest } = validBody;
    const result = await handleInvestorForm(rest);
    expect(result.status).toBe(422);
    expect((result.body.fields as Record<string, string>).gdprConsent).toBeDefined();
  });

  // AC-005: field-level validation
  it('returns 422 when email is malformed', async () => {
    const result = await handleInvestorForm({ ...validBody, email: 'not-an-email' });
    expect(result.status).toBe(422);
    expect((result.body.fields as Record<string, string>).email).toBeDefined();
  });

  it('returns 422 when fullName is empty', async () => {
    const result = await handleInvestorForm({ ...validBody, fullName: '' });
    expect(result.status).toBe(422);
    expect((result.body.fields as Record<string, string>).fullName).toBeDefined();
  });

  it('returns 422 when organisation is missing', async () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { organisation, ...rest } = validBody;
    const result = await handleInvestorForm(rest);
    expect(result.status).toBe(422);
    expect((result.body.fields as Record<string, string>).organisation).toBeDefined();
  });

  it('returns 422 when role is missing', async () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { role, ...rest } = validBody;
    const result = await handleInvestorForm(rest);
    expect(result.status).toBe(422);
    expect((result.body.fields as Record<string, string>).role).toBeDefined();
  });

  it('returns 422 with field-level errors for multiple failures', async () => {
    const result = await handleInvestorForm({
      fullName: '',
      email: 'bad',
      gdprConsent: false,
    });
    expect(result.status).toBe(422);
    const fields = result.body.fields as Record<string, string>;
    expect(fields.fullName).toBeDefined();
    expect(fields.email).toBeDefined();
    expect(fields.gdprConsent).toBeDefined();
  });

  // AC-006: email send failure — DB row already committed
  it('returns 500 send_failed when email throws — Strapi already saved', async () => {
    mockSendEmail.mockRejectedValue(new Error('Resend error'));
    const result = await handleInvestorForm(validBody);
    expect(result.status).toBe(500);
    expect(result.body).toEqual({ error: 'send_failed' });
    expect(mockFetch).toHaveBeenCalled();
  });

  // AC-007: DB failure — email not sent
  it('returns 500 db_failed when Strapi write fails — email not sent', async () => {
    mockFetch.mockResolvedValue({ ok: false, status: 500 });
    const result = await handleInvestorForm(validBody);
    expect(result.status).toBe(500);
    expect(result.body).toEqual({ error: 'db_failed' });
    expect(mockSendEmail).not.toHaveBeenCalled();
  });
});
