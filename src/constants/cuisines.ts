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
 * Google Places (New) place types per cuisine filter, sent as `includedTypes`
 * (a place matches if it has ANY of them). Google has no Malay-specific type,
 * so Malay maps to `malaysian_restaurant`. 'any' keeps the old search's scope:
 * restaurants, cafes and fast food.
 */
export const CUISINE_PLACE_TYPES: Record<CuisineId, string[]> = {
  any: ['restaurant', 'cafe', 'fast_food_restaurant'],
  chinese: ['chinese_restaurant', 'cantonese_restaurant', 'chinese_noodle_restaurant', 'dim_sum_restaurant'],
  indian: ['indian_restaurant', 'north_indian_restaurant', 'south_indian_restaurant'],
  malay: ['malaysian_restaurant'],
};
