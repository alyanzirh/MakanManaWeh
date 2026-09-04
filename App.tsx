import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Linking, SafeAreaView, StatusBar, StyleSheet, View } from 'react-native';
import * as Location from 'expo-location';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts, Fredoka_600SemiBold, Fredoka_700Bold } from '@expo-google-fonts/fredoka';
import { Quicksand_500Medium, Quicksand_600SemiBold, Quicksand_700Bold } from '@expo-google-fonts/quicksand';
import {
  OnboardingScreen,
  PermissionScreen,
  PermissionDeniedScreen,
  SetupScreen,
  LoadingScreen,
  SpinScreen,
  ResultScreen,
  EmptyScreen,
} from './src/screens';
import { useFilters } from './src/hooks/useFilters';
import { useWheel } from './src/hooks/useWheel';
import { CuisineId, Filters } from './src/types';
import { colors, componentTokens } from './src/theme/theme';

SplashScreen.preventAutoHideAsync();

type ActiveScreen = 'permission-pending' | 'setup' | 'loading' | 'spin' | 'result' | 'empty' | 'permission-denied';

interface SearchFlowProps {
  filters: Filters;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
  setCuisine: (id: CuisineId) => void;
  initialScreen: ActiveScreen;
}

// Only mounted once the user has taken an action that justifies asking for
// location (tapping "allow location", or "find restaurants" having skipped
// permission) — mounting useWheel() is what triggers the OS location prompt,
// so this component's own mount timing IS the tap-gate.
function SearchFlow({ filters, setFilters, setCuisine, initialScreen }: SearchFlowProps) {
  const wheel = useWheel(filters);
  const [screen, setScreen] = useState<ActiveScreen>(initialScreen);
  const searchAttemptedRef = useRef(false);

  // "allow location" lands here first — stay put until the OS dialog has
  // actually been answered (granted, denied, or errored), so the user never
  // sees Setup appear underneath/before the permission prompt resolves.
  useEffect(() => {
    if (screen !== 'permission-pending') return;
    if (wheel.locationStatus === 'idle' || wheel.locationStatus === 'requesting') return;
    setScreen('setup');
  }, [screen, wheel.locationStatus]);

  // Drives the Loading screen: waits for location to resolve, fires the
  // search once per visit here (searchAttemptedRef, not restaurants.length
  // — a resubmit after "change preferences" still has the OLD results
  // cached, so gating on an empty list would skip re-searching entirely),
  // and routes to Empty on denial/error or a genuine zero-result outcome.
  useEffect(() => {
    if (screen !== 'loading') return;

    if (wheel.locationStatus === 'denied' || wheel.locationStatus === 'error') {
      setScreen('permission-denied');
      return;
    }
    if (wheel.locationStatus !== 'granted') return;

    if (!searchAttemptedRef.current) {
      if (!wheel.isLoading) {
        searchAttemptedRef.current = true;
        wheel.loadRestaurants();
      }
      return;
    }

    if (!wheel.isLoading && wheel.restaurants.length === 0) {
      setScreen('empty');
    }
  }, [screen, wheel.locationStatus, wheel.restaurants.length, wheel.isLoading, wheel.loadRestaurants]);

  const handleSetupSubmit = useCallback(() => {
    searchAttemptedRef.current = false;
    wheel.clearResults();
    setScreen('loading');
  }, [wheel]);

  const handleSpinNow = useCallback(() => {
    wheel.reset();
    wheel.landOnReel();
    setScreen('spin');
  }, [wheel]);

  useEffect(() => {
    if (screen === 'spin' && !wheel.isSpinning && wheel.winner) {
      setScreen('result');
    }
  }, [screen, wheel.isSpinning, wheel.winner]);

  const handleSpinAgain = useCallback(() => {
    if (wheel.restaurants.length > 0) {
      wheel.reset();
      wheel.landOnReel();
      setScreen('spin');
    } else {
      searchAttemptedRef.current = false;
      setScreen('loading');
    }
  }, [wheel]);

  const handleWidenRadius = useCallback(() => {
    setFilters((prev) => ({ ...prev, radiusKm: prev.radiusKm + 3 }));
    setScreen('setup');
  }, [setFilters]);

  const handleChangeCuisine = useCallback(() => {
    setCuisine('any');
    setScreen('setup');
  }, [setCuisine]);

  const handleOpenMaps = useCallback(() => {
    if (!wheel.winner) return;
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(wheel.winner.name)}`;
    Linking.openURL(url);
  }, [wheel.winner]);

  // From Result only — Spin is a deliberate, brief, uninterruptible payoff
  // moment, so there's no way back mid-spin. Filters are left as-is (not
  // reset) since the user isn't wrong, just wants to adjust.
  const handleChangePreferences = useCallback(() => {
    setScreen('setup');
  }, []);

  // "try again" on the permission-denied screen — re-requests (harmless/
  // idempotent if still denied; picks up an external Settings change if
  // the user just came back from there) and lets the loading effect above
  // route onward once locationStatus resolves, same as the first attempt.
  const handleTryLocationAgain = useCallback(() => {
    searchAttemptedRef.current = false;
    wheel.requestLocation();
    setScreen('loading');
  }, [wheel]);

  switch (screen) {
    case 'permission-pending':
      return (
        <View style={styles.pendingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      );
    case 'setup':
      return <SetupScreen filters={filters} onChangeFilters={setFilters} onSubmit={handleSetupSubmit} />;
    case 'loading':
      return (
        <LoadingScreen
          radiusKm={filters.radiusKm}
          isReady={!wheel.isLoading && wheel.restaurants.length > 0}
          foundCount={wheel.restaurants.length}
          onSpinNow={handleSpinNow}
        />
      );
    case 'spin':
      return (
        <SpinScreen
          reelItems={wheel.reelItems}
          segmentCount={componentTokens.wheel.segmentCount}
          onSpinComplete={() => setScreen('result')}
        />
      );
    case 'result':
      return wheel.winner && wheel.resultNeighbors ? (
        <ResultScreen
          winner={wheel.winner}
          neighbors={wheel.resultNeighbors}
          segmentCount={componentTokens.wheel.segmentCount}
          onOpenMaps={handleOpenMaps}
          onSpinAgain={handleSpinAgain}
          onChangePreferences={handleChangePreferences}
        />
      ) : null;
    case 'empty':
      return <EmptyScreen radiusKm={filters.radiusKm} onWidenRadius={handleWidenRadius} onChangeCuisine={handleChangeCuisine} />;
    case 'permission-denied':
      return <PermissionDeniedScreen onTryAgain={handleTryLocationAgain} />;
    default:
      return null;
  }
}

// Owns filters (safe to use before useWheel exists) and decides when it's
// time to mount SearchFlow — either "allow location" was tapped, or "find
// restaurants" was tapped having skipped permission. Either way, the OS
// location prompt only fires once SearchFlow (and therefore useWheel/
// useLocation) actually mounts, not before.
function MainFlow() {
  const { filters, setFilters, setCuisine } = useFilters();
  const [wheelActive, setWheelActive] = useState(false);
  const [preActiveScreen, setPreActiveScreen] = useState<'checking' | 'permission' | 'setup'>('checking');
  const [initialActiveScreen, setInitialActiveScreen] = useState<ActiveScreen>('setup');

  // getForegroundPermissionsAsync only reads the current status — unlike
  // useLocation's requestForegroundPermissionsAsync, it never shows the OS
  // dialog — so this lets returning users (who already granted location
  // last time) skip straight past Permission instead of seeing it again.
  useEffect(() => {
    let cancelled = false;
    Location.getForegroundPermissionsAsync()
      .then(({ status }) => {
        if (cancelled) return;
        if (status === 'granted') {
          setInitialActiveScreen('setup');
          setWheelActive(true);
        } else {
          setPreActiveScreen('permission');
        }
      })
      .catch(() => {
        if (!cancelled) setPreActiveScreen('permission');
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const handleAllow = useCallback(() => {
    setInitialActiveScreen('permission-pending');
    setWheelActive(true);
  }, []);

  const handleSkipPermission = useCallback(() => {
    setPreActiveScreen('setup');
  }, []);

  const handlePreActiveSetupSubmit = useCallback(() => {
    setInitialActiveScreen('loading');
    setWheelActive(true);
  }, []);

  if (!wheelActive) {
    if (preActiveScreen === 'checking') {
      return (
        <View style={styles.pendingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      );
    }
    if (preActiveScreen === 'permission') {
      return <PermissionScreen onAllow={handleAllow} onSkip={handleSkipPermission} />;
    }
    return <SetupScreen filters={filters} onChangeFilters={setFilters} onSubmit={handlePreActiveSetupSubmit} />;
  }

  return (
    <SearchFlow filters={filters} setFilters={setFilters} setCuisine={setCuisine} initialScreen={initialActiveScreen} />
  );
}

export default function App() {
  const [pastOnboarding, setPastOnboarding] = useState(false);
  const [fontsLoaded] = useFonts({
    Fredoka_600SemiBold,
    Fredoka_700Bold,
    Quicksand_500Medium,
    Quicksand_600SemiBold,
    Quicksand_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      {pastOnboarding ? <MainFlow /> : <OnboardingScreen onDone={() => setPastOnboarding(true)} />}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.cream },
  pendingContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.cream },
});
