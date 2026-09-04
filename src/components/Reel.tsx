import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { LinearGradient } from 'expo-linear-gradient';
import { Restaurant } from '../types';
import { ReelNeighbors } from '../hooks/useWheel';
import { colors, componentTokens, shadow } from '../theme/theme';

const ROW_HEIGHT = componentTokens.reelRow.height;
// 5 visible rows (2 dimmed above/below the highlight) rather than the
// design's original 3 — a fuller "slot machine" feel, and makes better use
// of the larger item pools now that wheelSize caps were raised (see theme).
const VISIBLE_ROWS = 5;
const REEL_HEIGHT = ROW_HEIGHT * VISIBLE_ROWS;
const CENTER_ROW_INDEX = Math.floor(VISIBLE_ROWS / 2);
// A transparent version of `cream` itself (not the 'transparent' keyword,
// which is transparent BLACK) — fading toward black-at-zero-alpha still
// blends the RGB channels toward black as it interpolates, producing a
// visible muddy/gray band instead of a clean fade into the cream bg.
const TRANSPARENT_CREAM = 'rgba(244, 242, 231, 0)';

function formatDistance(meters: number): string {
  return meters < 1000 ? `${Math.round(meters)} m` : `${(meters / 1000).toFixed(1)} km`;
}

function formatMeta(restaurant: Restaurant): string {
  return [restaurant.category, formatDistance(restaurant.distanceMeters)].filter(Boolean).join(' · ');
}

function CheckIcon() {
  return (
    <View style={styles.checkIcon}>
      <Svg width={10} height={8} viewBox="0 0 10 8">
        <Path d="M1 4L4 7L9 1" stroke={colors.white} strokeWidth={1.6} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </Svg>
    </View>
  );
}

function Row({ restaurant, nameStyle, dimmed }: { restaurant: Restaurant; nameStyle: object; dimmed?: boolean }) {
  return (
    <View style={[styles.row, dimmed && styles.dimmedRow]}>
      <View style={styles.emptyIcon} />
      <View style={styles.rowText}>
        <Text style={nameStyle} numberOfLines={1}>
          {restaurant.name}
        </Text>
        <Text style={styles.meta}>{formatMeta(restaurant)}</Text>
      </View>
    </View>
  );
}

interface ScrollingProps {
  mode: 'scrolling';
  items: Restaurant[];
}
interface LandedProps {
  mode: 'landed';
  winner: Restaurant;
  neighbors: ReelNeighbors;
}
type Props = ScrollingProps | LandedProps;

// 'scrolling' (Spin): a decorative, always-looping strip behind a fixed
// highlight window — per the design, this motion has no relation to the
// eventual winner, which is precomputed elsewhere (see useWheel.landOnReel).
// 'landed' (Result): the highlight window now holds the real winner, with
// two dimmed neighbor rows above/below.
export function Reel(props: Props) {
  const [stepIndex, setStepIndex] = useState(0);

  // The source's reel loop is a discrete `steps(4)` CSS animation (jumps,
  // never interpolates) — a plain stepped interval reproduces that more
  // faithfully than an Animated.timing eased between positions.
  useEffect(() => {
    if (props.mode !== 'scrolling') return;
    const interval = setInterval(() => {
      setStepIndex((i) => (i + 1) % 4);
    }, 150);
    return () => clearInterval(interval);
  }, [props.mode]);

  if (props.mode === 'scrolling') {
    const stripItems =
      props.items.length > 0 ? Array.from({ length: 40 }, (_, i) => props.items[i % props.items.length]) : [];

    return (
      <View style={styles.container}>
        <View style={styles.highlightWindow} pointerEvents="none" />
        <View style={{ transform: [{ translateY: -(stepIndex * ROW_HEIGHT) }] }}>
          {stripItems.map((restaurant, i) => (
            <Row key={i} restaurant={restaurant} nameStyle={styles.scrollingName} />
          ))}
        </View>
        <LinearGradient
          colors={[colors.cream, TRANSPARENT_CREAM]}
          style={[styles.fade, styles.fadeTop, { height: ROW_HEIGHT }]}
          pointerEvents="none"
        />
        <LinearGradient
          colors={[TRANSPARENT_CREAM, colors.cream]}
          style={[styles.fade, styles.fadeBottom, { height: ROW_HEIGHT }]}
          pointerEvents="none"
        />
      </View>
    );
  }

  const { winner, neighbors } = props;
  return (
    <View style={[styles.container, styles.landedContainer]}>
      <View style={styles.highlightWindow}>
        <View style={styles.row}>
          <CheckIcon />
          <View style={styles.rowText}>
            <Text style={styles.winnerName} numberOfLines={1}>
              {winner.name}
            </Text>
            <Text style={styles.meta}>{formatMeta(winner)}</Text>
          </View>
        </View>
      </View>
      <View style={styles.neighborStack}>
        <Row restaurant={neighbors.before[0]} nameStyle={styles.scrollingName} dimmed />
        <Row restaurant={neighbors.before[1]} nameStyle={styles.scrollingName} dimmed />
        <View style={{ height: ROW_HEIGHT }} />
        <Row restaurant={neighbors.after[0]} nameStyle={styles.scrollingName} dimmed />
        <Row restaurant={neighbors.after[1]} nameStyle={styles.scrollingName} dimmed />
      </View>
      <LinearGradient
        colors={[colors.cream, TRANSPARENT_CREAM]}
        style={[styles.fade, styles.fadeTop, { height: 20 }]}
        pointerEvents="none"
      />
      <LinearGradient
        colors={[TRANSPARENT_CREAM, colors.cream]}
        style={[styles.fade, styles.fadeBottom, { height: 20 }]}
        pointerEvents="none"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { position: 'relative', width: '100%', height: REEL_HEIGHT, overflow: 'hidden' },
  landedContainer: { marginBottom: 22 },
  highlightWindow: {
    position: 'absolute',
    top: ROW_HEIGHT * CENTER_ROW_INDEX,
    left: 0,
    right: 0,
    height: ROW_HEIGHT,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: colors.primary,
    zIndex: 2,
    ...shadow.card,
  },
  neighborStack: { position: 'absolute', top: 0, left: 0, right: 0 },
  row: { height: ROW_HEIGHT, flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 10 },
  dimmedRow: { opacity: 0.4 },
  rowText: { flex: 1, minWidth: 0 },
  scrollingName: { fontFamily: 'Quicksand_700Bold', fontSize: 13, color: colors.ink },
  winnerName: { fontFamily: 'Fredoka_700Bold', fontSize: 14, color: colors.ink },
  meta: { fontFamily: 'Quicksand_500Medium', fontSize: 10, color: colors.textMuted },
  emptyIcon: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: colors.border },
  checkIcon: { width: 20, height: 20, borderRadius: 10, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
  fade: { position: 'absolute', left: 0, right: 0, zIndex: 1 },
  fadeTop: { top: 0 },
  fadeBottom: { bottom: 0 },
});
