import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ScreenView } from '../components/ScreenView';
import { FadeInUp, GlowRing } from '../components/anim';
import { BackButton, PrimaryButton } from '../components/ui';
import { useAppState } from '../state/AppState';
import { angle, C, F, lh } from '../theme';
import type { RootStackParamList } from '../navigation/types';

type Nav = NativeStackNavigationProp<RootStackParamList>;

/**
 * "Teach me another way" — LearnOS switching teaching style mid-concept, and
 * showing the signal that made it switch.
 */
export function AnotherScreen() {
  const nav = useNavigation<Nav>();
  const { setApproach } = useAppState();

  const showVisual = () => {
    setApproach('visual');
    nav.navigate('Lesson');
  };

  return (
    <ScreenView contentStyle={styles.content}>
      <FadeInUp>
        <View style={styles.header}>
          <BackButton onPress={() => nav.navigate('Lesson')} />
          <Text style={styles.headerTitle}>Changing Approach</Text>
        </View>

        <View style={styles.previous}>
          <Text style={styles.eyebrow}>PREVIOUS APPROACH</Text>
          <Text style={styles.approachTitle}>Written Explanation</Text>
          <View style={styles.signalRow}>
            <View style={[styles.signalDot, { backgroundColor: C.amber }]} />
            <Text style={[styles.signalText, { color: C.amberLight }]}>
              Signal: low confidence · 54%
            </Text>
          </View>
        </View>

        <View style={styles.connector}>
          <View style={styles.connectorLine} />
          <View style={styles.connectorBadge}>
            <GlowRing duration={2600} color={C.purple} radius={999} blur={20} spread={2} />
            <View style={styles.connectorBadgeInner}>
              <Text style={styles.connectorArrow}>↓</Text>
            </View>
          </View>
          <View style={styles.connectorLine} />
        </View>

        <LinearGradient colors={['#221C3C', '#161628']} {...angle(150)} style={styles.next}>
          <Text style={[styles.eyebrow, { color: C.purpleLight }]}>NEW APPROACH</Text>
          <Text style={styles.nextTitle}>Visual Timeline</Text>
          <View style={styles.signalRow}>
            <View style={[styles.signalDot, { backgroundColor: C.green }]} />
            <Text style={[styles.signalText, { color: C.greenLight }]}>Predicted fit · 92%</Text>
          </View>
        </LinearGradient>

        <View style={styles.why}>
          <Text style={styles.whyLabel}>WHY THE CHANGE</Text>
          <Text style={styles.whyText}>
            Visual explanations have produced stronger understanding signals for you on causal,
            time-ordered concepts. Written explanations sit at 54%, visual at 92%, so I'm switching
            before we lose momentum.
          </Text>
        </View>

        <View style={styles.dots}>
          <View style={styles.dotIdle} />
          <View style={styles.dotActive} />
          <View style={styles.dotIdle} />
        </View>

        <PrimaryButton
          label="Show Me the Visual Version"
          onPress={showVisual}
          style={styles.cta}
        />
      </FadeInUp>
    </ScreenView>
  );
}

const styles = StyleSheet.create({
  content: { paddingTop: 4 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 22 },
  headerTitle: { fontFamily: F.semibold, fontSize: 17, color: C.text },

  eyebrow: { fontFamily: F.semibold, fontSize: 9.5, letterSpacing: 1.5, color: C.muted },
  previous: {
    backgroundColor: C.surfaceDim,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 18,
    padding: 16,
    opacity: 0.65,
  },
  approachTitle: { fontFamily: F.semibold, fontSize: 17, color: C.text, marginTop: 5 },
  signalRow: { flexDirection: 'row', alignItems: 'center', gap: 7, marginTop: 10 },
  signalDot: { width: 7, height: 7, borderRadius: 999 },
  signalText: { fontFamily: F.regular, fontSize: 12 },

  connector: { alignItems: 'center', gap: 4, paddingVertical: 14 },
  connectorLine: { width: 1, height: 14, backgroundColor: C.purpleA40 },
  connectorBadge: { width: 34, height: 34, alignItems: 'center', justifyContent: 'center' },
  connectorBadgeInner: {
    width: 34,
    height: 34,
    borderRadius: 999,
    backgroundColor: C.purpleA14,
    borderWidth: 1,
    borderColor: C.purpleA45,
    alignItems: 'center',
    justifyContent: 'center',
  },
  connectorArrow: { fontSize: 15, color: C.purpleSoft },

  next: {
    borderWidth: 1.5,
    borderColor: 'rgba(124,92,255,0.5)',
    borderRadius: 18,
    padding: 18,
    boxShadow: '0 16px 40px -18px rgba(124,92,255,0.7)',
  },
  nextTitle: {
    fontFamily: F.semibold,
    fontSize: 21,
    letterSpacing: -0.3,
    color: C.text,
    marginTop: 5,
  },

  why: {
    marginTop: 18,
    backgroundColor: C.surface,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 18,
    padding: 16,
  },
  whyLabel: { fontFamily: F.semibold, fontSize: 10.5, letterSpacing: 1.3, color: C.muted },
  whyText: {
    fontFamily: F.regular,
    fontSize: 13.5,
    lineHeight: lh(13.5, 1.7),
    color: C.body,
    marginTop: 8,
  },

  dots: { flexDirection: 'row', gap: 10, justifyContent: 'center', marginTop: 16 },
  dotIdle: { height: 5, width: 40, borderRadius: 999, backgroundColor: C.border2 },
  dotActive: { height: 5, width: 40, borderRadius: 999, backgroundColor: C.purple },

  cta: { marginTop: 20 },
});
