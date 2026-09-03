import { useCallback, useRef, useState } from 'react';
import { Animated, Easing } from 'react-native';
import { CuisineId, Filters, Restaurant } from '../types';
import { RestaurantSearchError, searchRestaurants } from '../services/restaurantSearch';
import { useLocation } from './useLocation';

const DEFAULT_FILTERS: Filters = {
  radiusKm: 2,
  maxRestaurants: 8,
  cuisines: ['any'],
};

export function useWheel() {
  const location = useLocation();
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [winner, setWinner] = useState<Restaurant | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);

  const rotation = useRef(new Animated.Value(0)).current;
  const rotationValueRef = useRef(0);

  const toggleCuisine = useCallback((id: CuisineId) => {
    setFilters((prev) => {
      if (id === 'any') return { ...prev, cuisines: ['any'] };
      const withoutAny = prev.cuisines.filter((c) => c !== 'any');
      const next = withoutAny.includes(id) ? withoutAny.filter((c) => c !== id) : [...withoutAny, id];
      return { ...prev, cuisines: next.length === 0 ? ['any'] : next };
    });
  }, []);

  const loadRestaurants = useCallback(async () => {
    if (!location.coords) {
      setSearchError('Waiting for your location…');
      location.requestLocation();
      return;
    }
    setIsLoading(true);
    setSearchError(null);
    setWinner(null);
    try {
      const results = await searchRestaurants({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        radiusKm: filters.radiusKm,
        cuisines: filters.cuisines,
        maxResults: filters.maxRestaurants,
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
    // location.requestLocation is stable via useCallback with no deps; filters is intentionally
    // the trigger here rather than location.coords, which only changes once per permission grant.
  }, [location.coords, filters]);

  const spin = useCallback(() => {
    if (restaurants.length === 0 || isSpinning) return;
    setIsSpinning(true);
    setWinner(null);

    const sliceAngle = 360 / restaurants.length;
    const winningIndex = Math.floor(Math.random() * restaurants.length);
    const targetAngle = sliceAngle * winningIndex + sliceAngle / 2;
    const extraSpins = (5 + Math.floor(Math.random() * 4)) * 360;
    const currentNormalized = rotationValueRef.current % 360;
    const delta = extraSpins + (360 - targetAngle) - currentNormalized;
    const nextValue = rotationValueRef.current + delta;

    Animated.timing(rotation, {
      toValue: nextValue,
      duration: 4500,
      easing: Easing.bezier(0.15, 0.85, 0.3, 1),
      useNativeDriver: true,
    }).start(() => {
      rotationValueRef.current = nextValue;
      setWinner(restaurants[winningIndex]);
      setIsSpinning(false);
    });
  }, [restaurants, isSpinning, rotation]);

  const reset = useCallback(() => setWinner(null), []);

  return {
    filters,
    setFilters,
    toggleCuisine,
    restaurants,
    isLoading,
    errorMessage: searchError ?? location.errorMessage,
    winner,
    isSpinning,
    rotation,
    loadRestaurants,
    spin,
    reset,
    locationStatus: location.status,
  };
}
