import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Mascot } from '../components/Mascot';
import { colors } from '../theme/theme';

interface Props {
  onAllow: () => void;
  onSkip: () => void;
}

export function PermissionScreen({ onAllow, onSkip }: Props) {
  return (
    <View style={styles.container}>
      <Mascot variant="permission" size={140} />
      <Text style={styles.title}>let's find you somewhere to eat</Text>
      <Text style={styles.body}>we'll find restaurants near you once you share your location.</Text>
      <Pressable style={styles.allowButton} onPress={onAllow}>
        <Text style={styles.allowText}>allow location</Text>
      </Pressable>
      <Pressable onPress={onSkip} hitSlop={8}>
        <Text style={styles.skipText}>maybe later</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.cream, padding: 24 },
  title: { fontFamily: 'Fredoka_700Bold', fontSize: 18, color: colors.ink, marginBottom: 8, textAlign: 'center' },
  body: { fontFamily: 'Quicksand_500Medium', fontSize: 12, color: colors.bodyTextOnCream, maxWidth: 190, textAlign: 'center', marginBottom: 24 },
  allowButton: { backgroundColor: colors.primary, borderRadius: 99, paddingVertical: 13, paddingHorizontal: 32, marginBottom: 10 },
  allowText: { fontFamily: 'Quicksand_700Bold', color: colors.white, fontSize: 14 },
  skipText: { fontFamily: 'Quicksand_700Bold', color: colors.textMuted, fontSize: 12 },
});
