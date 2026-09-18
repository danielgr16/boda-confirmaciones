import { NextRequest, NextResponse } from 'next/server';
import { getTableData, createInvitationGroup } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ coupleSlug: string }> }
) {
  try {
    const { coupleSlug } = await params;
    const data = await getTableData(coupleSlug);
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching invitations list:', error);
    return NextResponse.json({ error: 'Error del servidor' }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ coupleSlug: string }> }
) {
  try {
    const { coupleSlug } = await params;
    const body = await request.json();

    if (!body.group_name || body.group_name.trim() === '') {
      return NextResponse.json(
        { error: 'El nombre de la familia o grupo es obligatorio' },
        { status: 400 }
      );
    }

    if (!body.guests || !Array.isArray(body.guests) || body.guests.length === 0) {
      return NextResponse.json(
        { error: 'Debes incluir al menos un invitado en la invitación' },
        { status: 400 }
      );
    }

    const result = await createInvitationGroup(coupleSlug, {
      group_name: body.group_name,
      titular_name: body.titular_name,
      uuid: body.uuid,
      is_couple: body.is_couple,
      is_guard: body.is_guard,
      kids_count: body.kids_count,
      message: body.message,
      guests: body.guests,
    });

    if (!result.success) {
      return NextResponse.json({ error: result.error || 'No se pudo crear la invitación' }, { status: 400 });
    }

    return NextResponse.json({ success: true, group: result.group }, { status: 201 });
  } catch (error) {
    console.error('Error creating invitation:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
