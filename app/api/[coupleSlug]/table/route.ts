import { NextRequest, NextResponse } from 'next/server';
import { getTableData } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ coupleSlug: string }> }
) {
  try {
    const { coupleSlug } = await params;
    const data = await getTableData(coupleSlug);
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching table data:', error);
    return NextResponse.json({ error: 'Error del servidor' }, { status: 500 });
  }
}
