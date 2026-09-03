import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ScreenView } from '../components/ScreenView';
import { FadeInUp } from '../components/anim';
import { Ring, SectionLabel, Stripes } from '../components/ui';
import { ScanIcon } from '../components/icons';
import { angle, C, F, G, lh } from '../theme';
import type { RootStackParamList } from '../navigation/types';

type Nav = NativeStackNavigationProp<RootStackParamList>;

const RECENT = [
  { title: 'Sapiens', meta: '42 concepts', kind: 'book cover' },
  { title: 'Thinking Fast', meta: '87 concepts', kind: 'book cover' },
  { title: 'Econ Notes', meta: '18 concepts', kind: 'pdf' },
];

export function HomeScreen() {
  const nav = useNavigation<Nav>();

  return (
    <ScreenView nav>
      <FadeInUp>
        {/* Greeting */}
        <View style={styles.header}>
          <View style={styles.flex}>
            <Text style={styles.eyebrow}>TUESDAY</Text>
            <Text style={styles.greeting}>Good morning, Alex.</Text>
            <Text style={styles.subGreeting}>What do you want to understand today?</Text>
          </View>
          <LinearGradient colors={G.avatar} {...angle(150)} style={styles.avatar}>
            <Text style={styles.avatarText}>A</Text>
          </LinearGradient>
        </View>

        {/* Capture actions */}
        <View style={styles.actions}>
          <Pressable style={styles.scanAction} onPress={() => nav.navigate('Scan')}>
            <LinearGradient colors={G.cta} {...angle(135)} style={styles.scanActionInner}>
              <ScanIcon size={17} color="#fff" />
              <Text style={styles.scanActionText}>Scan Something</Text>
            </LinearGradient>
          </Pressable>
          <Pressable style={styles.uploadAction} onPress={() => nav.navigate('Scan')}>
            <Text style={styles.uploadActionText}>Upload Material</Text>
          </Pressable>
        </View>

        {/* Current path */}
        <SectionLabel style={styles.label}>Current learning path</SectionLabel>
        <LinearGradient colors={[C.surfaceAlt, C.surface]} {...angle(150)} style={styles.pathCard}>
          <View style={styles.pathRow}>
            <View style={styles.flex}>
              <Text style={styles.pathTitle}>Blockchain Basics</Text>
              <Text style={styles.pathMeta}>14 of 33 concepts mastered</Text>
            </View>
            <Ring size={60} stroke={5} progress={0.42}>
              <Text style={styles.ringLabel}>42%</Text>
            </Ring>
          </View>
          <Pressable style={styles.continueBtn} onPress={() => nav.navigate('Lesson')}>
            <Text style={styles.continueText}>Continue</Text>
          </Pressable>
        </LinearGradient>

        {/* Recommended */}
        <SectionLabel style={styles.label}>Recommended next</SectionLabel>
        <Pressable style={styles.recCard} onPress={() => nav.navigate('Lesson')}>
          <View style={styles.recIcon}>
            <Text style={styles.recIconText}>✦</Text>
          </View>
          <View style={styles.flex}>
            <Text style={styles.recTitle}>Hashing</Text>
            <View style={styles.recMetaRow}>
              <Text style={styles.recMeta}>15 min</Text>
              <Text style={styles.recDivider}>|</Text>
              <Text style={styles.recMeta}>Interactive</Text>
              <Text style={styles.recDivider}>|</Text>
              <Text style={[styles.recMeta, { color: C.green }]}>58% mastery</Text>
            </View>
          </View>
          <Text style={styles.chevron}>›</Text>
        </Pressable>

        {/* Stats */}
        <View style={styles.statRow}>
          <View style={styles.stat}>
            <Text style={[styles.statValue, { color: C.amber }]}>12</Text>
            <Text style={styles.statLabel}>Day streak</Text>
          </View>
          <View style={styles.stat}>
            <Text style={[styles.statValue, { color: C.green }]}>68%</Text>
            <Text style={styles.statLabel}>Overall mastery</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statValue}>9</Text>
            <Text style={styles.statLabel}>Books analysed</Text>
          </View>
        </View>

        {/* Recent scans */}
        <SectionLabel style={styles.label}>Recent scans</SectionLabel>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.recentRow}
        >
          {RECENT.map(item => (
            <Pressable key={item.title} style={styles.recent} onPress={() => nav.navigate('Map')}>
              <Stripes variant="cover" style={styles.recentCover}>
                <Text style={styles.placeholderText}>{item.kind}</Text>
              </Stripes>
              <Text style={styles.recentTitle}>{item.title}</Text>
              <Text style={styles.recentMeta}>{item.meta}</Text>
            </Pressable>
          ))}
        </ScrollView>
      </FadeInUp>
    </ScreenView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 22 },
  eyebrow: { fontFamily: F.medium, fontSize: 12, letterSpacing: 1.6, color: C.muted },
  greeting: { fontFamily: F.semibold, fontSize: 26, letterSpacing: -0.6, color: C.text, marginTop: 2 },
  subGreeting: { fontFamily: F.regular, fontSize: 15, color: C.muted, marginTop: 4 },
  avatar: { width: 44, height: 44, borderRadius: 999, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontFamily: F.semibold, fontSize: 15, color: C.bg },

  actions: { flexDirection: 'row', gap: 10, marginBottom: 22 },
  scanAction: { flex: 1.4, borderRadius: 16, boxShadow: '0 10px 30px -10px rgba(124,92,255,0.8)' },
  scanActionInner: {
    borderRadius: 16,
    paddingVertical: 15,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 9,
  },
  scanActionText: { fontFamily: F.semibold, fontSize: 15, color: '#fff' },
  uploadAction: {
    flex: 1,
    borderRadius: 16,
    paddingVertical: 15,
    paddingHorizontal: 12,
    backgroundColor: C.surface,
    borderWidth: 1,
    borderColor: C.border2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadActionText: { fontFamily: F.medium, fontSize: 14, color: C.text },

  label: { marginBottom: 10 },
  pathCard: {
    borderWidth: 1,
    borderColor: C.purpleA28,
    borderRadius: 20,
    padding: 18,
    marginBottom: 20,
  },
  pathRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  pathTitle: { fontFamily: F.semibold, fontSize: 19, letterSpacing: -0.3, color: C.text },
  pathMeta: { fontFamily: F.regular, fontSize: 12.5, color: C.muted, marginTop: 3 },
  ringLabel: { fontFamily: F.semibold, fontSize: 13, color: C.text },
  continueBtn: {
    marginTop: 16,
    borderRadius: 13,
    paddingVertical: 12,
    backgroundColor: C.purpleA16,
    alignItems: 'center',
  },
  continueText: { fontFamily: F.semibold, fontSize: 14, color: C.purpleLight },

  recCard: {
    backgroundColor: C.surface,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 18,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 20,
  },
  recIcon: {
    width: 42,
    height: 42,
    borderRadius: 13,
    backgroundColor: C.purpleA14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  recIconText: { fontSize: 16, color: C.purpleLight },
  recTitle: { fontFamily: F.semibold, fontSize: 15.5, color: C.text },
  recMetaRow: { flexDirection: 'row', gap: 8, marginTop: 5 },
  recMeta: { fontFamily: F.regular, fontSize: 11.5, color: C.muted },
  recDivider: { fontSize: 11.5, color: 'rgba(255,255,255,0.18)' },
  chevron: { fontSize: 18, color: C.muted },

  statRow: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  stat: {
    flex: 1,
    backgroundColor: C.surface,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 16,
    padding: 14,
  },
  statValue: { fontFamily: F.semibold, fontSize: 22, color: C.text },
  statLabel: { fontFamily: F.regular, fontSize: 11, color: C.muted, marginTop: 2 },

  recentRow: { gap: 12, paddingBottom: 4 },
  recent: { width: 104 },
  recentCover: {
    height: 132,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: C.border,
    justifyContent: 'flex-end',
    alignItems: 'center',
    padding: 8,
  },
  placeholderText: { fontFamily: F.mono, fontSize: 8.5, color: C.muted },
  recentTitle: { fontFamily: F.medium, fontSize: 12.5, color: C.text, marginTop: 7 },
  recentMeta: { fontFamily: F.regular, fontSize: 10.5, color: C.muted, lineHeight: lh(10.5, 1.4) },
});
