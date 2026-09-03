/**
 * LearnOS design tokens.
 *
 * Colours and type come from the LearnOS brand board and the
 * `LearnOS App.dc.html` prototype. Keep these in sync with the design — every
 * screen pulls from here rather than hard-coding hex values.
 */

export const C = {
  // Surfaces
  bg: '#0B0B12',
  bgDeep: '#08080E',
  surface: '#151522',
  surfaceAlt: '#1C1C2A',
  surfaceDeep: '#10101A',
  surfaceDim: '#131320',
  surfaceSheet: '#12121D',
  surfaceGreen: '#161F1C',
  surfaceTeal: '#132022',
  stripeA: '#232338',
  stripeB: '#1C1C2A',

  // Text
  text: '#F5F5F7',
  body: '#C9C9D6',
  muted: '#8D8DA3',
  dim: '#6F6F88',
  faint: '#5C5C74',

  // Brand
  purple: '#7C5CFF',
  purpleDeep: '#5C6BFF',
  purpleBright: '#8B6BFF',
  purpleDark: '#6A4CFF',
  purpleLight: '#B9A6FF',
  purpleSoft: '#C4B4FF',
  purpleTint: '#D6D2FF',
  blue: '#3D8BFF',
  blueLight: '#7FB2FF',
  teal: '#00D4C8',
  tealLight: '#5FE3DA',
  green: '#47D79E',
  greenLight: '#7FE8BE',
  greenText: '#D6E8DF',
  amber: '#FFC857',
  amberLight: '#FFD98A',
  amberText: '#E8E0CF',
  red: '#FF647C',
  redLight: '#FF9AAB',

  // Lines
  border: 'rgba(255,255,255,0.08)',
  border2: 'rgba(255,255,255,0.10)',
  borderSoft: 'rgba(255,255,255,0.07)',
  borderStrong: 'rgba(255,255,255,0.14)',
  borderDashed: 'rgba(255,255,255,0.16)',
  track: 'rgba(255,255,255,0.08)',
  trackSoft: 'rgba(255,255,255,0.07)',

  // Alpha helpers used repeatedly in the design
  purpleA08: 'rgba(124,92,255,0.08)',
  purpleA12: 'rgba(124,92,255,0.12)',
  purpleA14: 'rgba(124,92,255,0.14)',
  purpleA16: 'rgba(124,92,255,0.16)',
  purpleA18: 'rgba(124,92,255,0.18)',
  purpleA24: 'rgba(124,92,255,0.24)',
  purpleA28: 'rgba(124,92,255,0.28)',
  purpleA30: 'rgba(124,92,255,0.30)',
  purpleA35: 'rgba(124,92,255,0.35)',
  purpleA40: 'rgba(124,92,255,0.40)',
  purpleA45: 'rgba(124,92,255,0.45)',
  purpleA55: 'rgba(124,92,255,0.55)',
  purpleA70: 'rgba(124,92,255,0.70)',
  purpleA75: 'rgba(124,92,255,0.75)',
  greenA12: 'rgba(71,215,158,0.12)',
  greenA14: 'rgba(71,215,158,0.14)',
  greenA16: 'rgba(71,215,158,0.16)',
  greenA18: 'rgba(71,215,158,0.18)',
  greenA22: 'rgba(71,215,158,0.22)',
  greenA28: 'rgba(71,215,158,0.28)',
  greenA30: 'rgba(71,215,158,0.30)',
  greenA35: 'rgba(71,215,158,0.35)',
  greenA40: 'rgba(71,215,158,0.40)',
  greenA50: 'rgba(71,215,158,0.50)',
  tealA12: 'rgba(0,212,200,0.12)',
  tealA14: 'rgba(0,212,200,0.14)',
  tealA16: 'rgba(0,212,200,0.16)',
  tealA30: 'rgba(0,212,200,0.30)',
  tealA35: 'rgba(0,212,200,0.35)',
  tealA40: 'rgba(0,212,200,0.40)',
  tealA45: 'rgba(0,212,200,0.45)',
  tealA55: 'rgba(0,212,200,0.55)',
  blueA14: 'rgba(61,139,255,0.14)',
  blueA30: 'rgba(61,139,255,0.30)',
  amberA12: 'rgba(255,200,87,0.12)',
  amberA14: 'rgba(255,200,87,0.14)',
  amberA20: 'rgba(255,200,87,0.20)',
  amberA22: 'rgba(255,200,87,0.22)',
  amberA30: 'rgba(255,200,87,0.30)',
  amberA35: 'rgba(255,200,87,0.35)',
  redA12: 'rgba(255,100,124,0.12)',
  redA14: 'rgba(255,100,124,0.14)',
  redA25: 'rgba(255,100,124,0.25)',
} as const;

/**
 * Poppins has no synthetic weights on Android, so every weight is its own
 * family. Never pair these with `fontWeight`.
 */
export const F = {
  regular: 'Poppins_400Regular',
  medium: 'Poppins_500Medium',
  semibold: 'Poppins_600SemiBold',
  bold: 'Poppins_700Bold',
  mono: 'JetBrainsMono_400Regular',
  monoMedium: 'JetBrainsMono_500Medium',
} as const;

/** CSS `line-height: 1.6` → absolute px, which is what RN wants. */
export const lh = (size: number, multiplier: number) => Math.round(size * multiplier);

/** Brand gradients reused across screens. */
export const G = {
  cta: [C.purple, C.purpleDeep] as const,
  ctaBright: [C.purpleBright, C.purpleDark] as const,
  progress: [C.purple, C.teal] as const,
  avatar: [C.purple, C.teal] as const,
  mastery: [C.green, C.teal] as const,
  headline: [C.purpleLight, C.tealLight] as const,
};

/**
 * CSS gradient angles → RN `start`/`end` unit-square points.
 * CSS 0deg points to the top and rotates clockwise, so the direction vector in
 * screen space (y down) is (sin θ, −cos θ).
 */
export function angle(deg: number) {
  const rad = (deg * Math.PI) / 180;
  const dx = Math.sin(rad);
  const dy = -Math.cos(rad);
  // Project the direction onto the unit square, centred on (0.5, 0.5).
  const scale = 0.5 / Math.max(Math.abs(dx), Math.abs(dy));
  return {
    start: { x: 0.5 - dx * scale, y: 0.5 - dy * scale },
    end: { x: 0.5 + dx * scale, y: 0.5 + dy * scale },
  };
}
