import { NextRequest, NextResponse } from 'next/server';
import type { AuthSession } from '@/lib/types';
import { getCoupleBySlug } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ coupleSlug: string }> }
) {
  try {
    const { coupleSlug } = await params;
    const cookie =
      request.cookies.get(`auth_session_${coupleSlug}`) ||
      request.cookies.get('auth_session');

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

    if (session.coupleSlug !== coupleSlug && session.role !== 'admin') {
      return NextResponse.json({ authenticated: false }, { status: 403 });
    }

    const couple = await getCoupleBySlug(coupleSlug);

    return NextResponse.json({
      authenticated: true,
      user: {
        id: session.userId,
        username: session.username,
        name: session.name,
        role: session.role,
      },
      couple: couple
        ? {
            slug: couple.slug,
            bride_name: couple.bride_name,
            groom_name: couple.groom_name,
            event_date: couple.event_date,
            config: couple.config,
          }
        : null,
    });
  } catch (error) {
    console.error('Error fetching session:', error);
    return NextResponse.json({ authenticated: false, error: 'Server error' }, { status: 500 });
  }
}
