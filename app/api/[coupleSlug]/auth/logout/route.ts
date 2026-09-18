import { NextRequest, NextResponse } from 'next/server';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ coupleSlug: string }> }
) {
  try {
    const { coupleSlug } = await params;
    const response = NextResponse.json({ success: true, message: 'Sesión cerrada' });

    // Delete session cookie
    response.cookies.delete(`auth_session_${coupleSlug}`);
    return response;
  } catch (error) {
    console.error('Error during logout:', error);
    return NextResponse.json(
      { error: 'Error al cerrar sesión' },
      { status: 500 }
    );
  }
}
