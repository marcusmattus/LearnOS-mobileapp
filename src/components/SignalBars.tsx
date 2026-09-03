/**
 * The learner's response signals — how well each teaching style has worked.
 * Shared by the profile-matching step and the learning profile screen.
 */
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SIGNALS } from '../data/content';
import { C, F } from '../theme';
import { Bar } from './ui';

export function SignalBars() {
  return (
    <View style={styles.list}>
      {SIGNALS.map(s => (
        <View key={s.label}>
          <View style={styles.row}>
            <Text style={styles.label}>{s.label}</Text>
            <Text style={styles.pct}>{Math.round(s.pct * 100)}%</Text>
          </View>
          <Bar progress={s.pct} height={6} colors={s.colors} />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  list: { gap: 13 },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  label: { fontFamily: F.regular, fontSize: 13, color: C.text },
  pct: { fontFamily: F.mono, fontSize: 12, color: C.muted },
});
