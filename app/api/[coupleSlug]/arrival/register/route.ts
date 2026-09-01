import { NextRequest, NextResponse } from 'next/server';
import { updateArrival } from '@/lib/db';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ coupleSlug: string }> }
) {
  try {
    const { coupleSlug } = await params;
    const body = await request.json();

    const { uuid, nombre, tipo, llegada } = body;

    if (!uuid || !nombre) {
      return NextResponse.json({ error: 'Datos incompletos' }, { status: 400 });
    }

    const success = await updateArrival(coupleSlug, uuid, nombre, tipo || 'principal', Boolean(llegada));

    if (!success) {
      return NextResponse.json({ error: 'No se pudo registrar la llegada' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error registering arrival:', error);
    return NextResponse.json({ error: 'Error del servidor' }, { status: 500 });
  }
}
