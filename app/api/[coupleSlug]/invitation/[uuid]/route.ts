import { NextRequest, NextResponse } from 'next/server';
import { getInvitation } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ coupleSlug: string; uuid: string }> }
) {
  try {
    const { coupleSlug, uuid } = await params;
    const data = await getInvitation(coupleSlug, uuid);

    if (!data) {
      return NextResponse.json({ error: 'Invitación no encontrada' }, { status: 404 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching invitation:', error);
    return NextResponse.json({ error: 'Error del servidor' }, { status: 500 });
  }
}
