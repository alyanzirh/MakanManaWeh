import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/theme';

interface Props {
  onAllow: () => void;
  onSkip: () => void;
}

// Placeholder visuals — real mascot/copy land in the screen-by-screen build step.
export function PermissionScreen({ onAllow, onSkip }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Permission</Text>
      <Pressable style={styles.button} onPress={onAllow}>
        <Text style={styles.buttonText}>Allow location</Text>
      </Pressable>
      <Pressable onPress={onSkip}>
        <Text style={styles.skipText}>Maybe later</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.cream, gap: 16 },
  title: { fontSize: 20, fontWeight: '700', color: colors.ink },
  button: { backgroundColor: colors.primary, borderRadius: 99, paddingVertical: 13, paddingHorizontal: 32 },
  buttonText: { color: colors.white, fontWeight: '700' },
  skipText: { color: colors.textMuted, fontWeight: '700' },
});
