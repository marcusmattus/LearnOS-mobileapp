import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FadeInUp } from '../components/anim';
import { PrimaryButton, SecondaryButton } from '../components/ui';
import { LogoMark } from '../components/Logo';
import { C, F } from '../theme';
import type { RootStackParamList } from '../navigation/types';

type Nav = NativeStackNavigationProp<RootStackParamList>;

const POINTS = [
  { icon: '◎', title: 'Scan it once', body: 'Pages, slides or handwriting — captured and read in seconds.' },
  { icon: '◈', title: 'See the whole map', body: 'Concepts, prerequisites and the shortest route through them.' },
  { icon: '↻', title: "Learn it another way", body: 'Stuck on something? Ask for a different explanation.' },
];

/** First-run pitch: what LearnOS does, then straight into the free tier or the paywall. */
export function WelcomeScreen() {
  const nav = useNavigation<Nav>();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.root, { paddingTop: insets.top + 24, paddingBottom: insets.bottom + 24 }]}>
      <FadeInUp style={styles.flex}>
        <LogoMark size={40} />
        <Text style={styles.headline}>Scan anything.{'\n'}Learn it your way.</Text>
        <Text style={styles.body}>
          Point your camera at a book, a lecture slide or your own notes. LearnOS finds the
          concepts, checks what you already know, and builds a path that fits how you learn.
        </Text>

        <View style={styles.points}>
          {POINTS.map(p => (
            <View key={p.title} style={styles.pointRow}>
              <View style={styles.pointIcon}>
                <Text style={styles.pointIconText}>{p.icon}</Text>
              </View>
              <View style={styles.flex}>
                <Text style={styles.pointTitle}>{p.title}</Text>
                <Text style={styles.pointBody}>{p.body}</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.flex} />

        <PrimaryButton label="Start free — 5 scans" onPress={() => nav.replace('Home')} />
        <SecondaryButton
          label="See plans"
          onPress={() => nav.navigate('Paywall')}
          style={styles.plansBtn}
        />
        <Text style={styles.footnote}>No card needed to start.</Text>
      </FadeInUp>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg, paddingHorizontal: 24 },
  flex: { flex: 1 },
  headline: {
    fontFamily: F.semibold,
    fontSize: 31,
    letterSpacing: -0.8,
    lineHeight: 37,
    color: C.text,
    marginTop: 26,
  },
  body: { fontFamily: F.regular, fontSize: 14.5, lineHeight: 22, color: C.muted, marginTop: 12 },
  points: { gap: 18, marginTop: 30 },
  pointRow: { flexDirection: 'row', gap: 13, alignItems: 'flex-start' },
  pointIcon: {
    width: 34,
    height: 34,
    borderRadius: 11,
    backgroundColor: C.purpleA14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pointIconText: { fontSize: 14, color: C.purpleLight },
  pointTitle: { fontFamily: F.semibold, fontSize: 14.5, color: C.text },
  pointBody: { fontFamily: F.regular, fontSize: 12.5, color: C.muted, marginTop: 2, lineHeight: 18 },
  plansBtn: { marginTop: 10 },
  footnote: { textAlign: 'center', fontFamily: F.regular, fontSize: 11, color: C.faint, marginTop: 12 },
});
