/**
 * Shared primitives used across the LearnOS screens.
 *
 * These cover the things the prototype expressed in CSS that RN has no direct
 * equivalent for: repeating stripe placeholders, radial glows, SVG progress
 * rings and gradient bars.
 */
import React, { useId } from 'react';
import {
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  TextProps,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, {
  Circle,
  Defs,
  LinearGradient as SvgLinearGradient,
  Pattern,
  RadialGradient,
  Rect,
  Stop,
} from 'react-native-svg';
import { angle, C, F, G } from '../theme';

/* ── Text ─────────────────────────────────────────────────────────────── */

/** Text with the brand font and colour applied by default. */
export function Txt({ style, ...rest }: TextProps) {
  return <Text {...rest} style={[styles.txt, style]} />;
}

/** The uppercase, wide-tracked section headings used throughout. */
export function SectionLabel({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <View style={style}>
      <Text style={styles.sectionLabel}>{String(children).toUpperCase()}</Text>
    </View>
  );
}

/* ── Placeholders ─────────────────────────────────────────────────────── */

export type StripeVariant =
  | 'cover' // book covers and thumbnails
  | 'coverFine' // smaller thumbnails, tighter bands
  | 'coverLight' // the small book chip on the map's root node
  | 'paper' // a scanned page, high contrast
  | 'paperSoft' // a page thumbnail, lower contrast
  | 'pageStack' // the page behind the scanner reticle
  | 'texture'; // the faint diagonal wash on the camera card

const STRIPES: Record<
  StripeVariant,
  { colors: [string, string]; bands: [number, number]; rotate: number }
> = {
  cover: { colors: [C.stripeA, C.stripeB], bands: [6, 6], rotate: -45 },
  coverFine: { colors: [C.stripeA, C.stripeB], bands: [5, 5], rotate: -45 },
  coverLight: { colors: ['#33334D', C.stripeA], bands: [4, 4], rotate: -45 },
  paper: { colors: ['rgba(245,245,247,0.9)', 'rgba(228,228,235,0.75)'], bands: [4, 6], rotate: 0 },
  paperSoft: { colors: ['rgba(245,245,247,0.7)', 'rgba(228,228,235,0.55)'], bands: [3, 4], rotate: 0 },
  pageStack: {
    colors: ['rgba(245,245,247,0.86)', 'rgba(245,245,247,0.6)'],
    bands: [3, 4],
    rotate: 0,
  },
  texture: { colors: ['rgba(255,255,255,0.03)', 'transparent'], bands: [8, 8], rotate: -25 },
};

/**
 * Stand-in for imagery the designer marked as a placeholder — book covers,
 * camera frames and scanned pages. Reproduces CSS `repeating-linear-gradient`
 * with an SVG pattern.
 */
export function Stripes({
  variant = 'cover',
  style,
  children,
}: {
  variant?: StripeVariant;
  style?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
}) {
  const id = `stripes-${useId().replace(/[^a-zA-Z0-9]/g, '')}`;
  const { colors, bands, rotate } = STRIPES[variant];
  const period = bands[0] + bands[1];

  return (
    <View style={style}>
      <View style={StyleSheet.absoluteFill}>
        <Svg width="100%" height="100%">
          <Defs>
            <Pattern
              id={id}
              width={period}
              height={period}
              patternUnits="userSpaceOnUse"
              patternTransform={`rotate(${rotate})`}
            >
              <Rect x={0} y={0} width={period} height={bands[0]} fill={colors[0]} />
              <Rect x={0} y={bands[0]} width={period} height={bands[1]} fill={colors[1]} />
            </Pattern>
          </Defs>
          <Rect x={0} y={0} width="100%" height="100%" fill={`url(#${id})`} />
        </Svg>
      </View>
      {children}
    </View>
  );
}

/** The soft radial halos behind the analysis orb, mastery ring and map. */
export function RadialGlow({
  color,
  opacity = 0.22,
  stop = 0.7,
  style,
}: {
  color: string;
  opacity?: number;
  stop?: number;
  style?: StyleProp<ViewStyle>;
}) {
  const id = `glow-${useId().replace(/[^a-zA-Z0-9]/g, '')}`;
  return (
    <View pointerEvents="none" style={style}>
      <Svg width="100%" height="100%">
        <Defs>
          <RadialGradient id={id} cx="50%" cy="50%" r="50%">
            <Stop offset="0" stopColor={color} stopOpacity={opacity} />
            <Stop offset={String(stop)} stopColor={color} stopOpacity={0} />
          </RadialGradient>
        </Defs>
        <Rect x={0} y={0} width="100%" height="100%" fill={`url(#${id})`} />
      </Svg>
    </View>
  );
}

/* ── Progress ─────────────────────────────────────────────────────────── */

/**
 * The SVG donut used for mastery percentages. `progress` is 0–1; the ring
 * starts at 12 o'clock like the prototype's `rotate(-90deg)`.
 */
export function Ring({
  size,
  stroke,
  progress,
  color = C.purple,
  gradient,
  track = C.track,
  children,
}: {
  size: number;
  stroke: number;
  progress: number;
  color?: string;
  gradient?: readonly [string, string];
  track?: string;
  children?: React.ReactNode;
}) {
  const id = `ring-${useId().replace(/[^a-zA-Z0-9]/g, '')}`;
  const r = (size - stroke) / 2;
  const circumference = 2 * Math.PI * r;
  const c = size / 2;

  return (
    <View style={{ width: size, height: size }}>
      <Svg width={size} height={size}>
        {gradient && (
          <Defs>
            <SvgLinearGradient id={id} x1="0" y1="0" x2="1" y2="1">
              <Stop offset="0" stopColor={gradient[0]} />
              <Stop offset="1" stopColor={gradient[1]} />
            </SvgLinearGradient>
          </Defs>
        )}
        <Circle cx={c} cy={c} r={r} fill="none" stroke={track} strokeWidth={stroke} />
        <Circle
          cx={c}
          cy={c}
          r={r}
          fill="none"
          stroke={gradient ? `url(#${id})` : color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - progress)}
          transform={`rotate(-90 ${c} ${c})`}
        />
      </Svg>
      {children != null && (
        <View style={[StyleSheet.absoluteFill, styles.center]}>{children}</View>
      )}
    </View>
  );
}

