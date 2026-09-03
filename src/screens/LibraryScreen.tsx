import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ScreenView } from '../components/ScreenView';
import { FadeInUp } from '../components/anim';
import { Bar, Chip, Stripes } from '../components/ui';
import { LIBRARY } from '../data/content';
import { C, F } from '../theme';
import type { RootStackParamList } from '../navigation/types';

type Nav = NativeStackNavigationProp<RootStackParamList>;

const FILTERS = ['Books', 'PDFs', 'Notes', 'Topics', 'Paths'];

export function LibraryScreen() {
  const nav = useNavigation<Nav>();
  const [filter, setFilter] = useState('Books');

  return (
    <ScreenView nav>
      <FadeInUp>
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>My Library</Text>
            <Text style={styles.subtitle}>9 sources · 4 active paths</Text>
          </View>
          <Pressable style={styles.addBtn} onPress={() => nav.navigate('Scan')}>
            <Text style={styles.addBtnText}>+ Add</Text>
          </Pressable>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filters}
        >
          {FILTERS.map(f => (
            <Chip key={f} label={f} active={f === filter} onPress={() => setFilter(f)} />
          ))}
        </ScrollView>

        <View style={styles.list}>
          {LIBRARY.map(item => (
            <Pressable key={item.title} style={styles.row} onPress={() => nav.navigate('Map')}>
              <Stripes variant="coverFine" style={styles.cover} />
              <View style={styles.flex}>
                <Text style={styles.rowTitle}>{item.title}</Text>
                <Text style={styles.rowMeta}>{item.meta}</Text>
                <Bar progress={item.pct} height={5} colors={item.colors} style={styles.rowBar} />
              </View>
              <View style={styles.rowRight}>
                <Text style={styles.rowPct}>{Math.round(item.pct * 100)}%</Text>
                <Text style={styles.rowPctLabel}>mastery</Text>
              </View>
            </Pressable>
          ))}
        </View>
      </FadeInUp>
    </ScreenView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, minWidth: 0 },
  header: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between' },
  title: { fontFamily: F.semibold, fontSize: 24, letterSpacing: -0.5, color: C.text },
  subtitle: { fontFamily: F.regular, fontSize: 13, color: C.muted, marginTop: 3 },
  addBtn: {
    borderRadius: 13,
    paddingVertical: 11,
    paddingHorizontal: 15,
    backgroundColor: C.purpleA16,
    borderWidth: 1,
    borderColor: C.purpleA35,
  },
  addBtnText: { fontFamily: F.semibold, fontSize: 13, color: C.purpleSoft },

  filters: { gap: 7, paddingVertical: 16 },

  list: { gap: 11 },
  row: {
    backgroundColor: C.surface,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 18,
    padding: 13,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 13,
  },
  cover: {
    width: 50,
    height: 70,
    borderRadius: 7,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: C.border,
  },
  rowTitle: { fontFamily: F.semibold, fontSize: 15, color: C.text },
  rowMeta: { fontFamily: F.regular, fontSize: 11.5, color: C.muted, marginTop: 2 },
  rowBar: { marginTop: 9 },
  rowRight: { alignItems: 'flex-end' },
  rowPct: { fontFamily: F.semibold, fontSize: 14, color: C.text },
  rowPctLabel: { fontFamily: F.regular, fontSize: 10, color: C.muted },
});
