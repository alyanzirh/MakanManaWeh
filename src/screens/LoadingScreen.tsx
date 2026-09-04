import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Mascot } from '../components/Mascot';
import { colors } from '../theme/theme';

interface Props {
  radiusKm: number;
  isReady: boolean;
  foundCount: number;
  onSpinNow: () => void;
}

// No separate spinner here — the mascot's own animated mouth + rising
// steam (see Mascot's "loading" variant) already carries the "in
// progress" signal, so a second looping affordance would just compete
// with it for attention.
export function LoadingScreen({ radiusKm, isReady, foundCount, onSpinNow }: Props) {
  return (
    <View style={styles.container}>
      <Mascot variant="loading" size={140} animated={!isReady} />
      {isReady ? (
        <>
          <Text style={styles.heading}>found {foundCount} restaurants nearby!</Text>
          <Text style={styles.subcopy}>ready to see where you're eating?</Text>
          <Pressable style={styles.spinButton} onPress={onSpinNow}>
            <Text style={styles.spinButtonText}>spin it!</Text>
          </Pressable>
        </>
      ) : (
        <>
          <Text style={styles.heading}>hang on, finding restaurants...</Text>
          <Text style={styles.subcopy}>scanning within {radiusKm} km</Text>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.inkDark, padding: 24 },
  heading: { fontFamily: 'Fredoka_700Bold', fontSize: 15, color: colors.white, textAlign: 'center', marginTop: 8, marginBottom: 8 },
  subcopy: { fontFamily: 'Quicksand_500Medium', fontSize: 12, color: colors.loadingSubcopy, textAlign: 'center' },
  spinButton: { backgroundColor: colors.accent, borderRadius: 99, paddingVertical: 13, paddingHorizontal: 40, marginTop: 22 },
  spinButtonText: { fontFamily: 'Quicksand_700Bold', color: colors.spinItText, fontSize: 14 },
});
