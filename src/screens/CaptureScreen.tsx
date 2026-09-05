import React, { useEffect, useRef, useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FadeInUp, GlowDot } from '../components/anim';
import { PrimaryButton, SecondaryButton, Stripes } from '../components/ui';
import { BoltIcon } from '../components/icons';
import { useAppState } from '../state/AppState';
import { SCAN_STATUSES } from '../data/content';
import { angle, C, F } from '../theme';
import type { RootStackParamList } from '../navigation/types';

type Nav = NativeStackNavigationProp<RootStackParamList>;

/** The live scanner: a real camera feed behind the prototype's reticle and shutter tray. */
export function CaptureScreen() {
  const nav = useNavigation<Nav>();
  const insets = useSafeAreaInsets();
  const { pages, shots, capturePage } = useAppState();
  const [permission, requestPermission] = useCameraPermissions();
  const [stage, setStage] = useState(0);
  const [torch, setTorch] = useState(false);
  const [busy, setBusy] = useState(false);
  const cameraRef = useRef<CameraView>(null);

  // Ask for camera access as soon as the screen mounts.
  useEffect(() => {
    if (permission && !permission.granted && permission.canAskAgain) {
      requestPermission();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [permission?.granted]);

  // Cycle the lock-on status the way the prototype does — paused once a shot lands.
  useEffect(() => {
    if (busy) return;
    const id = setInterval(() => setStage(s => (s === 2 ? 0 : s + 1) % 2), 1600);
    return () => clearInterval(id);
  }, [busy]);

  const shoot = async () => {
    if (busy || !cameraRef.current) return;
    setBusy(true);
    setStage(2);
    try {
      const photo = await cameraRef.current.takePictureAsync({ quality: 0.6, skipProcessing: true });
      if (photo?.uri) capturePage(photo.uri);
    } catch {
      // Camera hiccuped (backgrounded, etc.) — let the learner just try again.
    } finally {
      setBusy(false);
    }
  };

  if (!permission || !permission.granted) {
    return (
      <View style={[styles.permRoot, { paddingTop: insets.top + 20, paddingBottom: insets.bottom + 24 }]}>
        <Pressable style={[styles.roundBtn, styles.permClose]} onPress={() => nav.goBack()}>
          <Text style={styles.closeText}>✕</Text>
        </Pressable>
        <View style={styles.permBody}>
          <View style={styles.permIcon}>
            <BoltIcon size={22} color={C.purpleLight} />
          </View>
          <Text style={styles.permTitle}>Camera access needed</Text>
          <Text style={styles.permBody2}>
            LearnOS scans books, pages and notes with your camera. Nothing leaves your device
            until you choose to analyse it.
          </Text>
          {permission?.canAskAgain !== false ? (
            <PrimaryButton
              label="Enable Camera"
              onPress={requestPermission}
              style={styles.permCta}
            />
          ) : (
            <Text style={styles.permHint}>
              Camera access was denied. Enable it for LearnOS in your device Settings.
            </Text>
          )}
          <SecondaryButton label="Not Now" onPress={() => nav.goBack()} style={styles.permAlt} />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <CameraView ref={cameraRef} style={StyleSheet.absoluteFill} facing="back" enableTorch={torch} />
      <LinearGradient
        colors={['rgba(27,21,36,0.35)', 'rgba(10,10,17,0.55)']}
        {...angle(170)}
        style={StyleSheet.absoluteFill}
        pointerEvents="none"
      />

      <FadeInUp duration={300} style={StyleSheet.absoluteFill}>
        <View style={styles.reticle} pointerEvents="none" />

        {/* Top bar */}
        <View style={[styles.topBar, { top: insets.top + 8 }]}>
          <Pressable style={styles.roundBtn} onPress={() => nav.goBack()} accessibilityLabel="Close scanner">
            <Text style={styles.closeText}>✕</Text>
          </Pressable>
          <Text style={styles.topTitle}>Scan Book</Text>
          <Pressable
            style={styles.roundBtn}
            onPress={() => setTorch(t => !t)}
            accessibilityLabel="Toggle flash"
          >
            <BoltIcon size={16} color={torch ? C.amber : 'rgba(255,255,255,0.7)'} />
          </Pressable>
        </View>

        <View style={[styles.bottom, { paddingBottom: Math.max(insets.bottom, 16) }]}>
          <View style={styles.statusPill}>
            <GlowDot size={7} color={C.purple} duration={1400} />
            <Text style={styles.statusText}>{busy ? 'Captured' : SCAN_STATUSES[stage]}</Text>
          </View>

          <View style={styles.tray}>
            <Text style={styles.pageCount}>{pages} pages captured</Text>
            <View style={styles.shutterRow}>
              {shots[0] ? (
                <Image source={{ uri: shots[0] }} style={styles.lastShot} resizeMode="cover" />
              ) : (
                <Stripes variant="coverFine" style={styles.lastShot} />
              )}
              <Pressable
                style={styles.shutterRing}
                onPress={shoot}
                disabled={busy}
                accessibilityLabel="Capture page"
              >
                <View style={[styles.shutterInner, busy && { opacity: 0.5 }]} />
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

  permRoot: { flex: 1, backgroundColor: C.bgDeep, paddingHorizontal: 20 },
  permClose: { alignSelf: 'flex-start' },
  permBody: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 6 },
  permIcon: {
    width: 56,
    height: 56,
    borderRadius: 18,
    backgroundColor: C.purpleA14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  permTitle: { fontFamily: F.semibold, fontSize: 20, color: C.text, textAlign: 'center' },
  permBody2: {
    fontFamily: F.regular,
    fontSize: 13.5,
    lineHeight: 21,
    color: C.muted,
    textAlign: 'center',
    marginTop: 6,
    paddingHorizontal: 12,
  },
  permHint: {
    fontFamily: F.regular,
    fontSize: 12.5,
    lineHeight: 19,
    color: C.amberLight,
    textAlign: 'center',
    marginTop: 18,
    paddingHorizontal: 12,
  },
  permCta: { alignSelf: 'stretch', marginTop: 22 },
  permAlt: { alignSelf: 'stretch', marginTop: 10 },
});
