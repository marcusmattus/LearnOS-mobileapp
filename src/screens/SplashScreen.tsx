import React, { useEffect } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { FadeInUp, Float, Pulse } from '../components/anim';
import { Bar } from '../components/ui';
import { LogoMark } from '../components/Logo';
import { C, F } from '../theme';
import type { RootStackParamList } from '../navigation/types';

type Nav = NativeStackNavigationProp<RootStackParamList>;

/** The opening beat: pulsing rings around the mark, then straight to Welcome. */
export function SplashScreen() {
  const nav = useNavigation<Nav>();

  useEffect(() => {
    const id = setTimeout(() => nav.replace('Welcome'), 2200);
    return () => clearTimeout(id);
  }, [nav]);

  return (
    <Pressable style={styles.root} onPress={() => nav.replace('Welcome')}>
      <View pointerEvents="none" style={styles.center}>
        <Pulse duration={2600} style={styles.ringPos}>
          <View style={[styles.ring, styles.ringOuter]} />
        </Pulse>
        <Pulse duration={2600} delay={500} style={styles.ringPos}>
          <View style={[styles.ring, styles.ringInner]} />
        </Pulse>
        <Float duration={4000} style={styles.markWrap}>
          <View style={styles.mark}>
            <LogoMark size={40} />
          </View>
        </Float>
      </View>

      <FadeInUp duration={600} style={styles.wordmarkWrap}>
        <Text style={styles.wordmark}>LearnOS</Text>
        <Text style={styles.tagline}>ADAPT · UNDERSTAND · GROW</Text>
      </FadeInUp>

      <View style={styles.progressWrap}>
        <Bar progress={0.62} height={3} colors={[C.purple, C.teal]} style={styles.progressBar} />
        <Text style={styles.progressLabel}>Preparing your learning field…</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg, alignItems: 'center', justifyContent: 'center', gap: 26 },
  center: { width: 150, height: 150, alignItems: 'center', justifyContent: 'center' },
  ringPos: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ring: { borderRadius: 999 },
  ringOuter: {
    width: 150,
    height: 150,
    borderWidth: 1,
    borderColor: 'rgba(124,92,255,0.5)',
  },
  ringInner: {
    width: 106,
    height: 106,
    borderWidth: 1,
    borderColor: 'rgba(0,212,200,0.35)',
  },
  markWrap: { width: 78, height: 78, alignItems: 'center', justifyContent: 'center' },
  mark: {
    width: 78,
    height: 78,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.03)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  wordmarkWrap: { alignItems: 'center' },
  wordmark: { fontFamily: F.semibold, fontSize: 38, letterSpacing: -1, color: C.text },
  tagline: {
    fontFamily: F.medium,
    fontSize: 10.5,
    letterSpacing: 3,
    color: C.muted,
    marginTop: 6,
    textTransform: 'uppercase',
  },
  progressWrap: {
    position: 'absolute',
    bottom: 74,
    alignItems: 'center',
    gap: 14,
  },
  progressBar: { width: 132 },
  progressLabel: { fontFamily: F.regular, fontSize: 11.5, color: C.dim },
});
