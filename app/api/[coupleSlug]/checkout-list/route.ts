import { NextRequest, NextResponse } from 'next/server';
import { getCheckoutData } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ coupleSlug: string }> }
) {
  try {
    const { coupleSlug } = await params;
    const data = await getCheckoutData(coupleSlug);
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching checkout data:', error);
    return NextResponse.json({ error: 'Error del servidor' }, { status: 500 });
  }
}
