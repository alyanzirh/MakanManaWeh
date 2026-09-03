export type CuisineId =
  | 'any'
  | 'western'
  | 'seafood'
  | 'cafe'
  | 'japanese'
  | 'chinese'
  | 'italian'
  | 'indian'
  | 'malay'
  | 'fastFood'
  | 'dessert';

export interface CuisineOption {
  id: CuisineId;
  label: string;
  icon: string;
}

export interface Restaurant {
  id: string;
  name: string;
  category?: string;
  latitude: number;
  longitude: number;
  address?: string;
  distanceMeters: number;
}

export interface Filters {
  radiusKm: number;
  maxRestaurants: number;
  cuisines: CuisineId[];
}
