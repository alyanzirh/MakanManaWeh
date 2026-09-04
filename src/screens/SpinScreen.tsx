import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { DecorativeWheel } from '../components/DecorativeWheel';
import { Reel } from '../components/Reel';
import { Restaurant } from '../types';
import { colors, componentTokens } from '../theme/theme';

interface Props {
  reelItems: Restaurant[];
  segmentCount: 4 | 6 | 8;
  onSpinComplete: () => void;
}

// The decorative wheel's motion has no relation to the eventual winner —
// useWheel.landOnReel() already precomputed it before this screen even
// mounts, and reveals it after a fixed delay; MainFlow watches for that
// (via `winner`) and transitions away, so onSpinComplete is unused here.
export function SpinScreen({ reelItems, segmentCount }: Props) {
  return (
    <View style={styles.container}>
      <DecorativeWheel segmentCount={segmentCount} spinning size={componentTokens.wheel.diameterCompact} />
      <Text style={styles.heading}>and the wheel says...</Text>
      <Text style={styles.subcopy}>settling on your restaurant</Text>
      <Reel mode="scrolling" items={reelItems} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.cream, padding: 24 },
  heading: { fontFamily: 'Fredoka_700Bold', fontSize: 16, color: colors.ink, marginTop: 14, marginBottom: 4 },
  subcopy: { fontFamily: 'Quicksand_500Medium', fontSize: 11, color: colors.textMuted, marginBottom: 18 },
});
