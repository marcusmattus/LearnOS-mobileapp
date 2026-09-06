import React, { useCallback, useEffect, useRef } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ScreenView } from '../components/ScreenView';
import { FadeInUp, Float, Pulse, Spin } from '../components/anim';
import { Bar, PrimaryButton, RadialGlow, SecondaryButton, StepRow, Stripes } from '../components/ui';
import { useRamp } from '../hooks/useRamp';
import { useAppState } from '../state/AppState';
import { analyzeScan, ScanApiError } from '../api/scanApi';
import { ANALYSIS_STEPS, BOOK, stepStates } from '../data/content';
import { angle, C, F, G } from '../theme';
import type { RootStackParamList } from '../navigation/types';

type Nav = NativeStackNavigationProp<RootStackParamList>;

/** Positions of the drifting particles around the analysis orb. */
const PARTICLES = [
  { left: 26, top: 34, size: 8, color: C.teal, duration: 2600, delay: 0 },
  { right: 34, top: 58, size: 6, color: C.purple, duration: 3200, delay: 400 },
  { left: 52, bottom: 38, size: 5, color: C.green, duration: 2900, delay: 900 },
  { right: 24, bottom: 52, size: 7, color: C.blue, duration: 3600, delay: 200 },
];

export function AnalysingScreen() {
  const nav = useNavigation<Nav>();
  const { shots, analysisStatus, analysisError, startAnalysis, analysisSucceeded, analysisFailed, clearAnalysis } =
    useAppState();
  const hasRealScan = shots.length > 0;

  // A real scan sends the captured pages to Claude and waits on that
  // response; a simulated source (Upload PDF, Paste Text, ...) has nothing
  // real to analyse, so the animated ramp alone drives it to Complete, which
  // falls back to the demo book.
  const pct = useRamp(hasRealScan ? undefined : () => nav.replace('Complete'));
  const steps = stepStates(ANALYSIS_STEPS, pct);
  // Don't let the ramp visually finish before the real network call has.
  const displayPct = hasRealScan ? Math.min(pct, 92) : pct;

  const runAnalysis = useCallback(() => {
    startAnalysis();
    analyzeScan(shots.map(s => s.base64)).then(analysisSucceeded, err => {
      analysisFailed(err instanceof ScanApiError || err instanceof Error ? err.message : 'Analysis failed');
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shots]);

  const fired = useRef(false);
  useEffect(() => {
    if (!hasRealScan || fired.current) return;
    fired.current = true;
    runAnalysis();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasRealScan]);

  useEffect(() => {
    if (hasRealScan && analysisStatus === 'done') nav.replace('Complete');
  }, [hasRealScan, analysisStatus, nav]);

  const useDemoInstead = () => {
    clearAnalysis();
    nav.replace('Complete');
  };

  if (hasRealScan && analysisStatus === 'error') {
    return (
      <ScreenView>
        <FadeInUp style={styles.errorScreen}>
          <Text style={styles.title}>Couldn’t read that scan</Text>
          <View style={styles.errorCard}>
            <Text style={styles.errorText}>{analysisError}</Text>
          </View>
          <PrimaryButton label="Try Again" onPress={runAnalysis} style={styles.cta} />
          <SecondaryButton label="Use Demo Content Instead" onPress={useDemoInstead} style={styles.ctaAlt} />
        </FadeInUp>
      </ScreenView>
    );
  }

  return (
    <ScreenView>
      <FadeInUp>
        <Text style={styles.title}>Understanding your material</Text>

        <View style={styles.orbArea}>
          <Pulse style={styles.haloWrap} duration={3400}>
            <RadialGlow color={C.purple} opacity={0.22} style={styles.halo} />
          </Pulse>
          <Pulse style={styles.ringWrap} duration={3400} delay={600}>
            <View style={styles.ring} />
          </Pulse>
          <Spin style={styles.dashRingWrap} duration={14000}>
            <View style={styles.dashRing} />
          </Spin>

          <LinearGradient colors={['#2A2140', '#141426']} {...angle(150)} style={styles.core}>
            <Text style={styles.corePct}>{displayPct}%</Text>
          </LinearGradient>

          {PARTICLES.map((p, i) => (
            <Float
              key={i}
              duration={p.duration}
              delay={p.delay}
              style={[
                styles.particle,
                { left: p.left, right: p.right, top: p.top, bottom: p.bottom },
              ]}
            >
              <View
                style={{
                  width: p.size,
                  height: p.size,
                  borderRadius: 999,
                  backgroundColor: p.color,
                }}
              />
            </Float>
          ))}
        </View>

        <Bar progress={displayPct / 100} height={4} colors={G.progress} style={styles.bar} />

        <View style={styles.steps}>
          {steps.map(s => (
            <StepRow key={s.label} label={s.label} state={s.state} />
          ))}
        </View>

        <View style={styles.bookCard}>
          <Stripes variant="coverFine" style={styles.bookCover} />
          <View style={styles.flex}>
            <Text style={styles.bookEyebrow}>ANALYSING</Text>
            {hasRealScan ? (
              <>
                <Text style={styles.bookTitle}>Your scan</Text>
                <Text style={styles.bookMeta}>
                  {shots.length} page{shots.length === 1 ? '' : 's'} · reading with Claude
                </Text>
              </>
            ) : (
              <>
                <Text style={styles.bookTitle}>{BOOK.title}</Text>
                <Text style={styles.bookMeta}>
                  {BOOK.author} · {BOOK.pages} pages
                </Text>
              </>
            )}
          </View>
        </View>
      </FadeInUp>
    </ScreenView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  title: {
    fontFamily: F.semibold,
    fontSize: 22,
    letterSpacing: -0.4,
    color: C.text,
    textAlign: 'center',
  },

  orbArea: { height: 210, alignItems: 'center', justifyContent: 'center', marginVertical: 6 },
  haloWrap: { position: 'absolute', width: 196, height: 196 },
  halo: { width: 196, height: 196 },
  ringWrap: { position: 'absolute', width: 150, height: 150 },
  ring: {
    width: 150,
    height: 150,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: C.purpleA30,
  },
  dashRingWrap: { position: 'absolute', width: 118, height: 118 },
  dashRing: {
    width: 118,
    height: 118,
    borderRadius: 999,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: C.tealA35,
  },
  core: {
    width: 88,
    height: 88,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(124,92,255,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 0 44px rgba(124,92,255,0.5)',
  },
  corePct: { fontFamily: F.semibold, fontSize: 26, letterSpacing: -1, color: C.text },
  particle: { position: 'absolute' },

  bar: { marginBottom: 20 },
  steps: { gap: 11 },

  bookCard: {
    marginTop: 22,
    backgroundColor: C.surface,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 18,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 13,
  },
  bookCover: {
    width: 44,
    height: 60,
    borderRadius: 6,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: C.border2,
  },
  bookEyebrow: {
    fontFamily: F.semibold,
    fontSize: 10.5,
    letterSpacing: 1.4,
    color: C.purpleLight,
  },
  bookTitle: { fontFamily: F.semibold, fontSize: 15, color: C.text, marginTop: 2 },
  bookMeta: { fontFamily: F.regular, fontSize: 11.5, color: C.muted },

  errorScreen: { flex: 1, justifyContent: 'center' },
  errorCard: {
    marginTop: 18,
    backgroundColor: C.surface,
    borderWidth: 1,
    borderColor: C.redA25,
    borderRadius: 16,
    padding: 16,
  },
  errorText: { fontFamily: F.regular, fontSize: 13.5, lineHeight: 21, color: C.body },
  cta: { marginTop: 22 },
  ctaAlt: { marginTop: 10 },
});
