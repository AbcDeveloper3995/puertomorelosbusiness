import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { calculatePotential, PlaceData } from '@/lib/scoring';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category') || 'Restaurantes';
  const forceRefresh = searchParams.get('refresh') === 'true';

  const query = `${category} en Puerto Morelos, Quintana Roo`;

  try {
    // 1. Check Cache
    if (!forceRefresh) {
      const cachedSearch = db.prepare('SELECT id FROM searches WHERE category = ? ORDER BY timestamp DESC LIMIT 1').get(category) as { id: number } | undefined;
      
      if (cachedSearch) {
        const cachedLeads = db.prepare('SELECT * FROM leads WHERE search_id = ?').all(cachedSearch.id);
        if (cachedLeads.length > 0) {
          return NextResponse.json({ source: 'cache', data: cachedLeads });
        }
      }
    }

    // 2. Fetch from Google Places API (New)
    console.log("PLACES KEY:", process.env.GOOGLE_PLACES_API_KEY);
    console.log("MAPS KEY:", process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY);
    const apiKey = process.env.GOOGLE_PLACES_API_KEY || process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    
    if (!apiKey || apiKey === 'INSERT_YOUR_API_KEY_HERE') {
      return NextResponse.json({ error: 'La clave API no está configurada en .env.local' }, { status: 500 });
    }

    const response = await fetch('https://places.googleapis.com/v1/places:searchText', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': apiKey,
        'X-Goog-FieldMask': 'places.id,places.displayName,places.formattedAddress,places.nationalPhoneNumber,places.rating,places.userRatingCount,places.websiteUri,places.primaryType,places.googleMapsUri,places.photos,places.location'
      },
      body: JSON.stringify({
        textQuery: query,
        languageCode: 'es',
        locationBias: {
          circle: {
            center: { latitude: 20.8459, longitude: -86.8756 },
            radius: 5000.0 // 5km radius around Puerto Morelos
          }
        }
      })
    });

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.error?.message || 'Fallo al buscar lugares en Google Places');
    }

    const places = data.places || [];

    // 3. Save Search and Leads to DB
    const insertSearch = db.prepare('INSERT INTO searches (query, category) VALUES (?, ?)');
    const searchResult = insertSearch.run(query, category);
    const searchId = searchResult.lastInsertRowid;

    const insertLead = db.prepare(`
      INSERT INTO leads (
        search_id, place_id, name, address, phone, rating, user_ratings_total, google_maps_url, website, category, potential_level, photo_url, lat, lng, reviews_json
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(place_id) DO UPDATE SET
        search_id=excluded.search_id,
        name=excluded.name,
        address=excluded.address,
        phone=excluded.phone,
        rating=excluded.rating,
        user_ratings_total=excluded.user_ratings_total,
        google_maps_url=excluded.google_maps_url,
        website=excluded.website,
        category=excluded.category,
        potential_level=excluded.potential_level,
        photo_url=excluded.photo_url,
        lat=excluded.lat,
        lng=excluded.lng,
        reviews_json=excluded.reviews_json
    `);

    const insertMany = db.transaction((placesList) => {
      const processed = [];
      for (const p of placesList) {
        const placeData: PlaceData = {
          place_id: p.id,
          name: p.displayName?.text || '',
          website: p.websiteUri || '',
          user_ratings_total: p.userRatingCount || 0,
          rating: p.rating || 0,
        };
        const potential = calculatePotential(placeData);
        
        const photoUrl = p.photos && p.photos.length > 0 ? p.photos[0].name : '';

        const leadObj = {
          search_id: searchId,
          place_id: p.id,
          name: p.displayName?.text || '',
          address: p.formattedAddress || '',
          phone: p.nationalPhoneNumber || '',
          rating: p.rating || 0,
          user_ratings_total: p.userRatingCount || 0,
          google_maps_url: p.googleMapsUri || '',
          website: p.websiteUri || '',
          category: p.primaryType || category,
          potential_level: potential,
          photo_url: photoUrl,
          lat: p.location?.latitude || null,
          lng: p.location?.longitude || null,
          reviews_json: p.reviews ? JSON.stringify(p.reviews) : null
        };
        
        insertLead.run(
          leadObj.search_id, leadObj.place_id, leadObj.name, leadObj.address, leadObj.phone,
          leadObj.rating, leadObj.user_ratings_total, leadObj.google_maps_url, leadObj.website,
          leadObj.category, leadObj.potential_level, leadObj.photo_url, leadObj.lat, leadObj.lng, leadObj.reviews_json
        );
        processed.push(leadObj);
      }
      return processed;
    });

    const savedLeads = insertMany(places);
    
    // Recuperar los leads actualizados de la base de datos para incluir status, notes y email
    const actualLeads = db.prepare('SELECT * FROM leads WHERE search_id = ?').all(searchId);

    return NextResponse.json({ source: 'api', data: actualLeads });

  } catch (error: any) {
    console.error('Error al buscar prospectos:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
