import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ScreenView } from '../components/ScreenView';
import { FadeInUp, GlowRing } from '../components/anim';
import { PrimaryButton, SectionLabel } from '../components/ui';
import { SignalBars } from '../components/SignalBars';
import { angle, C, F, lh } from '../theme';
import type { RootStackParamList } from '../navigation/types';

type Nav = NativeStackNavigationProp<RootStackParamList>;

/** Where the book's structure meets what LearnOS already knows about Alex. */
export function ProfileMatchScreen() {
  const nav = useNavigation<Nav>();

  return (
    <ScreenView>
      <FadeInUp>
        <Text style={styles.title}>Making this work for you</Text>
        <Text style={styles.subtitle}>Two sources of intelligence are being combined.</Text>

        <View style={styles.merge}>
          <LinearGradient
            colors={['#1B1A2E', '#141420']}
            {...angle(150)}
            style={[styles.source, styles.sourceLeft]}
          >
            <Text style={[styles.sourceLabel, { color: C.blueLight }]}>BOOK INTELLIGENCE</Text>
            <Text style={styles.sourceBody}>{'42 concepts\n8 themes\n14 prerequisites'}</Text>
          </LinearGradient>

          <LinearGradient
            colors={['#1B1A2E', '#141420']}
            {...angle(210)}
            style={[styles.source, styles.sourceRight]}
          >
            <Text style={[styles.sourceLabel, { color: C.tealLight }]}>LEARNER INTELLIGENCE</Text>
            <Text style={styles.sourceBody}>
              {'9 books studied\n218 concepts held\n74% confidence'}
            </Text>
          </LinearGradient>

          <View style={styles.mergeBadge}>
            <GlowRing duration={2800} color={C.purple} radius={999} blur={22} spread={2} />
            <View style={styles.mergeBadgeInner}>
              <Text style={styles.mergeBadgeText}>✳</Text>
            </View>
          </View>
        </View>

        <SectionLabel style={styles.label}>Your response signals</SectionLabel>
        <SignalBars />

        <View style={styles.note}>
          <Text style={styles.noteText}>
            LearnOS will lead with visual explanations and real-world examples, then check
            understanding with teach-back. These estimates keep changing as you learn.
          </Text>
        </View>

        <PrimaryButton
          label="Calculate My Pathway"
          onPress={() => nav.navigate('Building')}
          style={styles.cta}
        />
      </FadeInUp>
    </ScreenView>
  );
}

const styles = StyleSheet.create({
  title: {
    fontFamily: F.semibold,
    fontSize: 23,
    letterSpacing: -0.5,
    color: C.text,
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: F.regular,
    fontSize: 13,
    color: C.muted,
    textAlign: 'center',
    marginTop: 6,
  },

  merge: { height: 132, marginTop: 18, marginBottom: 4 },
  source: {
    position: 'absolute',
    top: 16,
    width: '48%',
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
  },
  sourceLeft: { left: 0, borderColor: C.blueA30 },
  sourceRight: { right: 0, borderColor: C.tealA30 },
  sourceLabel: { fontFamily: F.semibold, fontSize: 9.5, letterSpacing: 1.4 },
  sourceBody: {
    fontFamily: F.regular,
    fontSize: 11.5,
    color: C.body,
    marginTop: 8,
    lineHeight: lh(11.5, 1.7),
  },
  mergeBadge: {
    position: 'absolute',
    top: 32,
    alignSelf: 'center',
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  mergeBadgeInner: {
    width: 40,
    height: 40,
    borderRadius: 999,
    backgroundColor: C.bg,
    borderWidth: 1,
    borderColor: 'rgba(124,92,255,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mergeBadgeText: { fontSize: 17, color: C.purpleSoft },

  label: { marginTop: 10, marginBottom: 10 },
  note: {
    marginTop: 20,
    backgroundColor: C.purpleA08,
    borderWidth: 1,
    borderColor: C.purpleA24,
    borderRadius: 18,
    padding: 15,
  },
  noteText: {
    fontFamily: F.regular,
    fontSize: 13.5,
    lineHeight: lh(13.5, 1.6),
    color: C.purpleTint,
  },
  cta: { marginTop: 20 },
});
