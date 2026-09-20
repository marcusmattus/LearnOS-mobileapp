import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FadeInUp } from '../components/anim';
import { PrimaryButton, SecondaryButton } from '../components/ui';
import { useAppState } from '../state/AppState';
import { FREE_SCAN_LIMIT } from '../state/AppState';
import { C, F } from '../theme';
import type { RootStackParamList } from '../navigation/types';

type Nav = NativeStackNavigationProp<RootStackParamList>;

/** The gate shown once the free tier's scans run out — a sheet over a dark scrim. */
export function LimitScreen() {
  const nav = useNavigation<Nav>();
  const { scansUsed } = useAppState();
  const used = Math.min(scansUsed, FREE_SCAN_LIMIT);
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.root}>
      <FadeInUp
        duration={300}
        style={[styles.sheet, { paddingBottom: Math.max(insets.bottom, 20) + 10 }]}
      >
        <View style={styles.grabber} />
        <View style={styles.icon}>
          <Text style={styles.iconText}>◒</Text>
        </View>
        <Text style={styles.title}>You’ve used all {FREE_SCAN_LIMIT} free scans</Text>
        <Text style={styles.body}>
          Your maps and progress stay exactly where they are. Unlimited scanning unlocks with a
          subscription.
        </Text>

        <View style={styles.dots}>
          {Array.from({ length: FREE_SCAN_LIMIT }).map((_, i) => (
            <View key={i} style={[styles.dot, { backgroundColor: i < used ? C.amber : C.track }]} />
          ))}
        </View>
        <Text style={styles.dotsLabel}>
          {used} of {FREE_SCAN_LIMIT} scans used this month
        </Text>

        <PrimaryButton
          label="Get unlimited scans"
          onPress={() => nav.replace('Paywall')}
          style={styles.cta}
        />
        <SecondaryButton
          label="Keep studying what I have"
          onPress={() => nav.replace('Home')}
          style={styles.altBtn}
        />
      </FadeInUp>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: 'rgba(7,7,12,0.72)', justifyContent: 'flex-end' },
  sheet: {
    backgroundColor: C.surfaceSheet,
    borderTopWidth: 1,
    borderTopColor: C.purpleA30,
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    paddingHorizontal: 22,
    paddingTop: 26,
  },
  grabber: {
    width: 38,
    height: 4,
    borderRadius: 999,
    backgroundColor: C.borderStrong,
    alignSelf: 'center',
    marginBottom: 20,
  },
  icon: {
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: C.amberA14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: { fontSize: 19, color: C.amber },
  title: { fontFamily: F.semibold, fontSize: 22, letterSpacing: -0.4, color: C.text, marginTop: 16 },
  body: { fontFamily: F.regular, fontSize: 13.5, lineHeight: 21, color: C.muted, marginTop: 8 },
  dots: { flexDirection: 'row', gap: 5, marginTop: 20 },
  dot: { flex: 1, height: 6, borderRadius: 999 },
  dotsLabel: { fontFamily: F.regular, fontSize: 11.5, color: C.dim, marginTop: 8 },
  cta: { marginTop: 22 },
  altBtn: {
    marginTop: 9,
    backgroundColor: 'transparent',
    borderWidth: 0,
  },
});
