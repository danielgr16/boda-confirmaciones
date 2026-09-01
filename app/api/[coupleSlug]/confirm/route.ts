import { NextRequest, NextResponse } from 'next/server';
import { updateConfirmation } from '@/lib/db';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ coupleSlug: string }> }
) {
  try {
    const { coupleSlug } = await params;
    const body = await request.json();

    const { uuid, nombre, tipo, asistencia, mensaje } = body;

    if (!uuid || !nombre) {
      return NextResponse.json({ error: 'Datos incompletos' }, { status: 400 });
    }

    const success = await updateConfirmation(coupleSlug, uuid, nombre, tipo || 'principal', asistencia, mensaje);

    if (!success) {
      return NextResponse.json({ error: 'No se pudo actualizar la confirmación' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error confirming guest:', error);
    return NextResponse.json({ error: 'Error del servidor' }, { status: 500 });
  }
}
