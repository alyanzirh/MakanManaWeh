import React, { useEffect, useState } from 'react';
import { AppState, Linking, Pressable, StyleSheet, Text, View } from 'react-native';
import * as Location from 'expo-location';
import { Mascot } from '../components/Mascot';
import { colors } from '../theme/theme';

interface Props {
  onTryAgain: () => void;
}

// Distinct from Empty — the cause (permission, not zero search results) and
// the fix (Settings, not widening the radius/cuisine) are both different.
// Once denied, requestForegroundPermissionsAsync can never re-show the OS
// dialog, so Settings is the only real way forward.
//
// The granted state is detected automatically (polling the non-prompting
// getForegroundPermissionsAsync every 2s, plus a one-time
// requestForegroundPermissionsAsync check whenever the app returns to the
// foreground — the latter catches Expo Go's own per-"experience" consent
// relay, which sits on top of the OS-level grant when testing in Expo Go
// specifically, not in a standalone build).
export function PermissionDeniedScreen({ onTryAgain }: Props) {
  const [granted, setGranted] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let pollTimer: ReturnType<typeof setInterval> | undefined;

    const applyStatus = (status: string) => {
      if (cancelled || status !== 'granted') return;
      setGranted(true);
      if (pollTimer) clearInterval(pollTimer);
    };

    const pollCheck = () => {
      Location.getForegroundPermissionsAsync()
        .then(({ status }) => applyStatus(status))
        .catch(() => {});
    };

    // Only on foreground-return, and only once per return — request() can
    // show the real OS/Expo-Go dialog if status is still undetermined, so
    // this must not run on a tight interval like pollCheck does.
    const foregroundCheck = () => {
      Location.requestForegroundPermissionsAsync()
        .then(({ status }) => applyStatus(status))
        .catch(() => {});
    };

    pollCheck();
    pollTimer = setInterval(pollCheck, 2000);
    const subscription = AppState.addEventListener('change', (nextState) => {
      if (nextState === 'active') foregroundCheck();
    });

    return () => {
      cancelled = true;
      if (pollTimer) clearInterval(pollTimer);
      subscription.remove();
    };
  }, []);

  if (granted) {
    return (
      <View style={styles.container}>
        <Mascot variant="permission" size={140} />
        <Text style={styles.title}>you're all set!</Text>
        <Text style={styles.subtitle}>location access is on — let's find you somewhere to eat.</Text>
        <Pressable style={styles.button} onPress={onTryAgain}>
          <Text style={styles.buttonText}>let's go!</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Mascot variant="empty" size={140} />
      <Text style={styles.title}>we need your location</Text>
      <Text style={styles.subtitle}>enable location access in Settings to find restaurants near you.</Text>
      <Pressable style={styles.button} onPress={() => Linking.openSettings()}>
        <Text style={styles.buttonText}>open settings</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.cream, padding: 24 },
  title: { fontFamily: 'Fredoka_700Bold', fontSize: 17, color: colors.ink, marginBottom: 8 },
  subtitle: { fontFamily: 'Quicksand_500Medium', fontSize: 12, color: colors.bodyTextOnCream, textAlign: 'center', maxWidth: 190, marginBottom: 24 },
  button: { backgroundColor: colors.primary, borderRadius: 99, paddingVertical: 13, paddingHorizontal: 32 },
  buttonText: { fontFamily: 'Quicksand_700Bold', color: colors.white, fontSize: 14 },
});