/** A rounded track with a gradient (or solid) fill — used for every meter. */
export function Bar({
  progress,
  height = 6,
  colors,
  color,
  track = C.trackSoft,
  style,
}: {
  progress: number;
  height?: number;
  colors?: readonly string[];
  color?: string;
  track?: string;
  style?: StyleProp<ViewStyle>;
}) {
  const width = `${Math.max(0, Math.min(1, progress)) * 100}%` as const;
  return (
    <View
      style={[{ height, borderRadius: 999, backgroundColor: track, overflow: 'hidden' }, style]}
    >
      {colors ? (
        <LinearGradient
          colors={colors as [string, string, ...string[]]}
          {...angle(90)}
          style={{ width, height: '100%', borderRadius: 999 }}
        />
      ) : (
        <View
          style={{ width, height: '100%', borderRadius: 999, backgroundColor: color ?? C.purple }}
        />
      )}
    </View>
  );
}

/* ── Buttons ──────────────────────────────────────────────────────────── */

/** The gradient call-to-action that closes most screens. */
export function PrimaryButton({
  label,
  onPress,
  style,
  contentStyle,
  textStyle,
  colors = G.cta,
  textColor = '#fff',
  glow = true,
}: {
  label: string;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  /** Overrides the gradient's padding/radius — used by the map's Start button. */
  contentStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  colors?: readonly [string, string];
  textColor?: string;
  glow?: boolean;
}) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [{ opacity: pressed ? 0.85 : 1 }, style]}>
      <LinearGradient
        colors={colors as [string, string]}
        {...angle(135)}
        style={[
          styles.primaryBtn,
          glow && { boxShadow: '0 12px 30px -12px rgba(124,92,255,0.9)' },
          contentStyle,
        ]}
      >
        <Text style={[styles.primaryBtnText, { color: textColor }, textStyle]}>{label}</Text>
      </LinearGradient>
    </Pressable>
  );
}

/** The muted outline button that sits under most primary actions. */
export function SecondaryButton({
  label,
  onPress,
  style,
}: {
  label: string;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.secondaryBtn, { opacity: pressed ? 0.8 : 1 }, style]}
    >
      <Text style={styles.secondaryBtnText}>{label}</Text>
    </Pressable>
  );
}

/** The circular ‹ back affordance in screen headers. */
export function BackButton({ onPress }: { onPress?: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      hitSlop={8}
      style={({ pressed }) => [styles.backBtn, { opacity: pressed ? 0.7 : 1 }]}
    >
      <Text style={styles.backBtnText}>‹</Text>
    </Pressable>
  );
}

/* ── Small compositions ───────────────────────────────────────────────── */

