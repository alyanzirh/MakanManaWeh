import { CuisineId, CuisineOption } from '../types';

export const CUISINE_OPTIONS: CuisineOption[] = [
  { id: 'any', label: 'Any', icon: '🍽️' },
  { id: 'western', label: 'Western', icon: '🍔' },
  { id: 'seafood', label: 'Seafood', icon: '🐟' },
  { id: 'cafe', label: 'Cafe', icon: '☕' },
  { id: 'japanese', label: 'Japanese', icon: '🍣' },
  { id: 'chinese', label: 'Chinese', icon: '🥡' },
  { id: 'italian', label: 'Italian', icon: '🍝' },
  { id: 'indian', label: 'Indian', icon: '🍛' },
  { id: 'malay', label: 'Malay', icon: '🍢' },
  { id: 'fastFood', label: 'Fast Food', icon: '🍟' },
  { id: 'dessert', label: 'Dessert', icon: '🍰' },
];

/**
 * Best-effort mapping to OpenStreetMap's freeform `cuisine` tag values.
 * OSM has no formal cuisine taxonomy, so these are regex-style alternations
 * matched case-insensitively — a reasonable approximation, not a guarantee.
 * 'cafe' and 'fastFood' are handled separately in restaurantSearch.ts via
 * the `amenity` tag instead, since those map more reliably that way.
 */
export const CUISINE_OSM_PATTERN: Partial<Record<CuisineId, string>> = {
  western: 'american|international|steak_house|burger|western',
  seafood: 'seafood|fish',
  japanese: 'japanese|sushi|ramen',
  chinese: 'chinese|dim_sum|cantonese',
  italian: 'italian|pizza',
  indian: 'indian',
  malay: 'malaysian|malay',
  dessert: 'dessert|cake|ice_cream',
};
