import React, { useEffect, useRef, useState } from 'react';
import Svg, { Circle, Ellipse, Path } from 'react-native-svg';
import { Animated, Easing } from 'react-native';
import { colors } from '../theme/theme';

const AnimatedPath = Animated.createAnimatedComponent(Path);

export type MascotVariant = 'default' | 'permission' | 'loading' | 'empty' | 'setupIcon';

interface Props {
  variant?: MascotVariant;
  size?: number;
  // Set to false to freeze the loading variant's mouth-cycle/steam once
  // there's no more waiting to signal (e.g. results have come back).
  animated?: boolean;
}

interface VariantStyle {
  bowlColor: string;
  rimColor: string;
  mouth: 'smile' | 'frown';
  showSteam: boolean;
  showBadge: boolean;
}

const VARIANT_STYLES: Record<MascotVariant, VariantStyle> = {
  default: { bowlColor: colors.primary, rimColor: colors.accent, mouth: 'smile', showSteam: true, showBadge: false },
  setupIcon: { bowlColor: colors.primary, rimColor: colors.accent, mouth: 'smile', showSteam: false, showBadge: false },
  permission: { bowlColor: colors.primary, rimColor: colors.accent, mouth: 'smile', showSteam: false, showBadge: true },
  loading: { bowlColor: colors.accent, rimColor: colors.highlight, mouth: 'smile', showSteam: true, showBadge: false },
  empty: { bowlColor: colors.primary, rimColor: colors.accent, mouth: 'frown', showSteam: false, showBadge: false },
};

// Bowl body: a rounded, slightly bulging belly tapering to a rounded
// bottom, with its open top matching the rim ellipse's width so the two
// shapes read as one bowl rather than a body with a collar stuck on top.
// Both halves meet the bottom center with a horizontal tangent (via the
// matching control points on either side of x=65) so the bottom is one
// smooth curve rather than a pointed cusp.
const BOWL_PATH = 'M17,53 C10,95 40,108 65,108 C90,108 120,95 113,53 Z';
// Both mouths share the same corner y (87) so smile/frown sit at the same
// level and only the curve direction differs.
const SMILE_PATH = 'M53 87 Q65 96 77 87';
const FROWN_PATH = 'M53 87 Q65 78 77 87';
// The loading mascot's mouth cycles through several frames — its own paths,
// kept separate from SMILE_PATH/FROWN_PATH above, all sharing the same
// vertical center (y=89, matching the "o"'s cy) so the animation reads as
// one mouth changing shape in place rather than jumping between frames.
const LOADING_SMILE_PATH = 'M53 84.5 Q65 93.5 77 84.5';
// Filled "D on its back" shape (flat top, rounded bottom) for the wide/bold
// smile frame — a solid open-mouth grin rather than just a thicker stroke.
const LOADING_WIDE_SMILE_PATH = 'M53,81.5 L77,81.5 C77,91.5 71,96.5 65,96.5 C59,96.5 53,91.5 53,81.5 Z';
// A short, closed/neutral line — a brief "pause" beat between expressions.
const LOADING_FLAT_PATH = 'M58 89 L72 89';

type LoadingMouthFrame = 'smile' | 'wideSmile' | 'o' | 'smallO' | 'flat';
// 'o' and 'smallO' are kept apart (never adjacent, including the loop-back
// point) so the two round shapes don't sit back-to-back.
const LOADING_MOUTH_FRAMES: LoadingMouthFrame[] = ['smile', 'wideSmile', 'o', 'wideSmile', 'smallO', 'flat'];
const LOADING_MOUTH_FRAME_MS = 380;

// Soft S-curves (rather than straight rounded rects) so the steam actually
// reads as a wisp — each rises from just above the rim and wavers as it
// goes. Shown on both `default` and `loading`; only `loading` animates it.
const STEAM_PATHS = [
  'M44 28 C40 16 48 8 44 -4',
  'M65 24 C61 10 69 2 65 -12',
  'M86 28 C90 16 82 8 86 -4',
];

// Gentle staggered rise-and-fade loop for the loading mascot's steam
// wisps, so they feel like they're actually drifting off hot food.
function useSteamRise(enabled: boolean, delay: number) {
  const t = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!enabled) {
      t.stopAnimation();
      t.setValue(0);
      return;
    }
    const loop = Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.timing(t, { toValue: 1, duration: 900, easing: Easing.inOut(Easing.quad), useNativeDriver: false }),
        Animated.timing(t, { toValue: 0, duration: 900, easing: Easing.inOut(Easing.quad), useNativeDriver: false }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [enabled, delay, t]);

  return t;
}

