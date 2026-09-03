import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';
import { Mascot } from '../components/Mascot';
import { colors } from '../theme/theme';

interface Props {
  onDone: () => void;
}

// Auto-advances after ~2.3s — no button, per the design spec.
export function OnboardingScreen({ onDone }: Props) {
  const fillPercent = useRef(new Animated.Value(8)).current;

  useEffect(() => {
    const startFill = setTimeout(() => {
      Animated.timing(fillPercent, {
        toValue: 100,
        duration: 2100,
        easing: Easing.linear,
        useNativeDriver: false,
      }).start();
    }, 100);
    const advance = setTimeout(onDone, 2300);

    return () => {
      clearTimeout(startFill);
      clearTimeout(advance);
    };
  }, [onDone, fillPercent]);

  const fillWidth = fillPercent.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={styles.container}>
      <Mascot variant="default" size={140} />
      <Text style={styles.wordmark}>makan mana weh?</Text>
      <Text style={styles.tagline}>let's find out together!</Text>
      <View style={styles.progressTrack}>
        <Animated.View style={[styles.progressFill, { width: fillWidth }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.cream, padding: 24 },
  wordmark: { fontFamily: 'Fredoka_700Bold', fontSize: 28, color: colors.primary },
  tagline: { fontFamily: 'Quicksand_500Medium', fontSize: 12, color: colors.bodyTextOnCream, marginTop: 12, marginBottom: 26 },
  progressTrack: { width: 64, height: 5, borderRadius: 99, backgroundColor: colors.sand, overflow: 'hidden' },
  progressFill: { height: 5, borderRadius: 99, backgroundColor: colors.accent },
});
