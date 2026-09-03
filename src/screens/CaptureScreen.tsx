import React, { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FadeInUp, GlowDot } from '../components/anim';
import { PrimaryButton, Stripes } from '../components/ui';
import { BoltIcon } from '../components/icons';
import { useAppState } from '../state/AppState';
import { SCAN_STATUSES } from '../data/content';
import { angle, C, F } from '../theme';
import type { RootStackParamList } from '../navigation/types';

type Nav = NativeStackNavigationProp<RootStackParamList>;

/** The live scanner: full-bleed, no tab bar, edge detection locked on. */
export function CaptureScreen() {
  const nav = useNavigation<Nav>();
  const insets = useSafeAreaInsets();
  const { pages, capturePage } = useAppState();
  const [stage, setStage] = useState(0);

  // Cycle the lock-on status the way the prototype does.
  useEffect(() => {
    const id = setInterval(() => setStage(s => (s + 1) % SCAN_STATUSES.length), 1600);
    return () => clearInterval(id);
  }, []);

  const shoot = () => {
    capturePage();
    setStage(2);
  };

  return (
    <View style={styles.root}>
      <LinearGradient colors={['#1B1524', '#0A0A11']} {...angle(170)} style={StyleSheet.absoluteFill} />

      <FadeInUp duration={300} style={StyleSheet.absoluteFill}>
        {/* Detected page + lock-on reticle */}
        <Stripes variant="pageStack" style={styles.page} />
        <View style={styles.reticle} />

        {/* Top bar */}
        <View style={[styles.topBar, { top: insets.top + 8 }]}>
          <Pressable style={styles.roundBtn} onPress={() => nav.goBack()} accessibilityLabel="Close scanner">
            <Text style={styles.closeText}>✕</Text>
          </Pressable>
          <Text style={styles.topTitle}>Scan Book</Text>
          <Pressable style={styles.roundBtn} accessibilityLabel="Toggle flash">
            <BoltIcon size={16} color={C.amber} />
          </Pressable>
        </View>

        {/*
          Status pill and shutter tray share one bottom-anchored column. The
          prototype positioned the pill from the frame's centre, which collides
          with the page count on a real device; stacking them keeps the same
          arrangement without the overlap.
        */}
        <View style={[styles.bottom, { paddingBottom: Math.max(insets.bottom, 16) }]}>
          <View style={styles.statusPill}>
            <GlowDot size={7} color={C.purple} duration={1400} />
            <Text style={styles.statusText}>{SCAN_STATUSES[stage]}</Text>
          </View>

          <View style={styles.tray}>
            <Text style={styles.pageCount}>{pages} pages captured</Text>
            <View style={styles.shutterRow}>
              <Stripes variant="coverFine" style={styles.lastShot} />
              <Pressable
                style={styles.shutterRing}
                onPress={shoot}
                accessibilityLabel="Capture page"
              >
                <View style={styles.shutterInner} />
              </Pressable>
              <Pressable style={styles.countBtn} onPress={() => nav.navigate('Review')}>
                <Text style={styles.countText}>{pages}</Text>
              </Pressable>
            </View>
            <PrimaryButton
              label="Review Pages"
              onPress={() => nav.navigate('Review')}
              style={styles.reviewBtn}
              glow={false}
            />
          </View>
        </View>
      </FadeInUp>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bgDeep },

  page: {
    position: 'absolute',
    left: '50%',
    top: '50%',
    width: 216,
    height: 302,
    borderRadius: 8,
    overflow: 'hidden',
    opacity: 0.55,
    transform: [{ translateX: '-50%' }, { translateY: '-50%' }, { rotate: '-1.2deg' }],
  },
  reticle: {
    position: 'absolute',
    left: '50%',
    top: '50%',
    width: 236,
    height: 322,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: C.purple,
    boxShadow: '0 0 40px rgba(124,92,255,0.55), inset 0 0 30px rgba(124,92,255,0.18)',
    transform: [{ translateX: '-50%' }, { translateY: '-50%' }, { rotate: '-1.2deg' }],
  },

  topBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  roundBtn: {
    width: 38,
    height: 38,
    borderRadius: 999,
    backgroundColor: 'rgba(21,21,34,0.8)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeText: { fontFamily: F.regular, fontSize: 16, color: C.text },
  topTitle: { fontFamily: F.medium, fontSize: 14, color: C.text },

  bottom: { position: 'absolute', left: 0, right: 0, bottom: 0 },
  statusPill: {
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(11,11,18,0.82)',
    borderWidth: 1,
    borderColor: C.purpleA35,
    paddingVertical: 9,
    paddingHorizontal: 15,
    borderRadius: 999,
    marginBottom: 26,
  },
  statusText: { fontFamily: F.medium, fontSize: 12.5, color: C.text, letterSpacing: 0.2 },

  tray: { paddingHorizontal: 26 },
  pageCount: {
    textAlign: 'center',
    fontFamily: F.regular,
    fontSize: 12,
    color: C.muted,
    marginBottom: 16,
  },
  shutterRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  lastShot: {
    width: 46,
    height: 46,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: C.border2,
  },
  shutterRing: {
    width: 74,
    height: 74,
    borderRadius: 999,
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.2)',
    padding: 5,
  },
  shutterInner: { flex: 1, borderRadius: 999, backgroundColor: C.text },
  countBtn: {
    width: 46,
    height: 46,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: C.purpleA40,
    backgroundColor: C.purpleA16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  countText: { fontFamily: F.semibold, fontSize: 13, color: C.purpleSoft },
  reviewBtn: { marginTop: 18 },
});
