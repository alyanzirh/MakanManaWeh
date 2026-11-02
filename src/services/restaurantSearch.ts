import { Platform } from 'react-native';
import { CUISINE_PLACE_TYPES } from '../constants/cuisines';
import { CuisineId, Restaurant } from '../types';

const PLACES_NEARBY_URL = 'https://places.googleapis.com/v1/places:searchNearby';
const REQUEST_TIMEOUT_MS = 15000;
// Nearby Search returns at most 20 places per request, and the radius at most 50 km.
const MAX_RESULTS_PER_REQUEST = 20;
const MAX_RADIUS_METERS = 50000;

// Only Pro-tier fields (id, name, address, location, type label) — adding
// rating/opening hours/price level would bump the request into the pricier
// Enterprise SKU, which has a much smaller free monthly allowance.
const FIELD_MASK = 'places.id,places.displayName,places.formattedAddress,places.location,places.primaryTypeDisplayName';

// The API key is restricted to this Android app, so Android requests must say
// which app they come from (iOS/other requests are not restricted).
const ANDROID_PACKAGE = 'com.anmsarchives.makanmanaweh';
const ANDROID_CERT_SHA1 = '7B3C2C21B9C20EBAB5274D28B2BDAC07D1AC489C';

interface SearchParams {
  latitude: number;
  longitude: number;
  radiusKm: number;
  cuisines: CuisineId[];
  maxResults: number;
}

interface PlacesResponse {
  places?: {
    id?: string;
    displayName?: { text?: string };
    formattedAddress?: string;
    location?: { latitude?: number; longitude?: number };
    primaryTypeDisplayName?: { text?: string };
  }[];
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

function placeTypesFor(cuisines: CuisineId[]): string[] {
  const ids = cuisines.length === 0 || cuisines.includes('any') ? (['any'] as CuisineId[]) : cuisines;
  return Array.from(new Set(ids.flatMap((id) => CUISINE_PLACE_TYPES[id])));
}

export async function searchRestaurants(params: SearchParams): Promise<Restaurant[]> {
  const apiKey = process.env.EXPO_PUBLIC_GOOGLE_PLACES_API_KEY;
  if (!apiKey) {
    throw new RestaurantSearchError('The restaurant search is not configured (missing API key).');
  }

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'X-Goog-Api-Key': apiKey,
    'X-Goog-FieldMask': FIELD_MASK,
  };
  if (Platform.OS === 'android') {
    headers['X-Android-Package'] = ANDROID_PACKAGE;
    headers['X-Android-Cert'] = ANDROID_CERT_SHA1;
  }

  const body = {
    includedTypes: placeTypesFor(params.cuisines),
    maxResultCount: Math.min(params.maxResults, MAX_RESULTS_PER_REQUEST),
    rankPreference: 'DISTANCE',
    locationRestriction: {
      circle: {
        center: { latitude: params.latitude, longitude: params.longitude },
        radius: Math.min(params.radiusKm * 1000, MAX_RADIUS_METERS),
      },
    },
  };

  // A request that never answers would leave the Loading screen spinning
  // forever, so give up after a fixed time and surface it as an error.
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  let response: Response;
  try {
    response = await fetch(PLACES_NEARBY_URL, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
      signal: controller.signal,
    });
  } catch (error) {
    throw new RestaurantSearchError(
      controller.signal.aborted
        ? 'The restaurant search timed out. Check your connection and try again.'
        : 'Could not reach the restaurant search service. Check your connection and try again.'
    );
  } finally {
    clearTimeout(timeout);
  }

  if (!response.ok) {
    throw new RestaurantSearchError(
      response.status === 429
        ? 'The restaurant search is busy right now. Please try again in a bit.'
        : `The restaurant search failed (status ${response.status}).`
    );
  }

  const json: PlacesResponse = await response.json();

  const results: Restaurant[] = [];
  for (const place of json.places ?? []) {
    const name = place.displayName?.text;
    const lat = place.location?.latitude;
    const lon = place.location?.longitude;
    if (!place.id || !name || typeof lat !== 'number' || typeof lon !== 'number') continue;

    results.push({
      id: place.id,
      name,
      category: place.primaryTypeDisplayName?.text,
      latitude: lat,
      longitude: lon,
      address: place.formattedAddress || undefined,
      distanceMeters: haversineMeters(params.latitude, params.longitude, lat, lon),
    });
  }

  if (results.length === 0) {
    throw new RestaurantSearchError('No restaurants found nearby. Try a bigger radius or a different cuisine.');
  }

  results.sort((a, b) => a.distanceMeters - b.distanceMeters);
  return results.slice(0, params.maxResults);
}
