import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id;
    const body = await request.json();
    
    // Solo permitimos actualizar status y notes
    if (body.status !== undefined || body.notes !== undefined) {
      const updates = [];
      const values = [];
      
      if (body.status !== undefined) {
        updates.push('status = ?');
        values.push(body.status);
      }
      
      if (body.notes !== undefined) {
        updates.push('notes = ?');
        values.push(body.notes);
      }
      
      if (updates.length > 0) {
        values.push(id);
        const query = `UPDATE leads SET ${updates.join(', ')} WHERE id = ?`;
        db.prepare(query).run(...values);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error al actualizar prospecto:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
