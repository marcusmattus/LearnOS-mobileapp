import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ScreenView } from '../components/ScreenView';
import { FadeInUp, Pulse } from '../components/anim';
import { PrimaryButton, RadialGlow, Ring, SecondaryButton, StatTile } from '../components/ui';
import { useAppState } from '../state/AppState';
import { C, F, G } from '../theme';
import type { RootStackParamList } from '../navigation/types';

type Nav = NativeStackNavigationProp<RootStackParamList>;

/** The reward beat: a concept crosses into mastery and unlocks the next one. */
export function MasteryScreen() {
  const nav = useNavigation<Nav>();
  const { setAdapted, analysis, activeConceptIndex, advanceConcept } = useAppState();

  const live = !!analysis && analysis.concepts.length > 0 && activeConceptIndex < analysis.concepts.length;
  const concept = live ? analysis!.concepts[activeConceptIndex] : null;
  const total = live ? analysis!.concepts.length : 8;
  const masteredCount = live ? activeConceptIndex + 1 : 7;
  const bookPct = live ? Math.round((masteredCount / total) * 100) : 71;
  const next = live ? analysis!.concepts[activeConceptIndex + 1] : null;

  const toMap = () => {
    if (live) {
      advanceConcept();
    } else {
      setAdapted(true);
    }
    nav.navigate('Map');
  };

  return (
    <ScreenView scroll={false} contentStyle={styles.content}>
      <FadeInUp style={styles.flex}>
        <View style={styles.head}>
          <Text style={styles.eyebrow}>CONCEPT MASTERED</Text>
          <Text style={styles.title}>{concept?.name ?? 'Agricultural Revolution'}</Text>
        </View>

        <View style={styles.ringArea}>
          <Pulse style={styles.haloWrap} duration={3200}>
            <RadialGlow color={C.green} opacity={0.2} style={styles.halo} />
          </Pulse>
          <Ring size={150} stroke={9} progress={live ? 1 : 0.86} color={C.green} track={C.trackSoft}>
            <Text style={styles.masteryValue}>{live ? 100 : 86}%</Text>
            <Text style={styles.masteryLabel}>MASTERY</Text>
          </Ring>
        </View>

        <View style={styles.unlock}>
          <View style={styles.unlockIcon}>
            <Text style={styles.unlockGlyph}>✓</Text>
          </View>
          <View style={styles.flex}>
            <Text style={styles.unlockTitle}>
              {live ? (next ? `${next.name} unlocked` : 'Every concept mastered') : 'Societies unlocked'}
            </Text>
            <Text style={styles.unlockMeta}>
              {live && !next ? 'You’ve completed this learning path' : 'Next destination on your map'}
            </Text>
          </View>
        </View>

        <View style={styles.stats}>
          <StatTile value={live ? `${masteredCount}/${total}` : '7'} label="Mastered" deep />
          <StatTile value="13" label="Day streak" color={C.amber} deep />
          <StatTile value={`${bookPct}%`} label="Book mastery" color={C.purpleLight} deep />
        </View>

        <View style={styles.footer}>
          <PrimaryButton
            label="Continue"
            onPress={toMap}
            colors={G.mastery}
            textColor="#07120E"
            glow={false}
          />
          <SecondaryButton label="Explore Map" onPress={toMap} style={styles.ctaAlt} />
        </View>
      </FadeInUp>
    </ScreenView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: { paddingTop: 20 },
  head: { alignItems: 'center', marginTop: 22 },
  eyebrow: { fontFamily: F.semibold, fontSize: 10.5, letterSpacing: 2, color: C.green },
  title: {
    fontFamily: F.semibold,
    fontSize: 27,
    letterSpacing: -0.6,
    color: C.text,
    marginTop: 8,
    textAlign: 'center',
  },

  ringArea: { height: 210, alignItems: 'center', justifyContent: 'center', marginTop: 10 },
  haloWrap: { position: 'absolute', width: 190, height: 190 },
  halo: { width: 190, height: 190 },
  masteryValue: { fontFamily: F.semibold, fontSize: 38, letterSpacing: -1.5, color: C.greenLight },
  masteryLabel: { fontFamily: F.regular, fontSize: 10, letterSpacing: 1.4, color: C.muted },

  unlock: {
    backgroundColor: C.surface,
    borderWidth: 1,
    borderColor: C.greenA28,
    borderRadius: 20,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 13,
  },
  unlockIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: C.greenA14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  unlockGlyph: { fontSize: 16, color: C.green },
  unlockTitle: { fontFamily: F.semibold, fontSize: 15, color: C.text },
  unlockMeta: { fontFamily: F.regular, fontSize: 11.5, color: C.muted, marginTop: 2 },

  stats: { flexDirection: 'row', gap: 10, marginTop: 12 },
  footer: { marginTop: 'auto', paddingTop: 20 },
  ctaAlt: { marginTop: 10 },
});
