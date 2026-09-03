import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ScreenView } from '../components/ScreenView';
import { FadeInUp, Float, GlowRing } from '../components/anim';
import { BackButton, PrimaryButton, Ring } from '../components/ui';
import { useAppState } from '../state/AppState';
import { angle, C, F, G, lh } from '../theme';
import type { RootStackParamList } from '../navigation/types';

type Nav = NativeStackNavigationProp<RootStackParamList>;

const WAVE_HEIGHTS = [14, 30, 46, 24, 52, 18, 38, 28, 44, 16, 34, 22];
const WAVE_COLORS = [C.purple, C.purpleBright, C.blue, C.teal];

const STRONG = ['Main idea', 'Causes of the shift', 'Concrete example'];
const STRENGTHEN = ['Long-term consequences', 'Relationship with social hierarchy'];

/** The learner explains the concept back; LearnOS scores the explanation. */
export function TeachbackScreen() {
  const nav = useNavigation<Nav>();
  const { tbDone, setTbDone, setAdapted } = useAppState();

  const goAdapt = () => {
    setAdapted(true);
    nav.navigate('Adapt');
  };

  return (
    <ScreenView contentStyle={styles.content}>
      <FadeInUp>
        <View style={styles.header}>
          <BackButton onPress={() => nav.navigate('Practice')} />
          <Text style={styles.headerTitle}>Teach It Back</Text>
        </View>

        {!tbDone ? (
          <>
            <Text style={styles.prompt}>
              Explain the Agricultural Revolution in your own words.
            </Text>
            <Text style={styles.hint}>
              Rough and unpolished is fine — I'm listening for the causal chain.
            </Text>

            <View style={styles.modes}>
              <View style={[styles.mode, styles.modeActive]}>
                <Text style={[styles.modeText, styles.modeTextActive]}>VOICE</Text>
              </View>
              <View style={styles.mode}>
                <Text style={styles.modeText}>TEXT</Text>
              </View>
            </View>

            <View style={styles.recorder}>
              <View style={styles.wave}>
                {WAVE_HEIGHTS.map((h, i) => (
                  <Float key={i} duration={1100} delay={i * 100} distance={6}>
                    <View
                      style={[
                        styles.waveBar,
                        { height: h, backgroundColor: WAVE_COLORS[i % WAVE_COLORS.length] },
                      ]}
                    />
                  </Float>
                ))}
              </View>

              <Text style={styles.timer}>00:42 · listening</Text>

              <Pressable onPress={() => setTbDone(true)} accessibilityLabel="Stop recording">
                <GlowRing duration={2600} color={C.purple} radius={999} blur={30} spread={4} />
                <LinearGradient
                  colors={[C.purpleBright, C.purpleDark]}
                  {...angle(140)}
                  style={styles.stopBtn}
                >
                  <View style={styles.stopSquare} />
                </LinearGradient>
              </Pressable>
            </View>
          </>
        ) : (
          <FadeInUp>
            <View style={styles.scoreWrap}>
              <Ring size={132} stroke={9} progress={0.74} gradient={G.progress} track={C.trackSoft}>
                <Text style={styles.scoreValue}>74%</Text>
                <Text style={styles.scoreLabel}>UNDERSTANDING</Text>
              </Ring>
            </View>

            <View style={[styles.panel, { borderColor: C.greenA22 }]}>
              <Text style={[styles.panelLabel, { color: C.green }]}>STRONG</Text>
              <View style={styles.panelList}>
                {STRONG.map(item => (
                  <View key={item} style={styles.panelRow}>
                    <Text style={{ color: C.green }}>✓</Text>
                    <Text style={[styles.panelText, { color: C.greenText }]}>{item}</Text>
                  </View>
                ))}
              </View>
            </View>

            <View style={[styles.panel, styles.panelTight, { borderColor: C.amberA22 }]}>
              <Text style={[styles.panelLabel, { color: C.amber }]}>STRENGTHEN</Text>
              <View style={styles.panelList}>
                {STRENGTHEN.map(item => (
                  <View key={item} style={styles.panelRow}>
                    <Text style={{ color: C.amber }}>△</Text>
                    <Text style={[styles.panelText, { color: C.amberText }]}>{item}</Text>
                  </View>
                ))}
              </View>
            </View>

            <PrimaryButton
              label="Strengthen My Understanding"
              onPress={goAdapt}
              style={styles.cta}
            />
          </FadeInUp>
        )}
      </FadeInUp>
    </ScreenView>
  );
}

const styles = StyleSheet.create({
  content: { paddingTop: 4 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 18 },
  headerTitle: { fontFamily: F.semibold, fontSize: 17, color: C.text },

  prompt: { fontFamily: F.medium, fontSize: 20, lineHeight: lh(20, 1.45), color: C.text },
  hint: { fontFamily: F.regular, fontSize: 12.5, color: C.muted, marginTop: 8 },

  modes: { flexDirection: 'row', gap: 9, marginTop: 18 },
  mode: {
    flex: 1,
    paddingVertical: 11,
    borderRadius: 13,
    backgroundColor: C.surface,
    borderWidth: 1,
    borderColor: C.border,
    alignItems: 'center',
  },
  modeActive: { backgroundColor: C.purpleA16, borderColor: C.purpleA45 },
  modeText: { fontFamily: F.medium, fontSize: 12.5, color: C.muted },
  modeTextActive: { fontFamily: F.semibold, color: C.purpleSoft },

  recorder: {
    marginTop: 18,
    backgroundColor: C.surfaceDeep,
    borderWidth: 1,
    borderColor: 'rgba(124,92,255,0.22)',
    borderRadius: 22,
    paddingVertical: 26,
    paddingHorizontal: 18,
    alignItems: 'center',
    gap: 20,
  },
  wave: { flexDirection: 'row', alignItems: 'center', gap: 3, height: 56 },
  waveBar: { width: 3, borderRadius: 9 },
  timer: { fontFamily: F.mono, fontSize: 11, color: C.muted },
  stopBtn: {
    width: 76,
    height: 76,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stopSquare: { width: 22, height: 22, borderRadius: 5, backgroundColor: '#fff' },

  scoreWrap: { alignItems: 'center', paddingTop: 8, paddingBottom: 4 },
  scoreValue: { fontFamily: F.semibold, fontSize: 32, letterSpacing: -1, color: C.text },
  scoreLabel: { fontFamily: F.regular, fontSize: 10, letterSpacing: 1.4, color: C.muted },

  panel: {
    marginTop: 14,
    backgroundColor: C.surface,
    borderWidth: 1,
    borderRadius: 18,
    padding: 15,
  },
  panelTight: { marginTop: 11 },
  panelLabel: { fontFamily: F.semibold, fontSize: 10.5, letterSpacing: 1.3 },
  panelList: { gap: 8, marginTop: 10 },
  panelRow: { flexDirection: 'row', gap: 9 },
  panelText: { fontFamily: F.regular, fontSize: 13, flex: 1 },

  cta: { marginTop: 18 },
});
