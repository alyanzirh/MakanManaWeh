import { useCallback, useState } from 'react';
import { CuisineId, Filters, Restaurant } from '../types';
import { componentTokens } from '../theme/theme';
import { RestaurantSearchError, searchRestaurants } from '../services/restaurantSearch';
import { useLocation } from './useLocation';

export interface ReelNeighbors {
  before: Restaurant;
  after: Restaurant;
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
    const neighbors: ReelNeighbors = {
      before: items[(targetIndex - 1 + n) % n],
      after: items[(targetIndex + 1) % n],
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
    locationStatus: location.status,
  };
}
