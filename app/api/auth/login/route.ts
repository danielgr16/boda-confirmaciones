import { NextRequest, NextResponse } from 'next/server';
import { authenticateUser, getCoupleById, getCoupleBySlug } from '@/lib/db';
import type { AuthSession } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password } = body;

    if (!username || username.trim() === '') {
      return NextResponse.json(
        { error: 'Por favor ingresa tu usuario o identificador de boda' },
        { status: 400 }
      );
    }

    if (!password || password.trim() === '') {
      return NextResponse.json(
        { error: 'Por favor ingresa tu contraseña' },
        { status: 400 }
      );
    }

    // 1. Authenticate user globally
    const authResult = await authenticateUser(username.trim(), password.trim());

    if (!authResult.success || !authResult.user) {
      return NextResponse.json(
        { error: authResult.error || 'Credenciales inválidas' },
        { status: 401 }
      );
    }

    const user = authResult.user;

    // 2. Lookup couple
    let couple = await getCoupleById(user.couple_id);
    if (!couple && user.username) {
      couple = await getCoupleBySlug(user.username);
    }

    if (!couple) {
      return NextResponse.json(
        { error: 'No se encontró la boda asociada a esta cuenta' },
        { status: 404 }
      );
    }

    // 3. Create Session
    const sessionData: AuthSession = {
      userId: user.id,
      username: user.username,
      name: user.name,
      role: user.role,
      coupleId: couple.id,
      coupleSlug: couple.slug,
    };

    const sessionString = Buffer.from(JSON.stringify(sessionData)).toString('base64');
    const redirectUrl = `/${couple.slug}/admin`;

    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        name: user.name,
        role: user.role,
      },
      coupleSlug: couple.slug,
      coupleName: `${couple.bride_name} & ${couple.groom_name}`,
      redirectUrl,
    });

    // Set Global auth_session cookie
    response.cookies.set({
      name: 'auth_session',
      value: sessionString,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });

    // Also set specific couple session cookie for backward compatibility
    response.cookies.set({
      name: `auth_session_${couple.slug}`,
      value: sessionString,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 30,
    });

    return response;
  } catch (error) {
    console.error('Error during global login:', error);
    return NextResponse.json(
      { error: 'Ocurrió un error en el servidor' },
      { status: 500 }
    );
  }
}
