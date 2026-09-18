import { NextRequest, NextResponse } from 'next/server';
import { authenticateUser, getCoupleBySlug } from '@/lib/db';
import type { AuthSession } from '@/lib/types';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ coupleSlug: string }> }
) {
  try {
    const { coupleSlug } = await params;
    const body = await request.json();
    const { username, password } = body;

    if (!password) {
      return NextResponse.json(
        { error: 'Por favor ingresa la contraseña' },
        { status: 400 }
      );
    }

    const couple = await getCoupleBySlug(coupleSlug);
    if (!couple) {
      return NextResponse.json(
        { error: 'Boda no encontrada' },
        { status: 404 }
      );
    }

    // Default username to coupleSlug if not provided
    const userToAuth = username && username.trim() !== '' ? username.trim() : coupleSlug;

    const authResult = await authenticateUser(userToAuth, password, coupleSlug);

    if (!authResult.success || !authResult.user) {
      return NextResponse.json(
        { error: authResult.error || 'Credenciales inválidas' },
        { status: 401 }
      );
    }

    const user = authResult.user;
    const sessionData: AuthSession = {
      userId: user.id,
      username: user.username,
      name: user.name,
      role: user.role,
      coupleId: couple.id,
      coupleSlug: couple.slug,
    };

    const sessionString = Buffer.from(JSON.stringify(sessionData)).toString('base64');

    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        name: user.name,
        role: user.role,
      },
    });

    // Set HTTP-only session cookie
    response.cookies.set({
      name: `auth_session_${coupleSlug}`,
      value: sessionString,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });

    return response;
  } catch (error) {
    console.error('Error during login:', error);
    return NextResponse.json(
      { error: 'Ocurrió un error en el servidor' },
      { status: 500 }
    );
  }
}
