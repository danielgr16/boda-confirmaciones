import { NextRequest, NextResponse } from 'next/server';
import { getCoupleBySlug } from '@/lib/db';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ coupleSlug: string }> }
) {
  try {
    const { coupleSlug } = await params;
    const body = await request.json();
    const { password } = body;

    const couple = await getCoupleBySlug(coupleSlug);
    const validPassword = couple?.access_password || 'boda2026';

    if (password === validPassword) {
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ success: false, message: 'Contraseña incorrecta' }, { status: 401 });
  } catch (error) {
    console.error('Error checking password:', error);
    return NextResponse.json({ error: 'Error del servidor' }, { status: 500 });
  }
}
