// Precise sRGB hex computed from design.tokens.json's authoritative OKLCH
// values (its own hex is a rounded approximation), via standard OKLab math.
export const colors = {
  primary: '#298646',
  primaryPressed: '#196632',
  accent: '#D56F2C',
  highlight: '#D7BB70',
  ink: '#1C281A',
  inkDark: '#1E2E1B',
  cream: '#F4F2E7',
  sand: '#E0DED3',
  textMuted: '#5A6857',
  border: '#C1BDB3',
  // inline one-offs used directly in the prototype markup, not in tokens.json:
  bodyTextOnCream: '#3F4C3D',
  sliderCaption: '#7A8378',
  segmentCaption: '#6C756A',
  loadingRingTrack: '#475C42',
  loadingSubcopy: '#8BA885',
  spinItText: '#2A2A2E',
  white: '#FFFFFF',
} as const;

export const typography = {
  fontFamily: {
    heading: 'Fredoka_700Bold',
    headingSemibold: 'Fredoka_600SemiBold',
    body: 'Quicksand_500Medium',
    bodySemibold: 'Quicksand_600SemiBold',
    bodyBold: 'Quicksand_700Bold',
  },
  scale: {
    // onboarding wordmark
    h1: { fontSize: 28, fontFamily: 'Fredoka_700Bold' },
    // default screen-title size; screens override locally where the source
    // literal differs (Setup 15, Permission 18, Empty 17, Spin/Result 16)
    h2: { fontSize: 16, fontFamily: 'Fredoka_700Bold' },
    // field labels, chip text
    label: { fontSize: 12, fontFamily: 'Quicksand_700Bold' },
    // subcopy/taglines
    body: { fontSize: 12, fontFamily: 'Quicksand_500Medium' },
    // "cuisine · distance"
    meta: { fontSize: 10, fontFamily: 'Quicksand_500Medium' },
  },
} as const;

export const spacing = {
  screenPadding: 20,
  componentGap: 8,
  sectionGap: 20,
  rowHeight: 52,
} as const;

export const radius = {
  pill: 99,
  card: 12,
} as const;

export const shadow = {
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
} as const;

export const componentTokens = {
  primaryButton: {
    bg: colors.primary,
    text: colors.white,
    borderRadius: radius.pill,
    paddingVertical: 13,
    fontWeight: '700' as const,
  },
  secondaryButton: {
    bg: 'transparent',
    borderWidth: 2,
    borderColor: colors.border,
    text: colors.textMuted,
    borderRadius: radius.pill,
  },
  chip: {
    radius: radius.pill,
    bgSelected: colors.primary,
    bgUnselected: colors.sand,
    textSelected: colors.white,
    textUnselected: colors.ink,
  },
  reelRow: {
    height: 52,
    iconSize: 20,
    iconBorderWidth: 2,
    iconBorderColor: colors.border,
    iconCheckedBg: colors.primary,
  },
  wheel: {
    diameterCompact: 96,
    colorCycle: [colors.primary, colors.accent, colors.highlight],
    // Fixed rather than tied to few/some/lots — purely decorative, and 8
    // wedges with a 3-color cycle never repeats evenly per rotation (8 isn't
    // a multiple of 3), giving a livelier pattern than 4 or 6.
    segmentCount: 8 as const,
  },
  // Higher than the design's original 4/6/8 — those were sized for a
  // pie-slice wheel's per-slice legibility limit, which doesn't apply to
  // the reel mechanic (fixed-height rows regardless of pool size). A
  // bigger pool also means more variety scrolling past during the spin.
  sizeCaps: { few: 6, some: 10, lots: 15 } as Record<'few' | 'some' | 'lots', number>,
} as const;
