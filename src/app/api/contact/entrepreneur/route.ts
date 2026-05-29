import { NextRequest, NextResponse } from 'next/server';
import { rateLimit, getClientIp } from '@/lib/rate-limit';
import { verifyTurnstileToken } from '@/lib/captcha/turnstile';
import { handleEntrepreneurForm } from './handler';
import { logRequest } from '@/lib/logger';

const LIMIT = 5;

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  const rl = rateLimit(ip, LIMIT);

  const rlHeaders = {
    'X-RateLimit-Limit': String(rl.limit),
    'X-RateLimit-Remaining': String(rl.remaining),
  };

  if (!rl.success) {
    return NextResponse.json(
      { error: 'too_many_requests', retryAfter: rl.retryAfter },
      { status: 429, headers: { ...rlHeaders, 'Retry-After': String(rl.retryAfter) } }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'invalid_json' }, { status: 400, headers: rlHeaders });
  }

  const token = (body as Record<string, unknown>)?.cfTurnstileToken;
  if (!token || typeof token !== 'string') {
    return NextResponse.json({ error: 'invalid_captcha' }, { status: 403, headers: rlHeaders });
  }

  try {
    const valid = await verifyTurnstileToken(token);
    if (!valid) {
      return NextResponse.json({ error: 'invalid_captcha' }, { status: 403, headers: rlHeaders });
    }
  } catch {
    return NextResponse.json(
      { error: 'captcha_misconfigured' },
      { status: 500, headers: rlHeaders }
    );
  }

  const { status, body: responseBody } = await handleEntrepreneurForm(body);
  logRequest(request, status, { event: 'contact_form', form: 'entrepreneur' });
  return NextResponse.json(responseBody, { status, headers: rlHeaders });
}

export async function GET() {
  return NextResponse.json({ error: 'method_not_allowed' }, { status: 405 });
}
