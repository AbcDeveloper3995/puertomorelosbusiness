import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET(request: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const placeId = params.id;
  
  try {
    // 1. Check if we already have reviews for this place in our DB
    const cachedLead = db.prepare('SELECT reviews_json FROM leads WHERE place_id = ?').get(placeId) as { reviews_json: string | null } | undefined;
    
    if (cachedLead && cachedLead.reviews_json) {
      return NextResponse.json({ source: 'cache', reviews: JSON.parse(cachedLead.reviews_json) });
    }

    // 2. Fetch from Google Places API
    const apiKey = process.env.GOOGLE_PLACES_API_KEY || process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    
    if (!apiKey || apiKey === 'INSERT_YOUR_API_KEY_HERE') {
      return NextResponse.json({ error: 'La clave API no está configurada' }, { status: 500 });
    }

    const response = await fetch(`https://places.googleapis.com/v1/places/${placeId}?fields=reviews`, {
      method: 'GET',
      headers: {
        'X-Goog-Api-Key': apiKey,
      }
    });

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.error?.message || 'Fallo al obtener reseñas');
    }

    const reviews = data.reviews || [];

    // 3. Save to DB
    const updateLead = db.prepare('UPDATE leads SET reviews_json = ? WHERE place_id = ?');
    updateLead.run(JSON.stringify(reviews), placeId);

    return NextResponse.json({ source: 'api', reviews });

  } catch (error: any) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
