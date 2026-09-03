import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ScreenView } from '../components/ScreenView';
import { FadeInUp, GlowDot } from '../components/anim';
import { PrimaryButton, SecondaryButton, StatTile } from '../components/ui';
import { useAppState } from '../state/AppState';
import { angle, C, F, lh } from '../theme';
import type { RootStackParamList } from '../navigation/types';

type Nav = NativeStackNavigationProp<RootStackParamList>;

const BEFORE = ['Agricultural Revolution', 'Societies', 'Money'];

/** Live path adaptation: what changed in the route, and why. */
export function AdaptScreen() {
  const nav = useNavigation<Nav>();
  const { setAdapted } = useAppState();

  const seeOnMap = () => {
    setAdapted(true);
    nav.navigate('Map');
  };

  return (
    <ScreenView contentStyle={styles.content}>
      <FadeInUp>
        <View style={styles.banner}>
          <GlowDot size={8} color={C.purple} duration={1600} />
          <Text style={styles.bannerText}>Your learning path changed</Text>
        </View>

        <View style={styles.compare}>
          {/* Before */}
          <View style={styles.before}>
            <Text style={styles.columnLabel}>BEFORE</Text>
            <View style={styles.column}>
              {BEFORE.map((step, i) => (
                <React.Fragment key={step}>
                  {i > 0 && <Text style={styles.arrow}>↓</Text>}
                  <View style={styles.step}>
                    <Text style={styles.stepText}>{step}</Text>
                  </View>
                </React.Fragment>
              ))}
            </View>
          </View>

          {/* After */}
          <LinearGradient colors={['#16221F', '#121220']} {...angle(160)} style={styles.after}>
            <Text style={[styles.columnLabel, { color: C.tealLight }]}>AFTER</Text>
            <View style={styles.columnTight}>
              <View style={[styles.step, styles.stepMastered]}>
                <Text style={[styles.stepText, { color: C.greenLight }]}>
                  Agricultural Revolution
                </Text>
              </View>
              <Text style={styles.arrowTeal}>↓</Text>
              <FadeInUp duration={500}>
                <View style={[styles.step, styles.stepNew]}>
                  <Text style={[styles.stepText, styles.stepTextNew]}>Food Surplus</Text>
                </View>
              </FadeInUp>
              <Text style={styles.arrowTeal}>↓</Text>
              <FadeInUp duration={500} delay={150}>
                <View style={[styles.step, styles.stepNew]}>
                  <Text style={[styles.stepText, styles.stepTextNew]}>Social Hierarchy</Text>
                </View>
              </FadeInUp>
              <Text style={styles.arrowTeal}>↓</Text>
              <View style={styles.step}>
                <Text style={styles.stepText}>Societies</Text>
              </View>
            </View>
          </LinearGradient>
        </View>

        <View style={styles.explain}>
          <View style={styles.explainHead}>
            <View style={styles.explainIcon}>
              <Text style={styles.explainGlyph}>✳</Text>
            </View>
            <Text style={styles.explainLabel}>WHAT I CHANGED</Text>
          </View>
          <Text style={styles.explainText}>
            You understood the main concept, but the connection to social hierarchy needs
            reinforcement. I've added two short steps before Societies — about 9 minutes total — and
            moved Money later so it builds on them.
          </Text>
        </View>

        <View style={styles.stats}>
          <StatTile value="+2" label="Support steps" color={C.tealLight} deep />
          <StatTile value="9 min" label="Added time" deep />
          <StatTile value="86%" label="Projected" color={C.green} deep />
        </View>

        <PrimaryButton
          label="Continue New Route"
          onPress={() => nav.navigate('Mastery')}
          style={styles.cta}
        />
        <SecondaryButton label="See It on the Map" onPress={seeOnMap} style={styles.ctaAlt} />
      </FadeInUp>
    </ScreenView>
  );
}

const styles = StyleSheet.create({
  content: { paddingTop: 4 },
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
    backgroundColor: C.purpleA12,
    borderWidth: 1,
    borderColor: C.purpleA35,
    borderRadius: 16,
    paddingVertical: 13,
    paddingHorizontal: 15,
  },
  bannerText: { fontFamily: F.semibold, fontSize: 14, letterSpacing: -0.1, color: C.text },

  compare: { flexDirection: 'row', gap: 12, marginTop: 18, alignItems: 'stretch' },
  before: {
    flex: 1,
    backgroundColor: C.surfaceDim,
    borderWidth: 1,
    borderColor: C.borderSoft,
    borderRadius: 18,
    padding: 14,
    opacity: 0.6,
  },
  after: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: C.tealA40,
    borderRadius: 18,
    padding: 14,
  },
  columnLabel: {
    fontFamily: F.semibold,
    fontSize: 9.5,
    letterSpacing: 1.4,
    color: C.muted,
    marginBottom: 12,
  },
  column: { alignItems: 'center', gap: 7 },
  columnTight: { alignItems: 'stretch', gap: 6 },
  step: {
    alignSelf: 'stretch',
    alignItems: 'center',
    paddingVertical: 9,
    paddingHorizontal: 6,
    borderRadius: 11,
    backgroundColor: C.surfaceAlt,
  },
  stepMastered: { backgroundColor: C.greenA14, borderWidth: 1, borderColor: C.greenA30 },
  stepNew: { backgroundColor: C.tealA14, borderWidth: 1, borderColor: C.tealA40 },
  stepText: { fontFamily: F.medium, fontSize: 11, color: C.text, textAlign: 'center' },
  stepTextNew: { fontFamily: F.semibold, color: C.tealLight },
  arrow: { fontSize: 12, color: C.muted },
  arrowTeal: { fontSize: 12, color: C.tealLight, textAlign: 'center' },

  explain: {
    marginTop: 18,
    backgroundColor: C.surface,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 18,
    padding: 16,
  },
  explainHead: { flexDirection: 'row', alignItems: 'center', gap: 9, marginBottom: 9 },
  explainIcon: {
    width: 24,
    height: 24,
    borderRadius: 8,
    backgroundColor: C.purpleA16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  explainGlyph: { fontSize: 12, color: C.purpleSoft },
  explainLabel: { fontFamily: F.semibold, fontSize: 10.5, letterSpacing: 1.3, color: C.purpleLight },
  explainText: {
    fontFamily: F.regular,
    fontSize: 13.5,
    lineHeight: lh(13.5, 1.7),
    color: C.body,
  },

  stats: { flexDirection: 'row', gap: 10, marginTop: 14 },
  cta: { marginTop: 20 },
  ctaAlt: { marginTop: 10 },
});