/** One of the three-up stat tiles (streak, mastery, books analysed …). */
export function StatTile({
  value,
  label,
  color = C.text,
  deep,
  style,
}: {
  value: string;
  label: string;
  color?: string;
  deep?: boolean;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <View style={[styles.statTile, deep && { backgroundColor: C.surfaceDeep }, style]}>
      <Text style={[styles.statValue, { color }]}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

/** A pill-shaped filter chip; `active` is the purple selected state. */
export function Chip({
  label,
  active,
  onPress,
  style,
}: {
  label: string;
  active?: boolean;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <Pressable onPress={onPress} style={[styles.chip, active && styles.chipActive, style]}>
      <Text style={[styles.chipText, active && styles.chipTextActive]}>{label}</Text>
    </Pressable>
  );
}

/**
 * A row in the analysis / path-building checklists: done, in-progress or
 * pending, matching the prototype's `step()` helper.
 */
export function StepRow({ label, state }: { label: string; state: 'done' | 'active' | 'todo' }) {
  const marker = state === 'done' ? '✓' : state === 'active' ? '●' : '';
  const bg =
    state === 'done' ? C.greenA16 : state === 'active' ? C.purpleA18 : 'transparent';
  const fg = state === 'done' ? C.green : state === 'active' ? C.purpleSoft : C.muted;
  const bd =
    state === 'done' ? C.greenA40 : state === 'active' ? C.purpleA55 : C.borderStrong;
  const tc = state === 'done' ? C.body : state === 'active' ? C.text : C.dim;

  return (
    <View style={styles.stepRow}>
      <View style={[styles.stepMark, { backgroundColor: bg, borderColor: bd }]}>
        <Text style={[styles.stepMarkText, { color: fg }]}>{marker}</Text>
      </View>
      <Text style={[styles.stepLabel, { color: tc }]}>{label}</Text>
    </View>
  );
}

/** The small locked-padlock glyph on unreachable map nodes. */
export function LockGlyph({ color = '#6B6B82' }: { color?: string }) {
  return (
    <View style={styles.lock}>
      <View style={[styles.lockShackle, { borderColor: color }]} />
      <View style={[styles.lockBody, { backgroundColor: color }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  txt: { fontFamily: F.regular, color: C.text },
  center: { alignItems: 'center', justifyContent: 'center' },
  sectionLabel: {
    fontFamily: F.semibold,
    fontSize: 11,
    letterSpacing: 1.6,
    color: C.muted,
  },
  primaryBtn: {
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryBtnText: { fontFamily: F.semibold, fontSize: 15.5 },
  secondaryBtn: {
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 18,
    backgroundColor: C.surface,
    borderWidth: 1,
    borderColor: C.border2,
    alignItems: 'center',
  },
  secondaryBtnText: { fontFamily: F.medium, fontSize: 14, color: C.text },
  backBtn: {
    width: 34,
    height: 34,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: C.border2,
    backgroundColor: C.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backBtnText: { fontFamily: F.regular, fontSize: 20, lineHeight: 22, color: C.text },
  statTile: {
    flex: 1,
    backgroundColor: C.surface,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 16,
    padding: 13,
    alignItems: 'center',
  },
  statValue: { fontFamily: F.semibold, fontSize: 18 },
  statLabel: { fontFamily: F.regular, fontSize: 10.5, color: C.muted, marginTop: 1 },
  chip: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 999,
    backgroundColor: C.surface,
    borderWidth: 1,
    borderColor: C.border,
  },
  chipActive: { backgroundColor: C.purpleA18, borderColor: C.purpleA45 },
  chipText: { fontFamily: F.medium, fontSize: 11.5, color: C.muted, letterSpacing: 0.6 },
  chipTextActive: { fontFamily: F.semibold, color: C.purpleSoft },
  stepRow: { flexDirection: 'row', alignItems: 'center', gap: 11 },
  stepMark: {
    width: 20,
    height: 20,
    borderRadius: 999,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepMarkText: { fontFamily: F.regular, fontSize: 10 },
  stepLabel: { fontFamily: F.regular, fontSize: 13.5, flex: 1 },
  lock: { width: 20, height: 20, alignItems: 'center', justifyContent: 'center' },
  lockShackle: {
    width: 6,
    height: 5,
    borderWidth: 1.5,
    borderBottomWidth: 0,
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
    marginBottom: -0.5,
  },
  lockBody: { width: 9, height: 7, borderRadius: 1.5 },
});
