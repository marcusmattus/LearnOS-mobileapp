import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ScreenView } from '../components/ScreenView';
import { FadeInUp } from '../components/anim';
import { SectionLabel } from '../components/ui';
import { SignalBars } from '../components/SignalBars';
import { AccountCard } from '../components/AccountCard';
import { angle, C, F, lh } from '../theme';

/** The teaching order LearnOS currently believes works best for this learner. */
const PATHWAY = [
  { step: '01', label: 'Visual', tint: 'rgba(124,92,255,0.16)', fade: 'rgba(124,92,255,0.04)', border: 'rgba(124,92,255,0.32)', num: C.purpleLight },
  { step: '02', label: 'Example', tint: 'rgba(61,139,255,0.14)', fade: 'rgba(61,139,255,0.03)', border: C.blueA30, num: C.blueLight },
  { step: '03', label: 'Practice', tint: 'rgba(0,212,200,0.14)', fade: 'rgba(0,212,200,0.03)', border: C.tealA30, num: C.tealLight },
  { step: '04', label: 'Teach back', tint: 'rgba(71,215,158,0.14)', fade: 'rgba(71,215,158,0.03)', border: C.greenA30, num: C.greenLight },
];

export function ProfileScreen() {
  return (
    <ScreenView nav>
      <FadeInUp>
        <Text style={styles.title}>How LearnOS is adapting</Text>
        <Text style={styles.subtitle}>
          Estimates from your demonstrated understanding, not a personality test.
        </Text>

        <SectionLabel style={styles.label}>Current response signals</SectionLabel>
        <SignalBars />

        <View style={styles.tiles}>
          <View style={styles.tile}>
            <Text style={styles.tileLabel}>COMPLEXITY</Text>
            <Text style={styles.tileValue}>Medium</Text>
          </View>
          <View style={styles.tile}>
            <Text style={styles.tileLabel}>CONFIDENCE</Text>
            <Text style={[styles.tileValue, { color: C.green }]}>74%</Text>
          </View>
        </View>

        <SectionLabel style={styles.label}>Current best pathway</SectionLabel>
        <View style={styles.pathway}>
          {PATHWAY.map(p => (
            <LinearGradient
              key={p.step}
              colors={[p.tint, p.fade]}
              {...angle(100)}
              style={[styles.pathStep, { borderColor: p.border }]}
            >
              <Text style={[styles.pathNum, { color: p.num }]}>{p.step}</Text>
              <Text style={styles.pathLabel}>{p.label}</Text>
            </LinearGradient>
          ))}
        </View>

        <Text style={styles.footnote}>
          These estimates continuously change based on demonstrated understanding.
        </Text>

        <AccountCard />
      </FadeInUp>
    </ScreenView>
  );
}

const styles = StyleSheet.create({
  title: { fontFamily: F.semibold, fontSize: 24, letterSpacing: -0.5, color: C.text },
  subtitle: { fontFamily: F.regular, fontSize: 13, color: C.muted, marginTop: 4, lineHeight: lh(13, 1.45) },
  label: { marginTop: 20, marginBottom: 12 },

  tiles: { flexDirection: 'row', gap: 10, marginTop: 20 },
  tile: {
    flex: 1,
    backgroundColor: C.surface,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 18,
    padding: 15,
  },
  tileLabel: { fontFamily: F.semibold, fontSize: 10.5, letterSpacing: 1.2, color: C.muted },
  tileValue: { fontFamily: F.semibold, fontSize: 17, color: C.text, marginTop: 5 },

  pathway: { gap: 8 },
  pathStep: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderRadius: 15,
    paddingVertical: 13,
    paddingHorizontal: 15,
  },
  pathNum: { fontFamily: F.mono, fontSize: 11 },
  pathLabel: { fontFamily: F.semibold, fontSize: 14, color: C.text },

  footnote: {
    marginTop: 16,
    fontFamily: F.regular,
    fontSize: 12,
    color: C.muted,
    lineHeight: lh(12, 1.6),
  },
});
