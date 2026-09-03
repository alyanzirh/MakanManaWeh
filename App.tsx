import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, SafeAreaView, StatusBar, StyleSheet, Text, View } from 'react-native';
import { Wheel } from './src/components/Wheel';
import { FilterSheet } from './src/components/FilterSheet';
import { ResultCard } from './src/components/ResultCard';
import { useWheel } from './src/hooks/useWheel';

export default function App() {
  const {
    filters,
    setFilters,
    toggleCuisine,
    restaurants,
    isLoading,
    errorMessage,
    winner,
    isSpinning,
    rotation,
    loadRestaurants,
    spin,
    reset,
    locationStatus,
  } = useWheel();

  const [filtersVisible, setFiltersVisible] = useState(false);

  useEffect(() => {
    if (locationStatus === 'granted' && restaurants.length === 0 && !isLoading) {
      loadRestaurants();
    }
    // Intentionally only re-runs when locationStatus changes (i.e. once permission
    // is granted) — loadRestaurants itself is re-created per filter change, which
    // would otherwise cause an unwanted auto-search on every slider tick.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locationStatus]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.header}>
        <Text style={styles.title}>MakanManaWeh</Text>
        <Pressable onPress={() => setFiltersVisible(true)} hitSlop={10}>
          <Text style={styles.filterIcon}>⚙️</Text>
        </Pressable>
      </View>

      <View style={styles.content}>
        {isLoading ? (
          <ActivityIndicator size="large" />
        ) : restaurants.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>
              {errorMessage ?? 'Set your filters and spin to find somewhere to eat.'}
            </Text>
            <Pressable style={styles.retryButton} onPress={loadRestaurants}>
              <Text style={styles.retryText}>Try Again</Text>
            </Pressable>
          </View>
        ) : (
          <>
            <Wheel restaurants={restaurants} rotation={rotation} size={300} />
            <Pressable
              style={[styles.spinButton, isSpinning && styles.spinButtonDisabled]}
              onPress={spin}
              disabled={isSpinning}
            >
              <Text style={styles.spinText}>{isSpinning ? 'Spinning…' : 'Spin the Wheel'}</Text>
            </Pressable>
          </>
        )}
      </View>

      <FilterSheet
        visible={filtersVisible}
        filters={filters}
        onChangeFilters={setFilters}
        onToggleCuisine={toggleCuisine}
        onClose={() => {
          setFiltersVisible(false);
          loadRestaurants();
        }}
      />

      {winner ? (
        <ResultCard
          restaurant={winner}
          onSpinAgain={() => {
            reset();
            spin();
          }}
          onClose={reset}
        />
      ) : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  title: { fontSize: 22, fontWeight: '700' },
  filterIcon: { fontSize: 22 },
  content: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20 },
  emptyState: { alignItems: 'center', gap: 12 },
  emptyText: { textAlign: 'center', color: '#6B7280', fontSize: 15, paddingHorizontal: 20 },
  retryButton: { borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 10, paddingVertical: 10, paddingHorizontal: 20 },
  retryText: { fontWeight: '600' },
  spinButton: { backgroundColor: '#3B82F6', borderRadius: 14, paddingVertical: 16, paddingHorizontal: 40, marginTop: 28 },
  spinButtonDisabled: { opacity: 0.6 },
  spinText: { color: 'white', fontSize: 17, fontWeight: '700' },
});