export function Mascot({ variant = 'default', size = 110, animated = true }: Props) {
  const style = VARIANT_STYLES[variant];
  const [loadingMouthIndex, setLoadingMouthIndex] = useState(0);
  const loadingAnimated = variant === 'loading' && animated;

  useEffect(() => {
    if (!loadingAnimated) {
      setLoadingMouthIndex(0);
      return;
    }
    const interval = setInterval(() => {
      setLoadingMouthIndex((i) => (i + 1) % LOADING_MOUTH_FRAMES.length);
    }, LOADING_MOUTH_FRAME_MS);
    return () => clearInterval(interval);
  }, [loadingAnimated]);

  const loadingMouthFrame = LOADING_MOUTH_FRAMES[loadingMouthIndex];

  // Steam is visible on any variant with showSteam, but only actually
  // animates on the loading mascot (and only while `animated` is true).
  const steamAnimated = variant === 'loading' && animated;
  const steam1 = useSteamRise(style.showSteam && steamAnimated, 0);
  const steam2 = useSteamRise(style.showSteam && steamAnimated, 250);
  const steam3 = useSteamRise(style.showSteam && steamAnimated, 500);
  const steamValues = [steam1, steam2, steam3];

  return (
    <Svg width={size} height={size} viewBox="0 0 130 110">
      {style.showSteam
        ? STEAM_PATHS.map((d, i) => (
            <AnimatedPath
              key={i}
              d={d}
              stroke={style.rimColor}
              strokeWidth={3}
              fill="none"
              strokeLinecap="round"
              transform={steamValues[i].interpolate({
                inputRange: [0, 1],
                outputRange: ['translate(0,0)', 'translate(0,-5)'],
              })}
              opacity={steamValues[i].interpolate({ inputRange: [0, 1], outputRange: [0.5, 0.22] })}
            />
          ))
        : null}

      <Path d={BOWL_PATH} fill={style.bowlColor} />
      {/* thin rim/lip ellipse, drawn on top of the body's top edge so it reads as the bowl's opening */}
      <Ellipse cx={65} cy={53} rx={48} ry={8} fill={style.rimColor} />

      {/* eyes sit right on the seam where the rim ellipse meets the bowl body */}
      <Circle cx={51} cy={60} r={6} fill={colors.cream} />
      <Circle cx={79} cy={60} r={6} fill={colors.cream} />
      <Circle cx={52.5} cy={61} r={3} fill={colors.ink} />
      <Circle cx={80.5} cy={61} r={3} fill={colors.ink} />

      {variant === 'loading' ? (
        loadingMouthFrame === 'o' ? (
          <Ellipse cx={65} cy={89} rx={7} ry={9} fill={colors.ink} />
        ) : loadingMouthFrame === 'smallO' ? (
          <Ellipse cx={65} cy={89} rx={4} ry={5} fill={colors.ink} />
        ) : loadingMouthFrame === 'wideSmile' ? (
          <Path d={LOADING_WIDE_SMILE_PATH} fill={colors.ink} />
        ) : loadingMouthFrame === 'flat' ? (
          <Path d={LOADING_FLAT_PATH} stroke={colors.ink} strokeWidth={3.5} fill="none" strokeLinecap="round" />
        ) : (
          <Path d={LOADING_SMILE_PATH} stroke={colors.ink} strokeWidth={3.5} fill="none" strokeLinecap="round" />
        )
      ) : (
        <Path
          d={style.mouth === 'smile' ? SMILE_PATH : FROWN_PATH}
          stroke={colors.ink}
          strokeWidth={3.5}
          fill="none"
          strokeLinecap="round"
        />
      )}

      {/* single flat-colored pin, matching the source's one-shape icon (no separate hole/dot) */}
      {style.showBadge ? (
        <>
          <Circle cx={101} cy={92} r={15} fill={colors.accent} stroke={colors.cream} strokeWidth={3} />
          <Path
            d="M101 83.2 C105.4 83.2 108.6 86.4 108.6 90 C108.6 94.4 101 100.8 101 100.8 C101 100.8 93.4 94.4 93.4 90 C93.4 86.4 96.6 83.2 101 83.2 Z"
            fill={colors.ink}
          />
        </>
      ) : null}
    </Svg>
  );
}
