/**
 * The LearnOS sprout mark, rebuilt as SVG from the brand board — a seed dot
 * above two mirrored pairs of leaves, running purple → blue on the left and
 * blue → green on the right.
 *
 * The prototype carried a dashed "logo" placeholder here; this replaces it.
 */
import React from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Circle, Defs, LinearGradient, Path, Stop } from 'react-native-svg';
import { C, F } from '../theme';
import { Txt } from './ui';

export function LogoMark({ size = 34 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 64 64">
      <Defs>
        <LinearGradient id="lo-left" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor={C.purple} />
          <Stop offset="1" stopColor={C.blue} />
        </LinearGradient>
        <LinearGradient id="lo-right" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor={C.blue} />
          <Stop offset="1" stopColor={C.green} />
        </LinearGradient>
        <LinearGradient id="lo-seed" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor={C.purple} />
          <Stop offset="1" stopColor="#9B82FF" />
        </LinearGradient>
      </Defs>

      {/* seed */}
      <Circle cx={32} cy={12} r={8.5} fill="url(#lo-seed)" />

      {/* upper leaf pair */}
      <Path d="M32 45 C32 33 24 24 12 22 C12 34 20 43 32 45 Z" fill="url(#lo-left)" />
      <Path d="M32 45 C32 33 40 24 52 22 C52 34 44 43 32 45 Z" fill="url(#lo-right)" />

      {/* lower leaf pair */}
      <Path d="M32 60 C32 48 24 39 12 37 C12 49 20 58 32 60 Z" fill="url(#lo-left)" />
      <Path d="M32 60 C32 48 40 39 52 37 C52 49 44 58 32 60 Z" fill="url(#lo-right)" />
    </Svg>
  );
}

/** Mark plus wordmark and the brand tagline. */
export function LogoLockup({ size = 34 }: { size?: number }) {
  return (
    <View style={styles.row}>
      <LogoMark size={size} />
      <View>
        <Txt style={styles.word}>LearnOS</Txt>
        <Txt style={styles.tagline}>ADAPT · UNDERSTAND · GROW</Txt>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  word: { fontFamily: F.semibold, fontSize: 20, letterSpacing: -0.4, lineHeight: 22 },
  tagline: {
    fontFamily: F.medium,
    fontSize: 10,
    letterSpacing: 2.4,
    color: C.muted,
  },
});
