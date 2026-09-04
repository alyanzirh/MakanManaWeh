import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { DecorativeWheel } from '../components/DecorativeWheel';
import { Reel } from '../components/Reel';
import { Restaurant } from '../types';
import { ReelNeighbors } from '../hooks/useWheel';
import { colors, componentTokens } from '../theme/theme';

interface Props {
  winner: Restaurant;
  neighbors: ReelNeighbors;
  segmentCount: 4 | 6 | 8;
  onOpenMaps: () => void;
  onSpinAgain: () => void;
  onChangePreferences: () => void;
}

export function ResultScreen({ winner, neighbors, segmentCount, onOpenMaps, onSpinAgain, onChangePreferences }: Props) {
  return (
    <View style={styles.container}>
      <DecorativeWheel segmentCount={segmentCount} spinning={false} size={componentTokens.wheel.diameterCompact} />
      <Text style={styles.heading}>and the wheel says...</Text>
      <Text style={styles.subcopy}>here's where you're eating!</Text>
      <Reel mode="landed" winner={winner} neighbors={neighbors} />
      <View style={styles.buttonRow}>
        <Pressable style={styles.primaryButton} onPress={onOpenMaps}>
          <Text style={styles.primaryButtonText}>open in maps</Text>
        </Pressable>
        <Pressable style={styles.secondaryButton} onPress={onSpinAgain}>
          <Text style={styles.secondaryButtonText}>spin again</Text>
        </Pressable>
      </View>
      <Pressable onPress={onChangePreferences} hitSlop={8}>
        <Text style={styles.changePreferencesText}>change preferences</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.cream, padding: 24 },
  heading: { fontFamily: 'Fredoka_700Bold', fontSize: 16, color: colors.ink, marginTop: 14, marginBottom: 4 },
  subcopy: { fontFamily: 'Quicksand_500Medium', fontSize: 11, color: colors.textMuted, marginBottom: 18 },
  buttonRow: { flexDirection: 'row', gap: 10, width: '100%' },
  primaryButton: { flex: 1, alignItems: 'center', backgroundColor: colors.primary, paddingVertical: 12, borderRadius: 99 },
  primaryButtonText: { fontFamily: 'Quicksand_700Bold', color: colors.white, fontSize: 13 },
  secondaryButton: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: colors.border,
    paddingVertical: 10,
    borderRadius: 99,
  },
  secondaryButtonText: { fontFamily: 'Quicksand_700Bold', color: colors.bodyTextOnCream, fontSize: 13 },
  changePreferencesText: { fontFamily: 'Quicksand_700Bold', color: colors.textMuted, fontSize: 12, marginTop: 14 },
});
