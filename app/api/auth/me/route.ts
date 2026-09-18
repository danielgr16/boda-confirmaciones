import { NextRequest, NextResponse } from 'next/server';
import type { AuthSession } from '@/lib/types';
import { getCoupleBySlug, getCoupleById } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const cookie = request.cookies.get('auth_session');

    if (!cookie || !cookie.value) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    let session: AuthSession;
    try {
      const decoded = Buffer.from(cookie.value, 'base64').toString('utf-8');
      session = JSON.parse(decoded);
    } catch {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    const couple = session.coupleSlug
      ? await getCoupleBySlug(session.coupleSlug)
      : await getCoupleById(session.coupleId);

    return NextResponse.json({
      authenticated: true,
      user: {
        id: session.userId,
        username: session.username,
        name: session.name,
        role: session.role,
      },
      coupleSlug: session.coupleSlug,
      couple: couple
        ? {
            slug: couple.slug,
            bride_name: couple.bride_name,
            groom_name: couple.groom_name,
            event_date: couple.event_date,
            config: couple.config,
          }
        : null,
      redirectUrl: `/${session.coupleSlug}/admin`,
    });
  } catch (error) {
    console.error('Error fetching global session:', error);
    return NextResponse.json({ authenticated: false, error: 'Server error' }, { status: 500 });
  }
}
