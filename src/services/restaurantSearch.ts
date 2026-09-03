import { CUISINE_OSM_PATTERN } from '../constants/cuisines';
import { CuisineId, Restaurant } from '../types';

// Public, free, keyless Overpass API mirrors. We try them in order in case
// one is temporarily overloaded — this is a shared community service, not a
// dedicated backend, so occasional slowness or downtime is expected.
const OVERPASS_ENDPOINTS = [
  'https://overpass-api.de/api/interpreter',
  'https://overpass.kumi.systems/api/interpreter',
];

interface SearchParams {
  latitude: number;
  longitude: number;
  radiusKm: number;
  cuisines: CuisineId[];
  maxResults: number;
}

export class RestaurantSearchError extends Error {}

function haversineMeters(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371000;
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}

function buildQuery({ latitude, longitude, radiusKm, cuisines }: SearchParams): string {
  const radiusMeters = Math.round(radiusKm * 1000);
  const around = `(around:${radiusMeters},${latitude},${longitude})`;
  const cuisineList = cuisines.length === 0 || cuisines.includes('any') ? (['any'] as CuisineId[]) : cuisines;

  const clauses = cuisineList.map((cuisine) => {
    const pattern = CUISINE_OSM_PATTERN[cuisine];
    if (!pattern) {
      // 'any', or a cuisine without a clean OSM tag: match any restaurant/cafe/fast food.
      return `node["amenity"~"restaurant|cafe|fast_food"]${around};`;
    }
    return `node["amenity"~"restaurant|cafe|fast_food"]["cuisine"~"${pattern}",i]${around};`;
  });

  return `[out:json][timeout:25];(${clauses.join('\n')});out body;`;
}

export async function searchRestaurants(params: SearchParams): Promise<Restaurant[]> {
  const query = buildQuery(params);
  let lastError: unknown;

  for (const endpoint of OVERPASS_ENDPOINTS) {
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `data=${encodeURIComponent(query)}`,
      });

      if (!response.ok) {
        throw new Error(`Overpass returned status ${response.status}`);
      }

      const json = await response.json();
      const elements: any[] = json.elements ?? [];

      const seen = new Set<string>();
      const results: Restaurant[] = [];

      for (const el of elements) {
        const name = el.tags?.name;
        if (!name || typeof el.lat !== 'number' || typeof el.lon !== 'number') continue;

        const id = `${el.type}/${el.id}`;
        if (seen.has(id)) continue;
        seen.add(id);

        const distanceMeters = haversineMeters(params.latitude, params.longitude, el.lat, el.lon);
        const address = [el.tags?.['addr:housenumber'], el.tags?.['addr:street']]
          .filter(Boolean)
          .join(' ');

        results.push({
          id,
          name,
          category: el.tags?.cuisine ?? el.tags?.amenity,
          latitude: el.lat,
          longitude: el.lon,
          address: address || undefined,
          distanceMeters,
        });
      }

      results.sort((a, b) => a.distanceMeters - b.distanceMeters);

      if (results.length === 0) {
        throw new RestaurantSearchError(
          'No restaurants found nearby. Try a bigger radius or a different cuisine.'
        );
      }

      return results.slice(0, params.maxResults);
    } catch (error) {
      lastError = error;
      if (error instanceof RestaurantSearchError) throw error;
      // Network or server error — fall through and try the next mirror.
    }
  }

  throw new RestaurantSearchError(
    lastError instanceof Error ? lastError.message : 'Could not reach the restaurant search service.'
  );
}
