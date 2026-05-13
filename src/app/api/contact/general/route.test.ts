import { handleContactForm } from './handler';

jest.mock('@/lib/contact/emailService', () => ({
  sendContactEmail: jest.fn(),
}));

import { sendContactEmail } from '@/lib/contact/emailService';
const mockSendEmail = sendContactEmail as jest.MockedFunction<typeof sendContactEmail>;

const mockFetch = jest.fn();
global.fetch = mockFetch;

const validBody = {
  name: 'Anna Lindqvist',
  email: 'anna@example.com',
  message: 'Hello, I have a question.',
  gdprConsent: true,
};

beforeEach(() => {
  jest.clearAllMocks();
  mockFetch.mockResolvedValue({ ok: true, json: async () => ({ data: { id: 1 } }) });
  mockSendEmail.mockResolvedValue(undefined);
});

describe('handleContactForm', () => {
  it('returns 200 on valid submission', async () => {
    const result = await handleContactForm(validBody);
    expect(result.status).toBe(200);
    expect(result.body).toEqual({ success: true });
  });

  it('calls Strapi with correct data', async () => {
    await handleContactForm(validBody);
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('/api/contact-submissions'),
      expect.objectContaining({ method: 'POST' })
    );
  });

  it('calls sendContactEmail with correct data', async () => {
    await handleContactForm(validBody);
    expect(mockSendEmail).toHaveBeenCalledWith({
      name: validBody.name,
      email: validBody.email,
      message: validBody.message,
    });
  });

  it('returns 422 when gdprConsent is false', async () => {
    const result = await handleContactForm({ ...validBody, gdprConsent: false });
    expect(result.status).toBe(422);
    expect(result.body).toMatchObject({ error: 'validation' });
    expect((result.body.fields as Record<string, string>).gdprConsent).toBeDefined();
  });

  it('returns 422 when email is invalid', async () => {
    const result = await handleContactForm({ ...validBody, email: 'bad-email' });
    expect(result.status).toBe(422);
    expect((result.body.fields as Record<string, string>).email).toBeDefined();
  });

  it('returns 422 when name is empty', async () => {
    const result = await handleContactForm({ ...validBody, name: '' });
    expect(result.status).toBe(422);
    expect((result.body.fields as Record<string, string>).name).toBeDefined();
  });

  it('returns 422 when message is empty', async () => {
    const result = await handleContactForm({ ...validBody, message: '' });
    expect(result.status).toBe(422);
    expect((result.body.fields as Record<string, string>).message).toBeDefined();
  });

  it('returns 500 db_failed when Strapi save fails — email not sent', async () => {
    mockFetch.mockResolvedValue({ ok: false, status: 500 });
    const result = await handleContactForm(validBody);
    expect(result.status).toBe(500);
    expect(result.body).toEqual({ error: 'db_failed' });
    expect(mockSendEmail).not.toHaveBeenCalled();
  });

  it('returns 500 send_failed when email throws — Strapi already saved', async () => {
    mockSendEmail.mockRejectedValue(new Error('SMTP error'));
    const result = await handleContactForm(validBody);
    expect(result.status).toBe(500);
    expect(result.body).toEqual({ error: 'send_failed' });
    expect(mockFetch).toHaveBeenCalled();
  });
});
