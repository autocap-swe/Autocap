import { EntrepreneurSchema } from '@/lib/contact/schema';
import { sendEntrepreneurEmail } from '@/lib/contact/emailService';

const CMS_API_URL = process.env.CMS_API_URL ?? 'http://localhost:1337';

async function saveToStrapi(data: {
  name: string;
  email: string;
  message?: string;
  workshopName: string;
  cityRegion: string;
  revenue: string;
  phone: string;
}) {
  const token = process.env.STRAPI_API_TOKEN;
  const { name, email, message, workshopName, cityRegion, revenue, phone } = data;

  const res = await fetch(`${CMS_API_URL}/api/contact-submissions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({
      data: {
        name,
        email,
        message: message ?? '',
        gdprConsent: true,
        type: 'entrepreneur',
        metadata: { workshopName, cityRegion, revenue, phone },
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

export async function handleEntrepreneurForm(body: unknown): Promise<HandlerResult> {
  const result = EntrepreneurSchema.safeParse(body);
  if (!result.success) {
    const fields: Record<string, string> = {};
    for (const issue of result.error.issues) {
      const key = issue.path[0]?.toString() ?? 'unknown';
      fields[key] = issue.message;
    }
    return { status: 422, body: { error: 'validation', fields } };
  }

  const { name, email, message, workshopName, cityRegion, revenue, phone } = result.data;

  try {
    await saveToStrapi({ name, email, message, workshopName, cityRegion, revenue, phone });
  } catch (err) {
    console.error('[Entrepreneur] Strapi save failed:', err);
    return { status: 500, body: { error: 'db_failed' } };
  }

  try {
    await sendEntrepreneurEmail({ name, email, message, workshopName, cityRegion, revenue, phone });
  } catch (err) {
    console.error('[Entrepreneur] Email send failed:', err);
    return { status: 500, body: { error: 'send_failed' } };
  }

  return { status: 200, body: { success: true } };
}
