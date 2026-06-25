import { NextResponse } from 'next/server';
import db from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const savedLeads = db.prepare('SELECT * FROM leads WHERE is_saved = 1 ORDER BY id DESC').all();
    return NextResponse.json({ data: savedLeads });
  } catch (error: any) {
    console.error('Error fetching saved leads:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
