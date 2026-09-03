import React from 'react';
import Svg, { Circle, Ellipse, Path, Rect } from 'react-native-svg';
import { colors } from '../theme/theme';

export type MascotVariant = 'default' | 'permission' | 'loading' | 'empty' | 'setupIcon';

interface Props {
  variant?: MascotVariant;
  size?: number;
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
  loading: { bowlColor: colors.accent, rimColor: colors.highlight, mouth: 'smile', showSteam: false, showBadge: false },
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

export function Mascot({ variant = 'default', size = 110 }: Props) {
  const style = VARIANT_STYLES[variant];

  return (
    <Svg width={size} height={size} viewBox="0 0 130 110">
      {style.showSteam ? (
        <>
          <Rect x={40} y={8} width={9} height={20} rx={4.5} fill={colors.accent} opacity={0.55} transform="rotate(-8 44.5 18)" />
          <Rect x={60} y={2} width={9} height={22} rx={4.5} fill={colors.accent} opacity={0.55} />
          <Rect x={80} y={8} width={9} height={20} rx={4.5} fill={colors.accent} opacity={0.55} transform="rotate(8 84.5 18)" />
        </>
      ) : null}

      <Path d={BOWL_PATH} fill={style.bowlColor} />
      {/* thin rim/lip ellipse, drawn on top of the body's top edge so it reads as the bowl's opening */}
      <Ellipse cx={65} cy={53} rx={48} ry={8} fill={style.rimColor} />

      {/* eyes sit right on the seam where the rim ellipse meets the bowl body */}
      <Circle cx={51} cy={60} r={6} fill={colors.cream} />
      <Circle cx={79} cy={60} r={6} fill={colors.cream} />
      <Circle cx={52.5} cy={61} r={3} fill={colors.ink} />
      <Circle cx={80.5} cy={61} r={3} fill={colors.ink} />

      <Path
        d={style.mouth === 'smile' ? SMILE_PATH : FROWN_PATH}
        stroke={colors.ink}
        strokeWidth={3.5}
        fill="none"
        strokeLinecap="round"
      />

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
