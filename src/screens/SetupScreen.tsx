import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Filters } from '../types';
import { colors } from '../theme/theme';

interface Props {
  filters: Filters;
  onChangeFilters: (filters: Filters) => void;
  onSubmit: () => void;
}

// Placeholder visuals — real radius slider/chips/segmented control land in
// the screen-by-screen build step. onChangeFilters is already part of the
// prop contract for when that UI is built, but unused until then.
export function SetupScreen({ filters, onSubmit }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Setup</Text>
      <Text style={styles.subtitle}>
        {filters.radiusKm}km · {filters.cuisine} · {filters.wheelSize}
      </Text>
      <Pressable style={styles.button} onPress={onSubmit}>
        <Text style={styles.buttonText}>Find restaurants</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.cream, gap: 16 },
  title: { fontSize: 20, fontWeight: '700', color: colors.ink },
  subtitle: { fontSize: 13, color: colors.textMuted },
  button: { backgroundColor: colors.primary, borderRadius: 99, paddingVertical: 13, paddingHorizontal: 32 },
  buttonText: { color: colors.white, fontWeight: '700' },
});
