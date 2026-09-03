import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/theme';

interface Props {
  radiusKm: number;
  onWidenRadius: () => void;
  onChangeCuisine: () => void;
}

// Placeholder visuals — real mascot (frown variant) lands in the
// screen-by-screen build step.
export function EmptyScreen({ radiusKm, onWidenRadius, onChangeCuisine }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Oops, nothing found</Text>
      <Text style={styles.subtitle}>No restaurants within {radiusKm} km. Want to widen the search?</Text>
      <Pressable style={styles.button} onPress={onWidenRadius}>
        <Text style={styles.buttonText}>Widen radius</Text>
      </Pressable>
      <Pressable onPress={onChangeCuisine}>
        <Text style={styles.linkText}>Change cuisine</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.cream, gap: 16, padding: 24 },
  title: { fontSize: 17, fontWeight: '700', color: colors.ink },
  subtitle: { fontSize: 12, color: colors.bodyTextOnCream, textAlign: 'center', maxWidth: 220 },
  button: { backgroundColor: colors.primary, borderRadius: 99, paddingVertical: 13, paddingHorizontal: 32 },
  buttonText: { color: colors.white, fontWeight: '700' },
  linkText: { color: colors.textMuted, fontWeight: '700' },
});
