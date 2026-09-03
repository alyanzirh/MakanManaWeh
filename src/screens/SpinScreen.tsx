import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Restaurant } from '../types';
import { colors } from '../theme/theme';

interface Props {
  reelItems: Restaurant[];
  onSpinComplete: () => void;
}

// Placeholder visuals — real decorative wheel + scrolling reel land in the
// screen-by-screen build step. The actual 3000ms precompute-then-reveal
// timing lives in useWheel.landOnReel; MainFlow calls onSpinComplete once
// useWheel reports a winner, so this screen doesn't own its own timer.
export function SpinScreen({ reelItems }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>And the wheel says…</Text>
      <Text style={styles.subtitle}>Settling on your restaurant</Text>
      <Text style={styles.subtitle}>{reelItems.length} restaurants in the mix</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.cream, gap: 8, padding: 24 },
  title: { fontSize: 16, fontWeight: '700', color: colors.ink },
  subtitle: { fontSize: 11, color: colors.textMuted },
});
