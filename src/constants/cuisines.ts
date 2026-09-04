import { CuisineId, CuisineOption } from '../types';

// "Any" leads (it's both the wildcard/no-preference option and the actual
// default filter value); the specific cuisines follow alphabetically.
export const CUISINE_OPTIONS: CuisineOption[] = [
  { id: 'any', label: 'Any' },
  { id: 'chinese', label: 'Chinese' },
  { id: 'indian', label: 'Indian' },
  { id: 'malay', label: 'Malay' },
];

/**
 * Best-effort mapping to OpenStreetMap's freeform `cuisine` tag values.
 * OSM has no formal cuisine taxonomy, so these are regex-style alternations
 * matched case-insensitively — a reasonable approximation, not a guarantee.
 */
export const CUISINE_OSM_PATTERN: Partial<Record<CuisineId, string>> = {
  chinese: 'chinese|dim_sum|cantonese',
  indian: 'indian',
  malay: 'malaysian|malay',
};
