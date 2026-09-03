import React, { useCallback, useEffect, useState } from 'react';
import { Linking, SafeAreaView, StatusBar, StyleSheet } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts, Fredoka_600SemiBold, Fredoka_700Bold } from '@expo-google-fonts/fredoka';
import { Quicksand_500Medium, Quicksand_600SemiBold, Quicksand_700Bold } from '@expo-google-fonts/quicksand';
import {
  OnboardingScreen,
  PermissionScreen,
  SetupScreen,
  LoadingScreen,
  SpinScreen,
  ResultScreen,
  EmptyScreen,
} from './src/screens';
import { useWheel } from './src/hooks/useWheel';
import { colors } from './src/theme/theme';

SplashScreen.preventAutoHideAsync();

type MainScreen = 'permission' | 'setup' | 'loading' | 'spin' | 'result' | 'empty';

// Owns useWheel() (and therefore useLocation(), whose permission prompt
// fires on mount) — this only mounts once the user has moved past
// Onboarding, so the OS location dialog appears near the Permission
// screen's rationale copy rather than during Onboarding's auto-advance.
function MainFlow() {
  const {
    filters,
    setFilters,
    setCuisine,
    restaurants,
    isLoading,
    winner,
    isSpinning,
    reelItems,
    resultNeighbors,
    loadRestaurants,
    landOnReel,
    reset,
    requestLocation,
  } = useWheel();

  const [screen, setScreen] = useState<MainScreen>('permission');

  const goToSetup = useCallback(() => setScreen('setup'), []);

  const handleAllow = useCallback(() => {
    requestLocation();
    goToSetup();
  }, [requestLocation, goToSetup]);

  const handleSubmit = useCallback(() => {
    setScreen('loading');
    loadRestaurants();
  }, [loadRestaurants]);

  // Once a search finishes with zero results, skip straight to Empty —
  // never let the user reach Spin having watched the wheel for nothing.
  useEffect(() => {
    if (screen === 'loading' && !isLoading && restaurants.length === 0) {
      setScreen('empty');
    }
  }, [screen, isLoading, restaurants.length]);

  const handleSpinNow = useCallback(() => {
    reset();
    landOnReel();
    setScreen('spin');
  }, [reset, landOnReel]);

  // landOnReel() precomputes the winner up front and reveals it after a
  // fixed delay (see useWheel) — once it lands, move to Result.
  useEffect(() => {
    if (screen === 'spin' && !isSpinning && winner) {
      setScreen('result');
    }
  }, [screen, isSpinning, winner]);

  const handleSpinAgain = useCallback(() => {
    if (restaurants.length > 0) {
      reset();
      landOnReel();
      setScreen('spin');
    } else {
      setScreen('loading');
      loadRestaurants();
    }
  }, [restaurants.length, reset, landOnReel, loadRestaurants]);

  const handleWidenRadius = useCallback(() => {
    setFilters((prev) => ({ ...prev, radiusKm: prev.radiusKm + 3 }));
    setScreen('setup');
  }, [setFilters]);

  const handleChangeCuisine = useCallback(() => {
    setCuisine('any');
    setScreen('setup');
  }, [setCuisine]);

  const handleOpenMaps = useCallback(() => {
    if (!winner) return;
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(winner.name)}`;
    Linking.openURL(url);
  }, [winner]);

  switch (screen) {
    case 'permission':
      return <PermissionScreen onAllow={handleAllow} onSkip={goToSetup} />;
    case 'setup':
      return <SetupScreen filters={filters} onChangeFilters={setFilters} onSubmit={handleSubmit} />;
    case 'loading':
      return (
        <LoadingScreen
          radiusKm={filters.radiusKm}
          isReady={!isLoading && restaurants.length > 0}
          foundCount={restaurants.length}
          onSpinNow={handleSpinNow}
        />
      );
    case 'spin':
      return <SpinScreen reelItems={reelItems} onSpinComplete={() => setScreen('result')} />;
    case 'result':
      return winner && resultNeighbors ? (
        <ResultScreen winner={winner} neighbors={resultNeighbors} onOpenMaps={handleOpenMaps} onSpinAgain={handleSpinAgain} />
      ) : null;
    case 'empty':
      return <EmptyScreen radiusKm={filters.radiusKm} onWidenRadius={handleWidenRadius} onChangeCuisine={handleChangeCuisine} />;
    default:
      return null;
  }
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
});
