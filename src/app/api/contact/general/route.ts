import { NextRequest, NextResponse } from 'next/server';
import { rateLimit, getClientIp } from '@/lib/rate-limit';
import { handleContactForm } from './handler';

const LIMIT = 10;

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

  const { status, body: responseBody } = await handleContactForm(body);
  return NextResponse.json(responseBody, { status, headers: rlHeaders });
}

export async function GET() {
  return NextResponse.json({ error: 'method_not_allowed' }, { status: 405 });
}
