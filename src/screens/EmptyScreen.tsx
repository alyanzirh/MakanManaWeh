import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Mascot } from '../components/Mascot';
import { colors } from '../theme/theme';

interface Props {
  radiusKm: number;
  onWidenRadius: () => void;
  onChangeCuisine: () => void;
}

export function EmptyScreen({ radiusKm, onWidenRadius, onChangeCuisine }: Props) {
  return (
    <View style={styles.container}>
      <Mascot variant="empty" size={140} />
      <Text style={styles.title}>oops, nothing found</Text>
      <Text style={styles.subtitle}>no restaurants within {radiusKm} km. want to widen the search?</Text>
      <Pressable style={styles.button} onPress={onWidenRadius}>
        <Text style={styles.buttonText}>widen radius</Text>
      </Pressable>
      <Pressable onPress={onChangeCuisine} hitSlop={8}>
        <Text style={styles.linkText}>change cuisine</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.cream, padding: 24 },
  title: { fontFamily: 'Fredoka_700Bold', fontSize: 17, color: colors.ink, marginBottom: 8 },
  subtitle: { fontFamily: 'Quicksand_500Medium', fontSize: 12, color: colors.bodyTextOnCream, textAlign: 'center', maxWidth: 190, marginBottom: 24 },
  button: { backgroundColor: colors.primary, borderRadius: 99, paddingVertical: 13, paddingHorizontal: 32, marginBottom: 10 },
  buttonText: { fontFamily: 'Quicksand_700Bold', color: colors.white, fontSize: 14 },
  linkText: { fontFamily: 'Quicksand_700Bold', color: colors.textMuted, fontSize: 12 },
});
