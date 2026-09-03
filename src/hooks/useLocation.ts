import { useCallback, useEffect, useState } from 'react';
import * as Location from 'expo-location';

type LocationStatus = 'idle' | 'requesting' | 'granted' | 'denied' | 'error';

interface LocationState {
  coords: { latitude: number; longitude: number } | null;
  status: LocationStatus;
  errorMessage: string | null;
}

export function useLocation() {
  const [state, setState] = useState<LocationState>({
    coords: null,
    status: 'idle',
    errorMessage: null,
  });

  const requestLocation = useCallback(async () => {
    setState((prev) => ({ ...prev, status: 'requesting', errorMessage: null }));
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setState({
          coords: null,
          status: 'denied',
          errorMessage: 'Location access is off. Enable it in Settings to find nearby restaurants.',
        });
        return;
      }
      const position = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      setState({
        coords: {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        },
        status: 'granted',
        errorMessage: null,
      });
    } catch (error) {
      setState({
        coords: null,
        status: 'error',
        errorMessage: error instanceof Error ? error.message : 'Could not get your location.',
      });
    }
  }, []);

  useEffect(() => {
    requestLocation();
  }, [requestLocation]);

  return { ...state, requestLocation };
}
