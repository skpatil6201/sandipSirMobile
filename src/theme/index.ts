/**
 * Djawei design tokens.
 *
 * Brand palette is taken from the Djawei logo: green, black and gold.
 *
 * @format
 */

export const lightColors = {
  // Brand — green
  primary: '#036F1A',
  primaryDark: '#013D11',
  primaryLight: '#0A8F2E',
  // Brand — gold
  accent: '#C9992B',
  accentDark: '#956910',
  accentLight: '#EEC352',
  // Brand — black
  black: '#050505',
  blackSoft: '#141414',

  // Surfaces
  background: '#F7F7F4',
  surface: '#FFFFFF',
  surfaceMuted: '#EEF1EC',

  // Text
  text: '#0A0F0B',
  textMuted: '#5E655F',
  textInverse: '#FFFFFF',

  // Feedback
  danger: '#D64545',
  success: '#12873A',
  border: '#DFE3DC',

  // Translucent tints
  primaryTint: 'rgba(3,111,26,0.08)',
  primaryTintStrong: 'rgba(3,111,26,0.16)',
  accentTint: 'rgba(201,153,43,0.14)',
  accentTintStrong: 'rgba(201,153,43,0.28)',
  successTint: 'rgba(18,135,58,0.12)',
  tintWhite18: 'rgba(255,255,255,0.18)',
  overlay: 'rgba(5,5,5,0.5)',
} as const;

export const darkColors: ThemeColors = {
  // Brand — green
  primary: '#2FAE57',
  primaryDark: '#036F1A',
  primaryLight: '#57C97B',
  // Brand — gold
  accent: '#E3B341',
  accentDark: '#C9992B',
  accentLight: '#F0D07A',
  // Brand — black
  black: '#050505',
  blackSoft: '#141414',

  // Surfaces
  background: '#0A0D0B',
  surface: '#141A15',
  surfaceMuted: '#1E2620',

  // Text
  text: '#F3F6F2',
  textMuted: '#9AA69C',
  textInverse: '#06120A',

  // Feedback
  danger: '#FF7A7A',
  success: '#43D07F',
  border: '#2A342C',

  // Translucent tints
  primaryTint: 'rgba(47,174,87,0.16)',
  primaryTintStrong: 'rgba(47,174,87,0.28)',
  accentTint: 'rgba(227,179,65,0.16)',
  accentTintStrong: 'rgba(227,179,65,0.3)',
  successTint: 'rgba(67,208,127,0.16)',
  tintWhite18: 'rgba(255,255,255,0.18)',
  overlay: 'rgba(0,0,0,0.65)',
};

export type ThemeColors = {
  [K in keyof typeof lightColors]: string;
};

/** @deprecated Use `useTheme().colors` so the active palette applies. */
export const colors = lightColors;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

export const radius = {
  /** Buttons, inputs, tiles and compact rows. */
  sm: 12,
  /** Cards and sheets. */
  md: 20,
  /** Cards and sheets (alias kept for existing screens). */
  lg: 20,
  /** Bottom corners of the Home hero. */
  hero: 28,
  pill: 999,
} as const;

export const typography = {
  display: { fontSize: 34, lineHeight: 40, fontWeight: '700' as const },
  title: { fontSize: 24, lineHeight: 30, fontWeight: '700' as const },
  navTitle: { fontSize: 17, lineHeight: 22, fontWeight: '600' as const },
  heading: { fontSize: 18, lineHeight: 23, fontWeight: '600' as const },
  body: { fontSize: 15, lineHeight: 20, fontWeight: '400' as const },
  caption: { fontSize: 13, lineHeight: 17, fontWeight: '400' as const },
  captionLong: { fontSize: 13, lineHeight: 19, fontWeight: '400' as const },
  micro: { fontSize: 11, lineHeight: 14, fontWeight: '600' as const },
} as const;
