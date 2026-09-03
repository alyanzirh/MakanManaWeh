import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/theme';

interface Props {
  radiusKm: number;
  isReady: boolean;
  foundCount: number;
  onSpinNow: () => void;
}

// Placeholder visuals — real ring spinner/mascot land in the
// screen-by-screen build step.
export function LoadingScreen({ radiusKm, isReady, foundCount, onSpinNow }: Props) {
  return (
    <View style={styles.container}>
      {isReady ? (
        <>
          <Text style={styles.title}>Found {foundCount} restaurants nearby!</Text>
          <Pressable style={styles.button} onPress={onSpinNow}>
            <Text style={styles.buttonText}>Spin it!</Text>
          </Pressable>
        </>
      ) : (
        <>
          <ActivityIndicator size="large" color={colors.accent} />
          <Text style={styles.title}>Hang on, finding restaurants…</Text>
          <Text style={styles.subtitle}>Scanning within {radiusKm} km</Text>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.inkDark, gap: 16, padding: 24 },
  title: { fontSize: 16, fontWeight: '700', color: colors.white, textAlign: 'center' },
  subtitle: { fontSize: 13, color: colors.loadingSubcopy },
  button: { backgroundColor: colors.accent, borderRadius: 99, paddingVertical: 13, paddingHorizontal: 32 },
  buttonText: { color: colors.spinItText, fontWeight: '700' },
});
