import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/theme';

interface Props {
  onDone: () => void;
}

// Placeholder visuals — real mascot/progress-bar/timing land in the
// screen-by-screen build step. This wires the real onDone transition.
export function OnboardingScreen({ onDone }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Onboarding</Text>
      <Pressable style={styles.button} onPress={onDone}>
        <Text style={styles.buttonText}>Continue</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.cream, gap: 16 },
  title: { fontSize: 20, fontWeight: '700', color: colors.ink },
  button: { backgroundColor: colors.primary, borderRadius: 99, paddingVertical: 13, paddingHorizontal: 32 },
  buttonText: { color: colors.white, fontWeight: '700' },
});
