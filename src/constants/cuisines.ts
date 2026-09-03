import { CuisineId, CuisineOption } from '../types';

export const CUISINE_OPTIONS: CuisineOption[] = [
  { id: 'malay', label: 'Malay' },
  { id: 'chinese', label: 'Chinese' },
  { id: 'indian', label: 'Indian' },
  { id: 'any', label: 'Any' },
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
