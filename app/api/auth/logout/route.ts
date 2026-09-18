import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const response = NextResponse.json({ success: true, message: 'Sesión cerrada correctamente' });

    // Clear global cookie
    response.cookies.delete('auth_session');

    // Also clear known couple cookies
    const allCookies = request.cookies.getAll();
    for (const c of allCookies) {
      if (c.name.startsWith('auth_session_')) {
        response.cookies.delete(c.name);
      }
    }

    return response;
  } catch (error) {
    console.error('Error during global logout:', error);
    return NextResponse.json(
      { error: 'Error al cerrar sesión' },
      { status: 500 }
    );
  }
}
