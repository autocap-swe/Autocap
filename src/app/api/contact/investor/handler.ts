import { InvestorSchema } from '@/lib/contact/schema';
import { sendInvestorEmail } from '@/lib/contact/emailService';

const CMS_API_URL = process.env.CMS_API_URL ?? 'http://localhost:1337';

async function saveToStrapi(data: {
  fullName: string;
  email: string;
  message?: string;
  organisation: string;
  role: string;
  enquiryType: string;
}) {
  const token = process.env.STRAPI_API_TOKEN;
  const { fullName, email, message, organisation, role, enquiryType } = data;

  const res = await fetch(`${CMS_API_URL}/api/contact-submissions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({
      data: {
        name: fullName,
        email,
        message: message ?? '',
        gdprConsent: true,
        type: 'investor',
        metadata: { organisation, role, enquiryType },
      },
    }),
  });

  if (!res.ok) {
    throw new Error(`Strapi responded with ${res.status}`);
  }
}

export interface HandlerResult {
  status: number;
  body: Record<string, unknown>;
}

export async function handleInvestorForm(body: unknown): Promise<HandlerResult> {
  const result = InvestorSchema.safeParse(body);
  if (!result.success) {
    const fields: Record<string, string> = {};
    for (const issue of result.error.issues) {
      const key = issue.path[0]?.toString() ?? 'unknown';
      fields[key] = issue.message;
    }
    return { status: 422, body: { error: 'validation', fields } };
  }

  const { fullName, email, message, organisation, role, enquiryType } = result.data;

  try {
    await saveToStrapi({ fullName, email, message, organisation, role, enquiryType });
  } catch (err) {
    console.error('[Investor] Strapi save failed:', err);
    return { status: 500, body: { error: 'db_failed' } };
  }

  try {
    await sendInvestorEmail({ fullName, email, message, organisation, role, enquiryType });
  } catch (err) {
    console.error('[Investor] Email send failed:', err);
    return { status: 500, body: { error: 'send_failed' } };
  }

  return { status: 200, body: { success: true } };
}
