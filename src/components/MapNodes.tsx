/**
 * The node vocabulary of the learning map: mastered, in-progress, scored,
 * locked, newly-added support steps, and the destination marker.
 *
 * Every node is centred on its (x, y) point the way the prototype's
 * `translate(-50%, -50%)` does, so the SVG roads underneath line up.
 */
import React from 'react';
import { Pressable, StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { GlowRing } from './anim';
import { LockGlyph, RadialGlow, Ring, Stripes } from './ui';
import { angle, C, F } from '../theme';

/**
 * Positions a node so its centre lands on the given map coordinate.
 *
 * The node sits in a `boxWidth`-wide centred track rather than shrink-wrapping
 * at `left: x`. Without the extra room an absolutely-positioned pill is capped
 * by the distance to the canvas edge and its label wraps, where the design
 * keeps every node label on one line.
 */
export function NodeAt({
  x,
  y,
  boxWidth = 320,
  children,
  style,
}: {
  x: number;
  y: number;
  boxWidth?: number;
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <View
      pointerEvents="box-none"
      style={[
        styles.at,
        {
          left: x,
          top: y,
          width: boxWidth,
          marginLeft: -boxWidth / 2,
          transform: [{ translateY: '-50%' }],
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}

/** The book the map is built from. */
export function RootNode({ label }: { label: string }) {
  return (
    <View style={[styles.pill, styles.rootPill]}>
      <Stripes variant="coverLight" style={styles.rootChip} />
      <Text style={styles.rootText}>{label}</Text>
    </View>
  );
}

/** A concept the learner has already mastered. */
export function MasteredNode({
  label,
  size = 'md',
  onPress,
}: {
  label: string;
  size?: 'sm' | 'md' | 'lg';
  onPress?: () => void;
}) {
  const dim = { sm: 20, md: 22, lg: 26 }[size];
  const body = (
    <View
      style={[
        styles.pill,
        styles.masteredPill,
        size === 'sm' && styles.pillSm,
        size === 'lg' && styles.pillLg,
        size === 'lg' && { borderColor: C.greenA50 },
      ]}
    >
      <View style={[styles.badge, { width: dim, height: dim, backgroundColor: C.greenA18 }]}>
        <Text style={[styles.tick, { fontSize: dim / 2 }]}>✓</Text>
      </View>
      <Text style={size === 'lg' ? styles.labelLg : size === 'sm' ? styles.labelSm : styles.label}>
        {label}
      </Text>
    </View>
  );
  return onPress ? <Pressable onPress={onPress}>{body}</Pressable> : body;
}

/** A concept with a partial mastery score shown in place of a tick. */
export function ScoredNode({
  label,
  score,
  tone = 'green',
  faded,
}: {
  label: string;
  score: string;
  tone?: 'green' | 'amber';
  faded?: boolean;
}) {
  const green = tone === 'green';
  return (
    <View
      style={[
        styles.pill,
        green ? styles.scoredPill : styles.amberPill,
        !green && styles.pillSm,
        faded && { opacity: 0.7 },
      ]}
    >
      <View
        style={[
          styles.badge,
          {
            width: green ? 22 : 20,
            height: green ? 22 : 20,
            backgroundColor: green ? C.greenA12 : C.amberA14,
          },
        ]}
      >
        <Text style={[styles.score, { color: green ? C.green : C.amber }]}>{score}</Text>
      </View>
      <Text style={green ? styles.label : styles.labelSm}>{label}</Text>
    </View>
  );
}

/** The concept the learner is on now — glowing, with a mastery ring. */
export function CurrentNode({
  label,
  progress,
  glyph,
  onPress,
}: {
  label: string;
  progress?: number;
  glyph?: string;
  onPress?: () => void;
}) {
  return (
    <Pressable onPress={onPress}>
      <GlowRing duration={2800} color={C.purpleA45} radius={999} blur={26} spread={2} />
      <LinearGradient colors={['#2A2140', '#1A1730']} {...angle(140)} style={styles.currentPill}>
        {progress != null ? (
          <Ring size={30} stroke={3} progress={progress} track="rgba(255,255,255,0.12)">
            <Text style={styles.currentScore}>{Math.round(progress * 100)}</Text>
          </Ring>
        ) : (
          <View style={[styles.badge, { width: 26, height: 26, backgroundColor: 'rgba(124,92,255,0.2)' }]}>
            <Text style={styles.currentGlyph}>{glyph ?? '◎'}</Text>
          </View>
        )}
        <Text style={styles.currentLabel}>{label}</Text>
      </LinearGradient>
    </Pressable>
  );
}

/** A concept still behind its prerequisites. */
export function LockedNode({ label }: { label: string }) {
  return (
    <View style={[styles.pill, styles.lockedPill]}>
      <LockGlyph />
      <Text style={[styles.labelSm, { color: C.muted }]}>{label}</Text>
    </View>
  );
}

/** One of the support steps live adaptation inserts into the path. */
export function SupportNode({ label }: { label: string }) {
  return (
    <View style={[styles.pill, styles.supportPill]}>
      <View style={[styles.badge, { width: 20, height: 20, backgroundColor: C.tealA16 }]}>
        <Text style={styles.supportGlyph}>✦</Text>
      </View>
      <Text style={styles.labelSm}>{label}</Text>
    </View>
  );
}

/** The "YOU ARE HERE" / "NEW SUPPORT PATH" markers. */
export function MapBadge({ label, tone }: { label: string; tone: 'purple' | 'teal' }) {
  const purple = tone === 'purple';
  return (
    <View
      style={[
        styles.mapBadge,
        {
          backgroundColor: purple ? C.purpleA14 : C.tealA12,
          borderColor: purple ? C.purpleA30 : C.tealA35,
        },
      ]}
    >
      <Text style={[styles.mapBadgeText, { color: purple ? C.purpleLight : C.tealLight }]}>
        {label}
      </Text>
    </View>
  );
}

/** Where the path is heading. */
export function DestinationNode({ label }: { label: string }) {
  return (
    <View style={styles.destination}>
      <View style={styles.destinationRing}>
        <RadialGlow color={C.teal} opacity={0.18} style={StyleSheet.absoluteFill} />
        <LinearGradient colors={[C.teal, C.green]} {...angle(140)} style={styles.destinationCore} />
      </View>
      <Text style={styles.destinationLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  at: { position: 'absolute', alignItems: 'center' },

  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderRadius: 999,
    borderWidth: 1,
    paddingVertical: 7,
    paddingLeft: 7,
    paddingRight: 13,
  },
  pillSm: { gap: 7, paddingVertical: 6, paddingLeft: 6, paddingRight: 12 },
  pillLg: { gap: 9, paddingVertical: 9, paddingLeft: 9, paddingRight: 15 },

  rootPill: {
    backgroundColor: C.surfaceAlt,
    borderColor: C.borderStrong,
    paddingVertical: 8,
    paddingLeft: 8,
    paddingRight: 14,
    gap: 9,
  },
  rootChip: { width: 24, height: 24, borderRadius: 999, overflow: 'hidden' },
  rootText: { fontFamily: F.semibold, fontSize: 12.5, color: C.text },

  masteredPill: { backgroundColor: C.surfaceGreen, borderColor: C.greenA40 },
  scoredPill: { backgroundColor: C.surfaceAlt, borderColor: C.greenA28 },
  amberPill: { backgroundColor: C.surfaceAlt, borderColor: C.amberA35 },
  lockedPill: {
    backgroundColor: C.surfaceDim,
    borderColor: C.borderSoft,
    gap: 7,
    paddingVertical: 6,
    paddingLeft: 7,
    paddingRight: 12,
  },
  supportPill: { backgroundColor: C.surfaceTeal, borderColor: C.tealA45, gap: 7, paddingRight: 12 },

  badge: { borderRadius: 999, alignItems: 'center', justifyContent: 'center' },
  tick: { color: C.green },
  score: { fontFamily: F.mono, fontSize: 8.5 },
  supportGlyph: { fontSize: 10, color: C.tealLight },

  label: { fontFamily: F.medium, fontSize: 12, color: C.text },
  labelSm: { fontFamily: F.medium, fontSize: 11.5, color: C.text },
  labelLg: { fontFamily: F.semibold, fontSize: 13, color: C.text },

  currentPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderRadius: 999,
    borderWidth: 1.5,
    borderColor: C.purpleA75,
    paddingVertical: 10,
    paddingLeft: 10,
    paddingRight: 17,
  },
  currentScore: { fontFamily: F.mono, fontSize: 8.5, color: C.text },
  currentGlyph: { fontSize: 12, color: C.purpleSoft },
  currentLabel: { fontFamily: F.semibold, fontSize: 13.5, color: C.text },

  mapBadge: {
    borderWidth: 1,
    borderRadius: 999,
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  mapBadgeText: { fontFamily: F.semibold, fontSize: 9, letterSpacing: 1.5 },

  destination: { alignItems: 'center', gap: 7 },
  destinationRing: {
    width: 46,
    height: 46,
    borderRadius: 999,
    borderWidth: 2,
    borderColor: C.tealA55,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  destinationCore: { width: 16, height: 16, borderRadius: 999 },
  destinationLabel: {
    fontFamily: F.semibold,
    fontSize: 11,
    letterSpacing: 1.4,
    color: C.tealLight,
  },
});
