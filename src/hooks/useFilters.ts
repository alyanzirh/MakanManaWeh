import { useCallback, useState } from 'react';
import { CuisineId, Filters } from '../types';

const DEFAULT_FILTERS: Filters = {
  radiusKm: 5,
  wheelSize: 'some',
  cuisine: 'any',
};

// Kept independent of useWheel so Setup can read/edit filters before the
// search hook (and the location-permission prompt it triggers on mount)
// is ever instantiated.
export function useFilters() {
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);

  const setCuisine = useCallback((id: CuisineId) => {
    setFilters((prev) => ({ ...prev, cuisine: id }));
  }, []);

  return { filters, setFilters, setCuisine };
}
