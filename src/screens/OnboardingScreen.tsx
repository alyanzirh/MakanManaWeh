import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Mascot } from '../components/Mascot';
import { colors } from '../theme/theme';

interface Props {
  onDone: () => void;
}

// Placeholder visuals — real mascot/progress-bar/timing land in the
// screen-by-screen build step. This wires the real onDone transition.
// TEMP: previewing all 5 Mascot variants here for visual review — removed
// once Onboarding's real layout (single default-variant mascot) is built.
export function OnboardingScreen({ onDone }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Onboarding</Text>
      <View style={styles.mascotRow}>
        <View style={styles.mascotCell}>
          <Mascot variant="default" size={70} />
          <Text style={styles.mascotLabel}>default</Text>
        </View>
        <View style={styles.mascotCell}>
          <Mascot variant="permission" size={70} />
          <Text style={styles.mascotLabel}>permission</Text>
        </View>
        <View style={styles.mascotCell}>
          <Mascot variant="loading" size={70} />
          <Text style={styles.mascotLabel}>loading</Text>
        </View>
        <View style={styles.mascotCell}>
          <Mascot variant="empty" size={70} />
          <Text style={styles.mascotLabel}>empty</Text>
        </View>
        <View style={styles.mascotCell}>
          <Mascot variant="setupIcon" size={70} />
          <Text style={styles.mascotLabel}>setupIcon</Text>
        </View>
      </View>
      <Pressable style={styles.button} onPress={onDone}>
        <Text style={styles.buttonText}>Continue</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.cream, gap: 16 },
  title: { fontSize: 20, fontWeight: '700', color: colors.ink },
  mascotRow: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 12 },
  mascotCell: { alignItems: 'center', gap: 4 },
  mascotLabel: { fontSize: 10, color: colors.textMuted },
  button: { backgroundColor: colors.primary, borderRadius: 99, paddingVertical: 13, paddingHorizontal: 32 },
  buttonText: { color: colors.white, fontWeight: '700' },
});
