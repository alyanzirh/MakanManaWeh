export type CuisineId = 'malay' | 'chinese' | 'indian' | 'any';

export type WheelSize = 'few' | 'some' | 'lots';

export interface CuisineOption {
  id: CuisineId;
  label: string;
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
  wheelSize: WheelSize;
  cuisine: CuisineId;
}
