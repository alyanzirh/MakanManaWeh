import React from 'react';
import { Linking, Pressable, StyleSheet, Text, View } from 'react-native';
import { Restaurant } from '../types';

interface Props {
  restaurant: Restaurant;
  onSpinAgain: () => void;
  onClose: () => void;
}

function formatDistance(meters: number): string {
  return meters < 1000 ? `${Math.round(meters)} m` : `${(meters / 1000).toFixed(1)} km`;
}

export function ResultCard({ restaurant, onSpinAgain, onClose }: Props) {
  const openInMaps = () => {
    const label = encodeURIComponent(restaurant.name);
    // apple maps URL scheme; falls back to a browser map view on platforms
    // without the Maps app, and Android will offer its own map handler too.
    const url = `https://maps.apple.com/?daddr=${restaurant.latitude},${restaurant.longitude}&q=${label}`;
    Linking.openURL(url);
  };

  return (
    <View style={styles.overlay}>
      <View style={styles.card}>
        <Text style={styles.emoji}>🎉</Text>
        <Text style={styles.name}>{restaurant.name}</Text>
        {restaurant.category ? <Text style={styles.meta}>{restaurant.category}</Text> : null}
        {restaurant.address ? <Text style={styles.meta}>{restaurant.address}</Text> : null}
        <Text style={styles.meta}>{formatDistance(restaurant.distanceMeters)} away</Text>

        <View style={styles.buttonRow}>
          <Pressable style={styles.primaryButton} onPress={openInMaps}>
            <Text style={styles.primaryButtonText}>Open in Maps</Text>
          </Pressable>
          <Pressable style={styles.secondaryButton} onPress={onSpinAgain}>
            <Text style={styles.secondaryButtonText}>Spin again</Text>
          </Pressable>
        </View>

        <Pressable onPress={onClose}>
          <Text style={styles.close}>Close</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    width: '100%',
  },
  emoji: { fontSize: 40, marginBottom: 8 },
  name: { fontSize: 20, fontWeight: '700', textAlign: 'center', marginBottom: 4 },
  meta: { fontSize: 13, color: '#6B7280', textAlign: 'center', marginBottom: 2 },
  buttonRow: { flexDirection: 'row', gap: 12, marginTop: 16 },
  primaryButton: { backgroundColor: '#3B82F6', borderRadius: 12, paddingVertical: 12, paddingHorizontal: 18 },
  primaryButtonText: { color: 'white', fontWeight: '700' },
  secondaryButton: {
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  secondaryButtonText: { color: '#111827', fontWeight: '700' },
  close: { marginTop: 14, color: '#6B7280' },
});
