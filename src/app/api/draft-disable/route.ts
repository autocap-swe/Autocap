import { draftMode } from 'next/headers';
import { redirect } from 'next/navigation';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const draft = await draftMode();
  draft.disable();
  const redirectTo = request.nextUrl.searchParams.get('redirectTo') ?? '/';
  redirect(redirectTo);
}
