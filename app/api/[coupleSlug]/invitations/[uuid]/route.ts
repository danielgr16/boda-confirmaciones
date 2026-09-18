import { NextRequest, NextResponse } from 'next/server';
import { getInvitation, updateInvitationGroup, deleteInvitationGroup } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ coupleSlug: string; uuid: string }> }
) {
  try {
    const { coupleSlug, uuid } = await params;
    const invitation = await getInvitation(coupleSlug, uuid);

    if (!invitation) {
      return NextResponse.json({ error: 'Invitación no encontrada' }, { status: 404 });
    }

    return NextResponse.json(invitation);
  } catch (error) {
    console.error('Error getting single invitation:', error);
    return NextResponse.json({ error: 'Error del servidor' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ coupleSlug: string; uuid: string }> }
) {
  try {
    const { coupleSlug, uuid } = await params;
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

    const result = await updateInvitationGroup(coupleSlug, uuid, {
      group_name: body.group_name,
      titular_name: body.titular_name,
      new_uuid: body.uuid || body.new_uuid,
      is_couple: body.is_couple,
      is_guard: body.is_guard,
      kids_count: body.kids_count,
      message: body.message,
      guests: body.guests,
    });

    if (!result.success) {
      return NextResponse.json({ error: result.error || 'No se pudo actualizar la invitación' }, { status: 400 });
    }

    return NextResponse.json({ success: true, group: result.group });
  } catch (error) {
    console.error('Error updating invitation:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ coupleSlug: string; uuid: string }> }
) {
  try {
    const { coupleSlug, uuid } = await params;
    const result = await deleteInvitationGroup(coupleSlug, uuid);

    if (!result.success) {
      return NextResponse.json({ error: result.error || 'No se pudo eliminar la invitación' }, { status: 400 });
    }

    return NextResponse.json({ success: true, message: 'Invitación eliminada correctamente' });
  } catch (error) {
    console.error('Error deleting invitation:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
