import { useCallback, useState } from 'react';
import { CuisineId, Filters, Restaurant } from '../types';
import { componentTokens } from '../theme/theme';
import { RestaurantSearchError, searchRestaurants } from '../services/restaurantSearch';
import { useLocation } from './useLocation';

export interface ReelNeighbors {
  // Display order top-to-bottom: before[0] is furthest above the winner,
  // before[1] sits directly above it; after[0] sits directly below,
  // after[1] is furthest below.
  before: [Restaurant, Restaurant];
  after: [Restaurant, Restaurant];
}

// Mounting this hook is what triggers useLocation's permission prompt (it
// requests on mount and can't be changed) — callers should only mount this
// once the user has taken an action that justifies asking for location.
export function useWheel(filters: Filters) {
  const location = useLocation();
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [winner, setWinner] = useState<Restaurant | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [reelItems, setReelItems] = useState<Restaurant[]>([]);
  const [resultNeighbors, setResultNeighbors] = useState<ReelNeighbors | null>(null);

  const loadRestaurants = useCallback(async () => {
    if (!location.coords) {
      setSearchError('Waiting for your location…');
      return;
    }
    setIsLoading(true);
    setSearchError(null);
    setWinner(null);
    setResultNeighbors(null);
    try {
      const results = await searchRestaurants({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        radiusKm: filters.radiusKm,
        cuisines: filters.cuisine === 'any' ? (['any'] as CuisineId[]) : [filters.cuisine],
        maxResults: componentTokens.sizeCaps[filters.wheelSize],
      });
      setRestaurants(results);
    } catch (error) {
      setRestaurants([]);
      setSearchError(
        error instanceof RestaurantSearchError
          ? error.message
          : 'Something went wrong searching for restaurants.'
      );
    } finally {
      setIsLoading(false);
    }
  }, [location.coords, filters]);

  const landOnReel = useCallback(() => {
    const items = restaurants;
    const n = items.length;
    if (n === 0) return;

    const targetIndex = Math.floor(Math.random() * n);
    const at = (offset: number) => items[((targetIndex + offset) % n + n) % n];
    const neighbors: ReelNeighbors = {
      before: [at(-2), at(-1)],
      after: [at(1), at(2)],
    };

    setReelItems(items);
    setWinner(null);
    setResultNeighbors(null);
    setIsSpinning(true);

    setTimeout(() => {
      setWinner(items[targetIndex]);
      setResultNeighbors(neighbors);
      setIsSpinning(false);
    }, 3000);
  }, [restaurants]);

  const reset = useCallback(() => {
    setWinner(null);
    setResultNeighbors(null);
  }, []);

  // For starting a genuinely fresh search (e.g. after changing filters and
  // resubmitting) — unlike reset(), this also drops the cached restaurant
  // list so stale results can't briefly (or permanently, if a caller forgot
  // to re-trigger loadRestaurants) be mistaken for the new search's results.
  const clearResults = useCallback(() => {
    setRestaurants([]);
    setWinner(null);
    setResultNeighbors(null);
    setSearchError(null);
  }, []);

  return {
    restaurants,
    isLoading,
    errorMessage: searchError ?? location.errorMessage,
    winner,
    isSpinning,
    reelItems,
    resultNeighbors,
    loadRestaurants,
    landOnReel,
    reset,
    clearResults,
    locationStatus: location.status,
    requestLocation: location.requestLocation,
  };
}
