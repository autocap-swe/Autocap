import { ContactSchema } from '@/lib/contact/schema';
import { sendContactEmail } from '@/lib/contact/emailService';

const CMS_API_URL = process.env.CMS_API_URL ?? 'http://localhost:1337';

async function saveToStrapi(data: {
  name: string;
  email: string;
  subject?: string;
  message: string;
}) {
  const token = process.env.STRAPI_API_TOKEN;
  const res = await fetch(`${CMS_API_URL}/api/contact-submissions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ data: { ...data, gdprConsent: true } }),
  });

  if (!res.ok) {
    throw new Error(`Strapi responded with ${res.status}`);
  }
}

export interface HandlerResult {
  status: number;
  body: Record<string, unknown>;
}

export async function handleContactForm(body: unknown): Promise<HandlerResult> {
  const result = ContactSchema.safeParse(body);
  if (!result.success) {
    const fields: Record<string, string> = {};
    for (const issue of result.error.issues) {
      const key = issue.path[0]?.toString() ?? 'unknown';
      fields[key] = issue.message;
    }
    return { status: 422, body: { error: 'validation', fields } };
  }

  const { name, email, subject, message } = result.data;

  try {
    await saveToStrapi({ name, email, subject, message });
  } catch (err) {
    console.error('[Contact] Strapi save failed:', err);
    return { status: 500, body: { error: 'db_failed' } };
  }

  try {
    await sendContactEmail({ name, email, subject, message });
  } catch (err) {
    console.error('[Contact] Email send failed:', err);
    return { status: 500, body: { error: 'send_failed' } };
  }

  return { status: 200, body: { success: true } };
}
