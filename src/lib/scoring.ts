export type PotentialLevel = 'HIGH' | 'MEDIUM' | 'LOW';

export interface PlaceData {
  place_id: string;
  name: string;
  vicinity?: string; // mapped to address
  formatted_phone_number?: string;
  rating?: number;
  user_ratings_total?: number;
  url?: string; // google maps url
  website?: string;
  types?: string[];
  photos?: any[];
}

export function calculatePotential(place: PlaceData): PotentialLevel {
  const hasWebsite = !!place.website && place.website.trim() !== '';
  const reviewsCount = place.user_ratings_total || 0;
  const rating = place.rating || 0;

  // HIGH POTENTIAL: No website AND (small scale, e.g., reviews < 50)
  if (!hasWebsite && reviewsCount < 50) {
    return 'HIGH';
  }

  // HIGH POTENTIAL: No website but active business (just a solid lead)
  if (!hasWebsite && reviewsCount >= 50 && reviewsCount < 200) {
    return 'HIGH';
  }

  // MEDIUM POTENTIAL: No website but huge review count (might be hard to sell or already established)
  if (!hasWebsite && reviewsCount >= 200) {
    return 'MEDIUM';
  }

  // MEDIUM POTENTIAL: Has website, but poor reviews or very few reviews (needs help)
  if (hasWebsite && (reviewsCount < 20 || rating < 3.5)) {
    return 'MEDIUM';
  }

  // LOW POTENTIAL: Has website, good rating, good amount of reviews
  return 'LOW';
}
