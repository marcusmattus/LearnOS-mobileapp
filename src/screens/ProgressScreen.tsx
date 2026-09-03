import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ScreenView } from '../components/ScreenView';
import { FadeInUp } from '../components/anim';
import { Ring, SectionLabel } from '../components/ui';
import { angle, C, F, G } from '../theme';

/** Ten weeks of concepts mastered, newest on the right. */
const GROWTH = [
  { height: 0.26, color: C.purple },
  { height: 0.34, color: C.purple },
  { height: 0.3, color: C.purple },
  { height: 0.48, color: C.purple },
  { height: 0.58, color: '#6E74FF' },
  { height: 0.52, color: '#6E74FF' },
  { height: 0.72, color: C.blue },
  { height: 0.66, color: C.blue },
  { height: 0.84, color: C.teal },
  { height: 1, color: C.green },
];

const SUMMARY = [
  { label: 'Concepts mastered', value: '218', color: C.text },
  { label: 'Learning time', value: '64h 20m', color: C.text },
  { label: 'Current streak', value: '13 days', color: C.amber },
];

const STRONGEST = ['Cognitive Revolution', 'Language', 'Cooperation'];
const NEEDS_REVIEW = ['Money', 'Social Hierarchy', 'Empire'];

const REVIEWS = [
  { name: 'Money', when: 'Tomorrow', color: C.amber },
  { name: 'Shared Myths', when: 'In 3 days', color: C.muted },
];

export function ProgressScreen() {
  return (
    <ScreenView nav>
      <FadeInUp>
        <Text style={styles.title}>Progress</Text>
        <Text style={styles.subtitle}>Across 9 books and 4 learning paths</Text>

        <LinearGradient
          colors={[C.surfaceAlt, '#141420']}
          {...angle(150)}
          style={styles.summaryCard}
        >
          <Ring size={96} stroke={8} progress={0.68} gradient={G.progress} track={C.trackSoft}>
            <Text style={styles.summaryPct}>68%</Text>
          </Ring>
          <View style={styles.summaryList}>
            {SUMMARY.map(s => (
              <View key={s.label} style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>{s.label}</Text>
                <Text style={[styles.summaryValue, { color: s.color }]}>{s.value}</Text>
              </View>
            ))}
          </View>
        </LinearGradient>

        <SectionLabel style={styles.label}>Knowledge growth</SectionLabel>
        <View style={styles.chartCard}>
          <View style={styles.chart}>
            {GROWTH.map((bar, i) => (
              <LinearGradient
                key={i}
                colors={[bar.color, withAlpha(bar.color, 0.2)]}
                {...angle(180)}
                style={[styles.bar, { height: `${bar.height * 100}%` }]}
              />
            ))}
          </View>
          <View style={styles.chartAxis}>
            <Text style={styles.axisLabel}>10 weeks ago</Text>
            <Text style={styles.axisLabel}>this week</Text>
          </View>
        </View>

        <View style={styles.panels}>
          <View style={[styles.panel, { borderColor: 'rgba(71,215,158,0.2)' }]}>
            <Text style={[styles.panelLabel, { color: C.green }]}>STRONGEST</Text>
            <View style={styles.panelList}>
              {STRONGEST.map(c => (
                <Text key={c} style={[styles.panelItem, { color: C.greenText }]}>
                  {c}
                </Text>
              ))}
            </View>
          </View>
          <View style={[styles.panel, { borderColor: 'rgba(255,200,87,0.2)' }]}>
            <Text style={[styles.panelLabel, { color: C.amber }]}>NEEDS REVIEW</Text>
            <View style={styles.panelList}>
              {NEEDS_REVIEW.map(c => (
                <Text key={c} style={[styles.panelItem, { color: C.amberText }]}>
                  {c}
                </Text>
              ))}
            </View>
          </View>
        </View>

        <SectionLabel style={styles.label}>Upcoming reviews</SectionLabel>
        <View style={styles.reviews}>
          {REVIEWS.map(r => (
            <View key={r.name} style={styles.review}>
              <View style={[styles.reviewDot, { backgroundColor: r.color }]} />
              <Text style={styles.reviewName}>{r.name}</Text>
              <Text style={styles.reviewWhen}>{r.when}</Text>
            </View>
          ))}
        </View>
      </FadeInUp>
    </ScreenView>
  );
}

/** Fades a hex colour to the chart's translucent base. */
function withAlpha(hex: string, alpha: number) {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${alpha})`;
}

const styles = StyleSheet.create({
  title: { fontFamily: F.semibold, fontSize: 24, letterSpacing: -0.5, color: C.text },
  subtitle: { fontFamily: F.regular, fontSize: 13, color: C.muted, marginTop: 3 },

  summaryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 18,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 22,
    padding: 18,
    marginTop: 16,
  },
  summaryPct: { fontFamily: F.semibold, fontSize: 20, color: C.text },
  summaryList: { flex: 1, gap: 9 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between' },
  summaryLabel: { fontFamily: F.regular, fontSize: 12.5, color: C.muted },
  summaryValue: { fontFamily: F.semibold, fontSize: 12.5 },

  label: { marginTop: 20, marginBottom: 10 },
  chartCard: {
    backgroundColor: C.surfaceDeep,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 20,
    padding: 16,
  },
  chart: { flexDirection: 'row', alignItems: 'flex-end', gap: 6, height: 110 },
  bar: { flex: 1, borderTopLeftRadius: 6, borderTopRightRadius: 6, borderBottomLeftRadius: 2, borderBottomRightRadius: 2 },
  chartAxis: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
  axisLabel: { fontFamily: F.mono, fontSize: 9.5, color: C.muted },

  panels: { flexDirection: 'row', gap: 10, marginTop: 20 },
  panel: {
    flex: 1,
    backgroundColor: C.surface,
    borderWidth: 1,
    borderRadius: 18,
    padding: 14,
  },
  panelLabel: { fontFamily: F.semibold, fontSize: 10.5, letterSpacing: 1.2 },
  panelList: { gap: 7, marginTop: 10 },
  panelItem: { fontFamily: F.regular, fontSize: 12.5 },

  reviews: { gap: 9 },
  review: {
    backgroundColor: C.surface,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 15,
    paddingVertical: 13,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  reviewDot: { width: 8, height: 8, borderRadius: 999 },
  reviewName: { flex: 1, fontFamily: F.regular, fontSize: 13.5, color: C.text },
  reviewWhen: { fontFamily: F.regular, fontSize: 11.5, color: C.muted },
});
