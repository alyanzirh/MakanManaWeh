import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Restaurant } from '../types';
import { ReelNeighbors } from '../hooks/useWheel';
import { colors } from '../theme/theme';

interface Props {
  winner: Restaurant;
  neighbors: ReelNeighbors;
  onOpenMaps: () => void;
  onSpinAgain: () => void;
}

// Placeholder visuals — real decorative wheel + landed reel land in the
// screen-by-screen build step.
export function ResultScreen({ winner, neighbors, onOpenMaps, onSpinAgain }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{winner.name}</Text>
      <Text style={styles.subtitle}>
        neighbors: {neighbors.before.name} / {neighbors.after.name}
      </Text>
      <View style={styles.row}>
        <Pressable style={styles.primaryButton} onPress={onOpenMaps}>
          <Text style={styles.primaryButtonText}>Open in maps</Text>
        </Pressable>
        <Pressable style={styles.secondaryButton} onPress={onSpinAgain}>
          <Text style={styles.secondaryButtonText}>Spin again</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.cream, gap: 16, padding: 24 },
  title: { fontSize: 18, fontWeight: '700', color: colors.ink, textAlign: 'center' },
  subtitle: { fontSize: 12, color: colors.textMuted, textAlign: 'center' },
  row: { flexDirection: 'row', gap: 10, width: '100%' },
  primaryButton: { flex: 1, backgroundColor: colors.primary, borderRadius: 99, paddingVertical: 13, alignItems: 'center' },
  primaryButtonText: { color: colors.white, fontWeight: '700' },
  secondaryButton: { flex: 1, borderRadius: 99, borderWidth: 2, borderColor: colors.border, paddingVertical: 13, alignItems: 'center' },
  secondaryButtonText: { color: colors.textMuted, fontWeight: '700' },
});
